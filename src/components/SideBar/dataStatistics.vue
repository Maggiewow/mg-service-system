<template>
  <div class="pend-page">
    <Tabs v-model="activeType">
      <TabPane label="群聊统计" name="group"></TabPane>
      <TabPane label="个人统计" name="single"></TabPane>
    </Tabs>
    <div class="list-block narrow-scroll-bar">
      <div class="filter-line">
        <Select class="filter-select" v-model="filterForm.org_id" placeholder="全部机构" clearable>
          <Option v-for="{ id, name } in orgOptions" :key="id" :label="name" :value="id">{{
            name
          }}</Option>
        </Select>
        <Select
          v-if="activeType === 'single'"
          class="filter-select"
          v-model="filterForm.type"
          placeholder="全部类型用户"
          clearable
        >
          <Option
            v-for="{ value, label } in roleOptions"
            :key="value"
            :label="label"
            :value="value"
            >{{ label }}</Option
          >
        </Select>

        <Input
          type="text"
          class="filter-input"
          placeholder="请输入内容"
          v-model="filterForm.keyword"
          clearable
        >
          <Icon type="ios-search" slot="suffix" />
        </Input>
      </div>

      <Table
        :columns="activeType === 'group' ? groupColumns : singleColumns"
        :data="dataList"
        :loading="isLoading"
        @on-sort-change="handleSortChange"
      ></Table>
      <Page class="page-show" :current="page" :total="total" @on-change="handlePageChange" />
    </div>
  </div>
</template>

<script>
import { fetchGroupStats, fetchSingleStats, fetchAllOrgs } from '@/api/chat';

