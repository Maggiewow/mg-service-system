<!--
 * @文件描述: 
 * @公司: 广电信通
 * @作者: 赵婷婷
 * @Date: 2021-12-24 15:26:54
 * @LastEditors: 赵婷婷
 * @LastEditTime: 2021-12-30 14:50:32
-->

<template>
  <div class="history-main">
    <div class="history-list narrow-scroll-bar" ref="chatlist">
      <p class="gray-text more-btn" v-if="!beforeFinished" @click="getBeforeChatList">
        {{ beforeLoading ? '加载中...' : '查看更多' }}
      </p>
      <p class="gray-text" v-if="beforeFinished">暂无更多了</p>

      <div
        v-for="(item, index) in historyList"
        :key="index"
        :class="['per-info', 'history-item', contact.imId === item.id && 'cur-history-item']"
      >
        <div class="left-avatar">
          <img :src="item.avatar" alt="头像" />
        </div>
        <div class="right-infos">
          <div class="send-user">
            <p class="user">{{ item.sendUser }}</p>
            <p class="time">{{ item.sendTime }}</p>
          </div>
          <!-- TODO 回复 -->
          <p v-if="item.type === 'text'" class="msg-content">{{ item.content.content }}</p>
          <img
            v-if="item.type === 'image'"
            class="content-img"
            :src="item.content.content"
            alt=""
          />
          <div
            v-if="item.type === 'file'"
            class="content-file"
            title="点击下载"
            @click="downloadFile(item.content.fileUrl)"
          >
            <div class="content-file__inner">
              <p class="content-file__name">{{ item.content.name }}</p>
              <p class="content-file__byte">{{ computeFileSize(item.content.size) }}</p>
            </div>
            <div class="content-file__sfx">
              <i class="lemon-icon-attah" />
            </div>
          </div>
        </div>
      </div>

      <infinite-loading v-if="afterId" @infinite="infiniteHandler">
        <span slot="no-more" class="gray-text">到底啦</span>
        <span slot="no-results" class="gray-text">
          {{ afterFinished && historyList.length > 0 ? '到底啦' : '暂无数据' }}
        </span>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import { fetchMessageContext, fetchMessageHistory } from '@/api/chat';
import { reverseArray } from '@/libs/tools';

const TYPE_MSG_OBJ = {
  'RC:ReferenceMsg': 'text',
  'RC:TxtMsg': 'text',
  'RC:ImgMsg': 'image',
  'RC:FileMsg': 'file',
  'RC:InfoNtf': 'event',
};

