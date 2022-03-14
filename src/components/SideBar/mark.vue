<template>
  <div class="mark-page">
    <Tabs v-model="activeMarkKey" class="cs-theme-tab-size">
      <TabPane label="我的标记" name="my"></TabPane>
      <TabPane label="所有标记" name="all"></TabPane>
    </Tabs>
    <div class="list-block narrow-scroll-bar">
      <div class="filter">
        <Input type="text" placeholder="请输入内容" v-model="markKeyword" clearable>
          <Icon type="ios-search" slot="suffix" />
        </Input>
      </div>
      <div class="mark-list">
        <div class="mark-item" v-for="item in markList" :key="item.id">
          <div class="top-user cs-theme-grey-size">{{ item.markUserName }}</div>
          <!-- <p class="msg-content">{{ item.newsContent }}</p> -->

          <p v-if="item.type === 'text'" class="msg-content cs-theme-normal-size">
            {{ item.newsContent.content }}
          </p>
          <img
            v-if="item.type === 'image'"
            class="content-img"
            :src="item.newsContent.content"
            alt=""
          />
          <div
            v-if="item.type === 'file'"
            class="content-file"
            title="点击下载"
            @click="downloadFile(item.newsContent.fileUrl)"
          >
            <div class="content-file__inner">
              <p class="content-file__name cs-theme-normal-size">{{ item.newsContent.name }}</p>
              <p class="content-file__byte cs-theme-grey-size">
                {{ computeFileSize(item.newsContent.size) }}
              </p>
            </div>
            <div class="content-file__sfx">
              <i class="lemon-icon-attah" />
            </div>
          </div>

          <div class="send-user cs-theme-grey-size">
            <p class="user">来自：{{ item.newsUserName }}</p>
            <p class="time">{{ item.pushTime }}</p>
          </div>
          <div class="group-name cs-theme-grey-size">
            <p class="user">{{ calcDisplayName(item) }}</p>
            <i class="iconfont icon-jinru" title="查看" @click="checkHistory(item)"></i>
          </div>
        </div>
        <infinite-loading @infinite="infiniteHandler" :distance="200" :identifier="identifier">
          <span slot="no-more" class="gray-text">到底啦</span>
          <span slot="no-results" class="gray-text">
            {{ finished && markList.length > 0 ? '到底啦' : '暂无数据' }}
          </span>
        </infinite-loading>
      </div>
    </div>
    <Modal
      v-model="historyPop"
      class="modal-his"
      title="查看上下文"
      width="600"
      :z-index="2000"
      footer-hide
      transfer
    >
      <history-record v-if="historyPop" :contact="historyItem" />
    </Modal>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';

import HistoryRecord from './history.vue';
import { fetchMarkList } from '@/api/event';
import bus from '@/libs/bus';

const TYPE_MSG_OBJ = {
  'RC:ReferenceMsg': 'text',
  'RC:TxtMsg': 'text',
  'RC:ImgMsg': 'image',
  'RC:FileMsg': 'file',
  'RC:InfoNtf': 'event',
};