export default {
  name: 'DataStatistics',
  data() {
    return {
      activeType: 'group',
      filterForm: { org_id: null, type: '', keyword: '', order_field: null, order_type: null },
      orgOptions: {},
      // 1 客服；2 管理员；3 普通用户
      roleOptions: [
        { value: 1, label: '客服' },
        { value: 2, label: '管理员' },
        { value: 3, label: '普通用户' },
      ],
      dataList: [],
      isLoading: false,
      columns: this.groupColumns,
      page: 1,
      total: 0,
      user: { id: '', displayName: '', orgid: '', avatar: '' },
      groupColumns: [
        {
          title: '群聊',
          key: 'group',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.group.name || '');
          },
        },
        {
          title: '人员数',
          key: 'person_amount',
          align: 'center',
          sortable: true,
        },
        {
          title: '消息数',
          key: 'message_amount',
          align: 'center',
          sortable: true,
        },
        {
          title: '标记数',
          key: 'mark_amount',
          align: 'center',
          sortable: true,
        },
        {
          title: '待办数',
          key: 'to_do_amount',
          align: 'center',
          sortable: true,
        },
        {
          title: '完成待办数',
          key: 'finish_amount',
          align: 'center',
          sortable: true,
        },
      ],
      singleColumns: [
        {
          title: '姓名',
          key: 'user',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.user.nickname || '');
          },
        },
        {
          title: '消息数',
          key: 'message_amount',
          align: 'center',
          sortable: true,
        },
        {
          title: '标记数',
          key: 'mark_amount',
          align: 'center',
          sortable: true,
        },
        {
          title: '待办数',
          key: 'to_do_amount',
          align: 'center',
          sortable: true,
        },
        {
          title: '完成待办数',
          key: 'finish_amount',
          align: 'center',
          sortable: true,
          //   render: (h, params) => {
          //     return h("span", params.row.create_user.nickname || "");
          //   }
        },
      ],
    };
  },
  watch: {
    activeType(key) {
      if (key) {
        this.filterForm = {
          org_id: null,
          type: '',
          keyword: '',
          order_field: null,
          order_type: null,
        };
        this.refreshParam();
      }
    },
    filterForm: {
      handler() {
        this.refreshParam();
      },
      deep: true,
    },
  },
  mounted() {
    let userInfo = sessionStorage.getItem('current_user');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }
    this.getAllOrgs();
    this.getDataList();
  },
  methods: {
    refreshParam() {
      this.page = 1;
      this.dataList = [];
      this.getDataList();
    },
    getAllOrgs() {
      fetchAllOrgs().then((res) => {
        console.log('机构列表', res.data.data);
        if (res.status === 200) {
          this.orgOptions = res.data.data;
        }
      });
    },
    getDataList() {
      const { org_id, type, keyword, order_field, order_type } = this.filterForm;

      if (this.activeType === 'group') {
        fetchGroupStats(this.page, org_id, keyword, order_field, order_type).then((res) => {
          console.log('群组-数据统计列表', res.data.data);
          if (res.status === 200) {
            const { list, total } = res.data.data;
            this.dataList = list;
            this.total = total;
          } else {
            this.$Message.error(res.data.msg);
          }
        });
      } else {
        fetchSingleStats(this.page, org_id, type, keyword, order_field, order_type).then((res) => {
          console.log('个人-数据统计列表', res.data.data);
          if (res.status === 200) {
            const { list, total } = res.data.data;
            this.dataList = list;
            this.total = total;
          } else {
            this.$Message.error(res.data.msg);
          }
        });
      }
    },
    // order_field(order_by)  order_type(sort)
    handleSortChange({ column, key, order }) {
      let order_type = order !== 'normal' ? order : null; // normal asc desc
      let order_field = order_type ? key : null;
      this.filterItems = {
        ...this.filterItems,
        order_field,
        order_type,
      };
    },
    handlePageChange(e) {
      this.page = e;
      this.getDataList();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-modal-wrap {
  z-index: 2002;
}
// /deep/ .ivu-table-body {
//   margin-top: -20px;
// }
// 待办事项
.pend-page {
  height: 100%;
  padding: 5px 15px 0;
  box-sizing: border-box;
  background-color: #fff;
  .ivu-tabs {
    height: 80px;
  }
  .list-block {
    padding: 0 15px 10px;
    max-height: 494px;
    overflow-y: scroll;
  }
  .filter-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/ .ivu-select-selection {
      display: flex;
      div {
        display: flex;
      }
    }
    /deep/ .ivu-input-wrapper {
      display: flex;
      align-items: center;
    }
    .filter-select {
      width: 200px;
      height: 32px;
    }
    .filter-input {
      width: 200px;
    }
  }
  .pend-list {
    margin: 10px 0;
    padding-bottom: 40px;
    overflow-y: scroll;
    height: 444px;
    .pend-item {
      margin: 10px 0;
      padding: 5px 15px;
      border: 1px solid #ececec;
      background: #fff;
      border-radius: 4px;
      font-size: 14px;
      line-height: 30px;

      display: flex;
      align-items: center;
      .pend-status {
        width: 10%;

        .checked-circle {
          margin-left: 5px;
          width: 18px;
          height: 18px;
          border-color: #409eff;
          border-radius: 100%;
          background: #409eff;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transition: transform 0.15s ease-in;
            transform: translate(-50%, -50%) scale(1);
            width: 6px;
            height: 6px;
            border-radius: 100%;
            background-color: #fff;
          }
        }
        .unchecked-circle {
          cursor: pointer;
          margin-left: 5px;
          width: 18px;
          height: 18px;
          border: 1px solid #dcdfe6;
          border-radius: 100%;
          background-color: #fff;
          box-sizing: border-box;
        }
        /deep/ .el-radio__inner {
          width: 18px;
          height: 18px;
          &::after {
            width: 6px;
            height: 6px;
          }
        }
      }
      .main-item {
        width: 90%;
      }
      .msg-content {
        padding: 4px 0;
        line-height: 20px;
        color: #333;
      }
      .send-user {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .user {
          margin-right: 20px;
          font-size: 12px;
          color: #333;
        }
        .time {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}
.page-show {
  text-align: center;
  margin-top: 20px;
  .ivu-page-item-jump-prev:after,
  .ivu-page-item-jump-next:after {
    content: '\2022\2022\2022';
  }
}
</style>
