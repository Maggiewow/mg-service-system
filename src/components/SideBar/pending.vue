<template>
  <div class="pend-page">
    <Tabs v-model="activePendKey">
      <TabPane label="我的待办" name="my"></TabPane>
      <TabPane label="所有待办" name="all"></TabPane>
    </Tabs>
    <div class="list-block">
      <div class="filter-line">
        <Select class="filter-select" v-model="filterForm.status" placeholder="选择状态" clearable>
          <Option
            v-for="{ value, label } in statusOptions"
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
      <div class="pend-list">
        <div class="pend-item" v-for="item in pendList" :key="item.taskId">
          <div class="pend-status">
            <!-- 1未处理 200完成 -->
            <div
              v-if="item.taskStatus === 1"
              class="unchecked-circle"
              title="完成"
              @click="handleComplete(item.taskId)"
            ></div>
            <div v-if="item.taskStatus === 200" class="checked-circle"></div>
          </div>
          <div class="main-item">
            <p
              class="msg-content"
              :style="item.taskStatus === 200 ? 'text-decoration: line-through;' : ''"
            >
              {{ item.taskContent }}
            </p>
            <div class="send-user">
              <p class="user">{{ item.taskWaiter }}</p>
              <p class="time">{{ item.createdAt }}</p>
            </div>
          </div>
        </div>
        <infinite-loading @infinite="infiniteHandler" :distance="200" :identifier="identifier">
          <span slot="no-more" class="gray-text">到底啦</span>
          <span slot="no-results" class="gray-text">
            {{ finished && pendList.length > 0 ? '到底啦' : '暂无数据' }}
          </span>
        </infinite-loading>
      </div>
    </div>

    <Modal
      v-model="completePop"
      class="modal-his"
      title="提示"
      width="400"
      :z-index="2000"
      @on-ok="confirmComplete"
      transfer
    >
      <p class="tips">确定已完成当前待办事项吗？</p>
    </Modal>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import { fetchPendingList, completePending } from '@/api/event';

export default {
  name: 'PendingList',
  components: {
    'infinite-loading': InfiniteLoading,
  },
  data() {
    return {
      activePendKey: 'my',
      filterForm: { status: null, keyword: '' },
      // 1未处理 200完成
      statusOptions: [
        { value: 1, label: '未处理' },
        { value: 200, label: '已完成' },
      ],
      pendList: [],
      page: 1,
      finished: false,
      user: { id: '', displayName: '', orgid: '', avatar: '' },
      waitTaskId: '',
      completePop: false,
    };
  },
  watch: {
    activePendKey(key) {
      if (key) {
        // this.filterForm = { status: null, keyword: '' };
        this.refreshParam();
      }
    },
    filterForm: {
      handler() {
        this.refreshParam();
        this.$nextTick(this.getPendList);
      },
      deep: true,
    },
  },
  computed: {
    identifier() {
      return this.activePendKey;
    },
  },
  mounted() {
    let userInfo = sessionStorage.getItem('current_user');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }

    this.getPendList();
  },
  methods: {
    refreshParam() {
      this.finished = false;
      this.page = 1;
      this.pendList = [];
    },
    getPendList(cb) {
      let pageNow = this.page;
      let type = this.activePendKey === 'my' ? 'my' : '';
      const { status, keyword } = this.filterForm;
      fetchPendingList(this.page, type, status, keyword).then((res) => {
        console.log('待办列表', res.data.data);
        if (res.status === 200) {
          const { list, num, pages } = res.data.data;
          // newsInfo taskInfo
          let info =
            list.map(({ taskInfo }) => ({
              ...taskInfo,
              taskWaiter: taskInfo.taskWaiter.map(({ name }) => name).join(' '),
            })) || [];

          if (pageNow === 1) {
            this.pendList = info;
          } else {
            this.pendList = this.pendList.concat(info);
          }

          if (pageNow >= pages) {
            this.page = pages;
            this.finished = true;
          } else {
            this.page = pageNow + 1;
          }
        } else {
          this.$Message.error(res.data.msg);
        }

        cb && cb();
      });
    },
    infiniteHandler($state) {
      if (this.finished) {
        return false;
      }

      this.getPendList(() => {
        this.finished ? $state.complete() : $state.loaded();
      });
    },
    handleComplete(waitTaskId) {
      this.waitTaskId = waitTaskId;
      this.completePop = true;
      // this.$Modal.confirm({
      //   title: '提示',
      //   content: '<p>确定已完成当前待办事项吗？</p>',
      //   loading: true,
      //   onOk: () => {
      //     completePending(waitTaskId)
      //       .then((res) => {
      //         if (res.status === 200) {
      //           this.$Modal.remove();
      //           this.$Message.success(res.data.msg);
      //           this.getPendList();
      //         } else {
      //           this.$Message.error(res.data.msg);
      //         }
      //       })
      //       .catch((err) => {
      //         console.log(err);
      //       });
      //   },
      // });
    },
    confirmComplete() {
      completePending(this.waitTaskId)
        .then((res) => {
          if (res.status === 200) {
            this.$Modal.remove();
            this.$Message.success(res.data.msg);
            this.waitTaskId = '';
            this.completePop = false;
            this.getPendList();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
// 待办事项
.pend-page {
  height: 100%;
  padding: 5px 15px 0;
  box-sizing: border-box;
  background-color: #f2f2f2;
  .ivu-tabs {
    height: 72px;
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
      width: 160px;
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
      margin-bottom: 10px;
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
</style>
