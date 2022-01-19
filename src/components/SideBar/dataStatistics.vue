<template>
  <div class="data-page">
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
        class="data-table"
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
import bus from '@/libs/bus';

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
            return h('span', params.row.group ? params.row.group.name : '');
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

    bus.$on('updatedata', () => {
      this.filterForm = {
        org_id: null,
        type: '',
        keyword: '',
        order_field: null,
        order_type: null,
      };
    });

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
        if (res.status === 200) {
          this.orgOptions = res.data.data;
        }
      });
    },
    getDataList() {
      const { org_id, type, keyword, order_field, order_type } = this.filterForm;

      if (this.activeType === 'group') {
        fetchGroupStats(this.page, org_id, keyword, order_field, order_type).then((res) => {
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
.data-page {
  height: 100%;
  width: 891px;
  padding: 5px 15px 0;
  box-sizing: border-box;
  background-color: #fff;
  .ivu-tabs {
    height: 72px;
  }
  .list-block {
    padding: 0 10px 10px 0;
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
  .data-table {
    margin-top: 10px;
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