export default {
  name: 'MarkList',
  components: {
    'infinite-loading': InfiniteLoading,
    'history-record': HistoryRecord,
  },
  data() {
    return {
      activeMarkKey: 'my',
      markKeyword: '',
      markList: [],
      page: 1,
      finished: false,
      user: { id: '', displayName: '', orgid: '', avatar: '' },
      historyPop: false,
      historyItem: {},
    };
  },
  watch: {
    activeMarkKey(key) {
      if (key) {
        this.markKeyword = '';
        this.refreshParam();
      }
    },
    markKeyword() {
      this.refreshParam();
      this.$nextTick(this.getMarkList);
    },
  },
  computed: {
    identifier() {
      return this.activeMarkKey;
    },
  },
  mounted() {
    let userInfo = sessionStorage.getItem('current_user');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }

    bus.$on('updatemark', () => {
      this.markKeyword = '';
      this.refreshParam();
      this.$nextTick(this.getMarkList);
    });
    this.getMarkList();
  },
  methods: {
    calcDisplayName(item) {
      if (item.groupId && item.groupId !== '0') {
        return item.groupName || '群聊';
      }

      // 单聊 展示当前用户与之聊天的人
      let otherName = '';

      // 标记人 markUserId markUserName
      // 消息接收方 toUserId toUserName

      if (String(item.markUserId) !== this.user.id) {
        otherName = item.markUserName;
      } else if (String(item.toUserId) !== this.user.id) {
        otherName = item.toUserName;
      } else {
        otherName = item.newsUserName;
      }

      return otherName;
    },
    computeFileSize(byte) {
      let str = byte;
      let unit = 'B';
      if (byte < 1024) {
        str = byte;
        unit = 'B';
      } else if (byte >= 1024 && byte < 1024 * 1024) {
        str = (byte / 1024).toFixed(2);
        unit = 'K';
      } else if (byte >= 1024 * 1024) {
        str = (byte / (1024 * 1024)).toFixed(2);
        unit = 'M';
      }
      str = str.replace('.00', '');

      return str + unit;
    },
    downloadFile(url) {
      window.open(url);
    },
    refreshParam() {
      this.finished = false;
      this.page = 1;
      this.markList = [];
    },
    getMarkList(cb) {
      let pageNow = this.page;
      let type = this.activeMarkKey === 'my' ? 'my' : '';
      fetchMarkList(this.page, type, this.markKeyword).then((res) => {
        if (res.status === 200) {
          const { list, num, pages } = res.data.data;
          let info = list.map((item) => ({
            ...item,
            type: TYPE_MSG_OBJ[item.imType] || 'text',
          }));

          if (pageNow === 1) {
            this.markList = info;
          } else {
            this.markList = this.markList.concat(info);
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

        setTimeout(() => {
          cb && cb();
        }, 300);
      });
    },

    infiniteHandler($state) {
      if (this.finished) {
        $state.complete();
        return false;
      }

      this.getMarkList(() => {
        this.finished ? $state.complete() : $state.loaded();
      });
    },
    checkHistory(item) {
      this.historyItem = item;
      this.historyPop = true;
    },
  },
};
</script>

<style lang="less" scoped>
// 重要标记
.mark-page {
  height: 100%;
  padding: 5px 15px 0;
  box-sizing: border-box;
  background-color: #f2f2f2;
  .ivu-tabs {
    height: 72px;
  }

  .list-block {
    height: 490px;
    overflow-y: scroll;

    .filter .ivu-input-wrapper {
      width: 300px;
      display: flex;
      align-items: center;
    }
    .mark-list {
      margin: 10px 0;
      padding-bottom: 40px;
      .mark-item {
        margin-bottom: 10px;
        padding: 5px 15px;
        border: 1px solid #ececec;
        background: #fff;
        border-radius: 4px;
        // font-size: 14px;
        line-height: 30px;
        .top-user {
          font-size: 14px;
          text-align: right;
          color: #999;
        }
        // 消息体样式
        .msg-content {
          padding: 4px 0;
          line-height: 20px;
          color: #333;
        }
        .content-img {
          width: 60px;
          height: 60px;
        }
        .content-file {
          display: flex;
          cursor: pointer;
          width: 200px;
          background: #fff;
          padding: 12px 18px;
          color: #666;
          border: 1px solid #ececec;
          border-radius: 4px;
          .content-file__inner {
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            .content-file__name {
              font-size: 14px;
            }
            .content-file__byte {
              font-size: 12px;
              color: #aaa;
            }
          }
          .content-file__sfx {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 34px;
            color: #ccc;
          }
        }

        .send-user {
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .user {
            margin-right: 20px;
            color: #666;
          }
          .time {
            color: #999;
          }
        }
        .group-name {
          font-size: 12px;
          border-top: 1px solid #ececec;
          color: #666;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .user {
            margin-right: 20px;
            color: #666;
          }
          .icon-jinru {
            padding: 0 10px;
            cursor: pointer;
            font-size: 18px;
            color: #999;
          }
        }
      }
    }
  }
}
.modal-his {
  background-color: #fff;
}
</style>