export default {
  name: 'HistoryRecord',
  components: {
    'infinite-loading': InfiniteLoading,
  },
  data() {
    return {
      historyList: [],
      historyContent: '',
      finished: false,
      // 分前后
      beforeId: '',
      afterId: '',
      beforeFinished: false,
      afterFinished: false,
      lastScrollTop: 0,
      msgLoading: false,
      beforeLoading: false,
    };
  },
  props: {
    contact: {
      type: Object,
    },
    closeMethod: {
      type: Function,
      default: () => {},
    },
  },
  mounted() {
    this.getChatList();
  },
  methods: {
    closePop() {
      this.closeMethod();
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
    getChatList() {
      this.msgLoading = true;
      fetchMessageContext(this.contact.imId).then((res) => {
        if (res.status === 200) {
          let list = res.data.data.map(
            ({ id, content, from_user, msg_timestamp, object_name }) => ({
              id,
              content: content,
              avatar: from_user.avatar,
              sendUser: from_user.nickname,
              sendTime: msg_timestamp,
              type: TYPE_MSG_OBJ[object_name],
            })
          );
          this.historyList = list;

          this.setParamsInit(list);
          setTimeout(this.setPosition, 0);
          // this.setScrollInit();
        } else {
          this.$Message.error(res.data.msg);
        }
        this.msgLoading = false;
      });
    },

    getBeforeChatList() {
      if (this.beforeLoading) return;

      this.beforeLoading = true;
      fetchMessageHistory(this.beforeId, -1)
        .then((res) => {
          console.log('接口获取历史记录列表 Before', res);

          if (res.status === 200) {
            if (!res.data.data || res.data.data.length === 0) {
              this.beforeFinished = true;
              return;
            }

            let list = res.data.data.map(
              ({ id, content, from_user, msg_timestamp, object_name }) => ({
                id,
                content: content,
                avatar: from_user.avatar,
                sendUser: from_user.nickname,
                sendTime: msg_timestamp,
                type: TYPE_MSG_OBJ[object_name],
              })
            );
            let start = list[0];
            start && (this.beforeId = start.id);
            reverseArray(list).forEach((item) => {
              this.historyList.unshift(item);
            });
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.beforeLoading = false;
        });
    },
    getAfterChatList(cb) {
      if (!this.afterId) {
        cb && cb();
        return;
      }

      this.msgLoading = true;
      fetchMessageHistory(this.afterId, 1).then((res) => {
        console.log('接口获取历史记录列表 After', res);

        if (res.status === 200) {
          if (!res.data.data || res.data.data.length === 0) {
            this.afterFinished = true;
            cb && cb();
            return;
          }

          let list = res.data.data.map(
            ({ id, content, from_user, msg_timestamp, object_name }) => ({
              id,
              content: content,
              avatar: from_user.avatar,
              sendUser: from_user.nickname,
              sendTime: msg_timestamp,
              type: TYPE_MSG_OBJ[object_name],
            })
          );
          let end = list[list.length - 1];
          end && (this.afterId = end.id);
          this.historyList = this.historyList.concat(list);
        } else {
          this.$Message.error(res.data.msg);
        }

        cb && cb();
        this.msgLoading = true;
      });
    },
    infiniteHandler($state) {
      if (this.afterFinished) {
        $state.complete();
        return false;
      }

      this.getAfterChatList(() => {
        this.afterFinished ? $state.complete() : $state.loaded();
      });
    },
    setParamsInit(list) {
      let start = list[0];
      let end = list[list.length - 1];
      if (start) {
        this.beforeId = start.id;
      }
      if (end) {
        this.afterId = end.id;
      }
      this.beforeFinished = !start;
      this.afterFinished = !end;
    },
    setPosition() {
      let curList = this.historyList.filter(({ id }) => id === this.contact.imId);
      if (curList && curList.length === 1) {
        let curDom = document.querySelector('.cur-history-item');
        curDom.scrollIntoView && curDom.scrollIntoView({ behavior: 'smooth' });
      }
    },
    // 监听这个dom的scroll事件 处理向上滚动加载更多 暂时弃用
    setScrollInit() {
      this.chatDom = this.$refs.chatlist;
      this.chatDom.onscroll = () => {
        if (this.lastScrollTop !== 0 && this.chatDom.scrollTop === 0) {
          console.log('on scroll top top');
          setTimeout(() => {
            !this.msgLoading && this.getBeforeChatList(); // getCommentList方法中设置msgLoading
          }, 500);
        }
        this.lastScrollTop = this.chatDom.scrollTop;
      };
    },
  },
};
</script>

<style lang="less" scoped>
// 历史记录
.history-main {
  .history-list {
    max-height: 500px;
    overflow-y: scroll;
    padding-bottom: 40px;
    .history-item {
      padding: 10px 15px;
      border-bottom: 1px solid #ececec;
      border-radius: 4px;
      font-size: 14px;
      line-height: 30px;
      display: flex;

      .left-avatar {
        margin: 10px 10px 0 0;
        width: 35px;
        height: 35px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 2px;
          overflow: hidden;
        }
      }
      .right-infos {
        width: 460px;
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
        }
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
      }
    }
    .cur-history-item {
      background-color: #ebebeb;
    }

    .gray-text {
      color: #999;
      padding: 15px;
      text-align: center;
    }
    .more-btn {
      cursor: pointer;
      color: rgb(35, 130, 219);
    }
  }
}
</style>
