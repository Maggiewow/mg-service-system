<template>
  <div class="collect-page">
    <Tabs v-model="activeType">
      <TabPane label="文字" name="text"></TabPane>
      <TabPane label="图片" name="image"></TabPane>
      <TabPane label="视频" name="video"></TabPane>
      <TabPane label="文件" name="file"></TabPane>
    </Tabs>
    <div class="filter">
      <Input
        type="text"
        style="width: 300px"
        placeholder="请输入内容"
        v-model="collectKeyword"
        clearable
      >
        <Icon type="ios-search" slot="suffix" />
      </Input>
    </div>
    <div class="collect-list narrow-scroll-bar">
      <div class="collect-item" v-for="item in collectList" :key="item.id">
        <div class="top-user">{{ item.collectUserName }}</div>
        <!-- <p class="msg-content">{{ item.newsContent }}</p> -->

        <p v-if="item.type === 'text'" class="msg-content">{{ item.newsContent.content }}</p>
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
            <p class="content-file__name">{{ item.newsContent.name }}</p>
            <p class="content-file__byte">{{ computeFileSize(item.newsContent.size) }}</p>
          </div>
          <div class="content-file__sfx">
            <i class="lemon-icon-attah" />
          </div>
        </div>

        <div class="send-user">
          <p class="user">来自：{{ item.newsUserName }}</p>
          <p class="time">{{ item.pushTime }}</p>
        </div>
        <div class="group-name">
          <p class="user">{{ calcDisplayName(item) }}</p>
          <i class="iconfont icon-jinru" title="查看" @click="checkHistory(item)"></i>
        </div>
      </div>
      <infinite-loading @infinite="infiniteHandler" :distance="200" :identifier="identifier">
        <span slot="no-more" class="gray-text">到底啦</span>
        <span slot="no-results" class="gray-text">
          {{ finished && collectList.length > 0 ? '到底啦' : '暂无数据' }}
        </span>
      </infinite-loading>
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
import { fetchCollectList } from '@/api/event';
import bus from '@/libs/bus';

const TYPE_MSG_OBJ = {
  'RC:ReferenceMsg': 'text',
  'RC:TxtMsg': 'text',
  'RC:ImgMsg': 'image',
  'RC:FileMsg': 'file',
  'RC:InfoNtf': 'event',
};

export default {
  name: 'CollectList',
  components: {
    'infinite-loading': InfiniteLoading,
    'history-record': HistoryRecord,
  },
  data() {
    return {
      activeType: 'text',
      collectKeyword: '',
      collectList: [],
      page: 1,
      finished: false,
      user: { id: '', displayName: '', orgid: '', avatar: '' },
      historyPop: false,
      historyItem: {},
    };
  },
  watch: {
    activeType(key) {
      if (key) {
        this.collectKeyword = '';
        this.refreshParam();
      }
    },
    collectKeyword() {
      this.refreshParam();
      this.$nextTick(this.getCollectList);
    },
  },
  computed: {
    identifier() {
      return this.activeType;
    },
  },
  mounted() {
    let userInfo = sessionStorage.getItem('current_user');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
    }
    bus.$on('updatecollect', () => {
      this.collectKeyword = '';
      this.refreshParam();
      this.$nextTick(this.getCollectList);
    });

    this.getCollectList();
  },
  methods: {
    calcDisplayName(item) {
      if (item.groupId && item.groupId !== '0') {
        return item.groupName || '群聊';
      }

      // 单聊 展示当前用户与之聊天的人
      let otherName = '';

      // 标记人 collectUserId collectUserName
      // 消息接收方 toUserId toUserName

      if (String(item.collectUserId) !== this.user.id) {
        otherName = item.collectUserName;
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
      this.collectList = [];
    },
    getCollectList(cb) {
      console.log('getCollectList');
      let pageNow = this.page;
      fetchCollectList(this.page, this.activeType, this.collectKeyword).then((res) => {
        console.log('收藏列表', res.data.data);
        if (res.status === 200) {
          const { list = [], pages = 1 } = res.data.data;
          let info = list.map((item) => ({
            ...item,
            type: TYPE_MSG_OBJ[item.imType] || 'text',
          }));

          if (pageNow === 1) {
            this.collectList = info;
          } else {
            this.collectList = this.collectList.concat(info);
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

      this.getCollectList(() => {
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
.collect-page {
  height: 100%;
  padding: 5px 15px 0;
  box-sizing: border-box;
  background-color: #f2f2f2;
  .ivu-tabs {
    height: 72px;
  }

  .filter .ivu-input-wrapper {
    width: 300px;
    display: flex;
    align-items: center;
  }
  .collect-list {
    margin: 10px 0;
    padding-bottom: 40px;
    overflow-y: scroll;
    height: 444px;
    .collect-item {
      margin-bottom: 10px;
      padding: 5px 15px;
      border: 1px solid #ececec;
      background: #fff;
      border-radius: 4px;
      font-size: 14px;
      line-height: 30px;
      .top-user {
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        .user {
          margin-right: 20px;
          font-size: 12px;
          color: #666;
        }
        .time {
          color: #999;
          font-size: 12px;
        }
        .icon-jinru {
          padding: 0 10px;
          cursor: pointer;
          font-size: 18px;
          color: #999;
        }
      }
      .group-name {
        border-top: 1px solid #ececec;
        font-size: 12px;
        color: #666;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .user {
          margin-right: 20px;
          font-size: 12px;
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
.modal-his {
  background-color: #fff;
}
</style>
