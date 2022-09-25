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
    </div> @select="menuSelect" -->
    <div class="sidebar-box">
      <el-menu
        :default-active="activeMenu"
        text-color="#4d4d4d"
        unique-opened
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
  </div>
</template>

<script>
import SidebarItem from "./SidebarItem";
import { mapState, mapActions } from "vuex";
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
      activeMenu: "",
      childData: [],
    };
  },
  computed: {
    ...mapState("global", ["activeTab"]),
    ...mapState(["pageUrl"]),
  },
  watch: {
    /**
     * 路由变化,自动匹配菜单
     */
    activeTab(v) {
      this.activeMenu = v.path;
    },
    /**
     * 切换菜单后。底部tab同步切换
     */
    activeMenu(v) {
      const obj = this.childData.find((ele) => ele.uri === v);
      const activeMenuId = obj ? obj.id : "";
      const prev = process.env.VUE_APP_KEYS ? process.env.VUE_APP_KEYS : "COMMON";
      sessionStorage.setItem(prev + "-MENU-ID", activeMenuId);
      if (this.activeTab.path === v) {
        return;
      }
      this.setActiveTab(v);
    },
  },
  async mounted() {
    /**
     * 由于底部tab跟菜单是根据路由地址匹配，导致拿不到菜单的id
     * 只能根据路由地址再去匹配菜单id
     */
    this.childData = this.routes.reduce((prev, curr) => {
      if (curr.children && curr.children.length > 0) {
        const data = [...prev, ...curr.children];
        return data;
      }
      return prev;
    }, []);
    let activePath = "";
    if (this.pageUrl) {
      activePath = this.pageUrl;
    } else {
      activePath = this.childData[0].uri;
    }
    const obj = this.childData.find((ele) => ele.uri === activePath);
    const activeMenuId = obj ? obj.id : "";
    const prev = process.env.VUE_APP_KEYS ? process.env.VUE_APP_KEYS : "COMMON";
    sessionStorage.setItem(prev + "-MENU-ID", activeMenuId);
    this.activeMenu = activePath;
    this.$router.push(this.activeMenu);
  },
  methods: {
    ...mapActions("global", ["getMenuBtn"]),
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
  position: relative;
  z-index: 5;
}
.sidebar-title {
  width: 100%;
  height: 50px;
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
  padding-top: 3px;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -ms-overflow-style: none;
  overflow: "-moz-scrollbars-none";
  scrollbar-width: none; /*  火狐   */
  box-shadow: 2px 0px 4px 0px #dce0ee;
  .el-menu {
    padding-bottom: 20px;
    height: calc(100vh - 50px);
    overflow-y: auto;
    overflow-x: hidden;
  }
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
