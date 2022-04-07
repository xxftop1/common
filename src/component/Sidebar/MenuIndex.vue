<template>
  <div class="sidebar">
    <!--<div
      class="sidebar-title aside-icon"
      :class="asideShow === false ? 'headers-left-active' : ''"
      @click="targetIcon"
    >
      <i
        :class="[targetIcon ? 'iconfont icon-shouqi-copy' : 'iconfont icon-zhankai']"
        class="sidebar-fold"
      ></i>
    </div> -->
    <div class="sidebar-box">
      <el-menu
        :default-openeds="defaultOpeneds"
        :default-active="activeMenu"
        text-color="#4d4d4d"
        :unique-opened="false"
        active-text-color="#6b7db3"
        :collapse-transition="false"
        mode="vertical"
      >
        <SidebarItem
          v-for="route in routes"
          :key="route.uri"
          :item="route"
          :base-path="route.uri"
          class="parent"
        >
        </SidebarItem>
      </el-menu>
    </div>
    <span>{{ activeTab }}</span>
  </div>
</template>

<script>
import SidebarItem from "./SidebarItem";
import { mapState } from "vuex";
export default {
  components: { SidebarItem },
  props: {
    asideShow: {
      type: Boolean,
      default: true,
    },
    routes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      defaultOpeneds: this.routes.map((ele) => ele.id + ""),
      activeMenu: this.routes[0].children[0].uri,
    };
  },
  computed: {
    ...mapState("global", ["activeTab"]),
    ...mapState(["pageUrl"]),
  },
  watch: {
    activeTab(v) {
      this.activeMenu = v.path;
    },
  },
  mounted() {
    if (this.pageUrl) {
      this.$router.push(this.pageUrl);
      return;
    }
    this.$router.push(this.activeMenu);
  },
  methods: {
    targetIcon() {
      this.$emit("targetIcon");
    },
  },
};
</script>

<style scoped lang="scss">
.sidebar {
  width: 100%;
  height: 100%;
}
.sidebar-title {
  width: 100%;
  height: 50px;
  // border-bottom: 1px solid #dcdfe6;
  color: #ffffff;
  box-sizing: border-box;
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  .sidebar-fold {
    font-size: 20px;
    padding: 4px 0;
    opacity: 0.6;
  }
}
.aside-icon {
  background: $--base-background;
  text-align: center;
  color: #888;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
  width: 180px;
  margin-left: 10px;
}
.sidebar-box {
  width: 100%;
  height: 100%;
  // height: calc(100% - 30px);
  overflow-x: hidden;
  overflow-y: auto;
  -ms-overflow-style: none;
  overflow: "-moz-scrollbars-none";
  scrollbar-width: none; /*  火狐   */
  box-shadow: 2px 0px 4px 0px #dce0ee;
}
.sidebar-box::-webkit-scrollbar {
  display: none; /*  Chrome  */
  width: 0 !important ; /*  Chrome  */
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.headers-left-active {
  transform: rotate(180deg);
  border-bottom: 0;
  border-top: 1px solid #dce0ee;
  margin: 0;
  width: 100%;
}
v-deep .el-submenu__title:hover {
  background-color: transparent;
}
</style>
