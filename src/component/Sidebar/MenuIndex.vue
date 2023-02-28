<template>
  <div class="sidebar" :style="{ width: width }">
    <div
      class="top-icon"
      @click="handleMenuCollapse"
      :title="isCollapse?'展开':'收起'"
    >
    <i
      
      :class="[
        isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold',
        'icon-tb',
      ]"
    ></i>
    </div>
    <!-- <span :title="isCollapse?'展开':'收起'">
    <i
      
      :class="[
        isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold',
        'menu-tb',
      ]"
      @click="handleMenuCollapse"
    ></i>
  </span> -->
    <div class="sidebar-box">
      <el-menu
        :default-openeds="defaultOpeneds"
        :default-active="activeMenu"
        text-color="#4d4d4d"
        :unique-opened="isSingleOpen"
        active-text-color="#6b7db3"
        :collapse-transition="false"
        mode="vertical"
        @select="menuSelect"
        :collapse="isCollapse"
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
    //是否只打开一个一级菜单
    isSingleOpen: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      activeMenu: "",
      childData: [],
      isCollapse: false,
      width: 180 + "px",
      defaultOpeneds:[]
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
      if (this.activeTab.path === v) {
        return;
      }
      this.setActiveTab(v);
    },
  },
  async mounted() {
    if (!this.isSingleOpen) {
      this.defaultOpeneds = this.routes.map((ele) => ele.id + "");
    }
    let activePath = "";
    if (this.pageUrl) {
      activePath = this.pageUrl;
    } else {
      activePath = this.routes[0].children[0].uri;
    }
    this.activeMenu = activePath;
    this.$router.push(this.activeMenu);
  },
  methods: {
    ...mapActions("global", ["getMenuBtn"]),
    targetIcon() {
      this.$emit("targetIcon");
    },
    menuSelect(index, indexPath) {
      //清理项目详情里的菜单
      localStorage.removeItem("COMMON-CHILD-MENUS");
      //清理上一个选中的菜单的按钮权限
      localStorage.removeItem("COMMON-MENU-BTN");
    },

    handleMenuCollapse() {
      this.isCollapse = !this.isCollapse;
      this.width = this.isCollapse ? 32 + "px" : 180 + "px";
      if (!this.isSingleOpen) {
        this.defaultOpeneds = this.routes.map((ele) => ele.id + "");
      }
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
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0px 4px 0px #dce0ee;
  overflow-y: hidden;

  .top-icon {
    background: $--base-background;
  text-align: center;
  height: 30px;
  line-height: 30px;
  width:100%;
  cursor: pointer;
  .icon-tb {
    color: $--color-primary;
    font-size: 20px;
  }
  }
 
}
.sidebar-box {
  padding-top: 3px;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
  -ms-overflow-style: none;
  overflow: "-moz-scrollbars-none";
  scrollbar-width: none; /*  火狐   */
  box-shadow: none;
  // box-shadow: 2px 0px 4px 0px #dce0ee;
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
