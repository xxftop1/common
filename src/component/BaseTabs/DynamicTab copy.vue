<template>
  <el-tabs
    class="dynamic-tab"
    v-model="activeIndex"
    @tab-remove="handleRemove"
    @tab-click="handleClick"
    type="card"
  >
    <template v-if="showTabs.length">
      <el-tab-pane
        v-for="(item, index) in showTabs"
        :key="index"
        :label="item.title"
        :labelContent="() => item"
        :name="item.id || item.path"
        closable
      ></el-tab-pane>
    </template>
    <template v-else>
      <el-tab-pane
        label="标签栏空空如也，快去加点东西吧~"
        name="no-tabs"
        disabled
      ></el-tab-pane>
    </template>
  </el-tabs>
</template>

<script>
export default {
  name: "DynamicTab",
  props: {
    routes: {
      type: Array,
      default: () => [],
    },
    // currentTab: {
    //   type: Object,
    //   default: () => {},
    // },
    // tabs: {
    //   type: Array,
    //   default: () => [],
    // },
  },
  data() {
    return {
      activeIndex: "",
      currentTab: {},
      currentTabId: "",
      tabs: [],
      order: 0,
    };
  },
  mounted() {
    this.handleTab(this.$route);
  },
  computed: {
    showTabs() {
      if (this.tabs.length === 0) {
        return [];
      }
      return this.tabs.sort(function (a, b) {
        return a.order - b.order;
      });
    },
  },
  watch: {
    currentTabId(v) {
      if (v !== "" && v !== this.activeIndex) {
        this.activeIndex = v;
      }
    },
    $route(to, from) {
      this.handleTab(to, from);
    },
  },
  methods: {
    handleTab(to, from) {
      const { path, params, meta } = to;
      if (meta.showTab !== undefined && !meta.showTab) {
        return;
      }
      let toPath = null;
      if (path === "/") {
        // 初始化
        toPath = this.routes[0].childNode[0];
        toPath.order = this.order;
        this.order++;
        this.tabs.push(toPath);
      } else if (to && this.tabs.findIndex((ele) => ele.path === path) === -1) {
        toPath = Object.assign({}, meta);
        toPath.path = path;
        if (params && params.name) {
          toPath.title = params.name;
        }
        toPath.order = this.order;
        this.order++;
        this.tabs.push(toPath);
      } else {
        toPath = meta;
        toPath.path = path;
        if (params && params.name) {
          toPath.title = params.name;
        }
      }
      this.currentTab = toPath;
      this.currentTabId = this.currentTab.path;
    },
    handleRemove(id) {
      if (typeof id !== "string") id = id.toString();
      if (this.tabs.length > 0) {
        let index = this.tabs.findIndex((ele) => ele.path === id);
        if (index !== -1) {
          this.tabs.splice(index, 1);
        }
        let nextTab = this.tabs[index] || this.tabs[index + 1] || this.tabs[index - 1];
        if (nextTab) {
          this.currentTab = nextTab;
          this.currentTabId = this.currentTab.path;
        }
        this.toUrl();
      }
    },
    handleClick(tab) {
      this.currentTab = Object.assign({}, tab.labelContent());
      this.currentTabId = this.currentTab.path;
      this.toUrl();
    },
    toUrl() {
      const { title, path, query } = this.currentTab;
      if (title) {
        document.title = title;
        if (query != undefined) {
          this.$router.push({
            path: path,
            query: { ...q },
          });
        } else {
          this.$router.push(path);
        }
      }
    },
  },
  destroyed() {
    // 如果有需要在切换模式后清空前一种模式的动态标签历史，就将这里解注释
    // this.removeLocalCache(this.localCacheKey);
    if (this.currentTab) {
      this.currentTab = [];
    }
    if (this.tabs) {
      this.tabs = [];
    }
  },
};
</script>
<style lang="scss">
.dynamic-tab {
  position: fixed;
  bottom: 0;
  width: 100%;
  &.el-tabs--card.el-tabs--top {
    > .el-tabs__header.is-top {
      margin: 0;
      background-color: $--table-header-background-color;
      height: 40px;
      box-shadow: 0px -2px 6px 0px rgba(69, 72, 81, 0.2);
      > .el-tabs__nav-wrap.is-top {
        > .el-tabs__nav-scroll {
          > .el-tabs__nav.is-top {
            border: none;
            > .el-tabs__item {
              height: 40px;
              line-height: 40px;
              font-size: 14px;
              font-weight: 400;
              color: $--color-black;
              border-top: 2px solid transparent;
              // border-left-color: #f2f2f2;
              border-bottom: none;
              // &:hover:not(#tab-no-tabs) {
              //   border-top-color: rgba($--color-primary, 0.5);
              //   background: $--menu-item-hover-fill;
              // }
              &.is-active {
                background: $--background-color-base;
                border-top-color: $--color-primary;
                &,
                &:hover {
                  color: $--color-primary;
                }
              }
              padding-left: 20px;
              padding-right: 20px;

              .el-icon-close {
                width: 12px;
                height: 12px;
                // background: $tab-bgclose;
                border-radius: 1px;
                margin-left: 20px;
              }
            }
          }
        }

        .el-tabs__nav-prev {
          border-right: 1px solid #eee;
        }
        .el-tabs__nav-next {
          border-left: 1px solid #eee;
        }

        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          width: 19px;
          text-align: center;
          line-height: 38px;
          > i {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
