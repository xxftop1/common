<template>
  <div
    v-if="!item.hidden"
    class="nemu-wrapper"
    :class="[menuShow ? 'isopen' : 'isclose']"
  >
    <template v-if="hasOneShowingChild(item.children, item)">
      <router-link
        :key="onlyOneChild.id + ''"
        :to="resolvePath(onlyOneChild.uri)"
        :underline="false"
      >
        <el-menu-item :index="resolvePath(onlyOneChild.uri)" :title="onlyOneChild.name">
          <!-- <el-menu-item :index="onlyOneChild.id" :title="onlyOneChild.name"> -->
          <item
            :icon="onlyOneChild.icon || (item && item.icon)"
            :title="onlyOneChild.name"
          />
        </el-menu-item>
      </router-link>
    </template>
    <el-submenu v-else ref="subMenu" :index="item.id + ''" popper-append-to-body>
      <template v-slot:title>
        <item v-if="item" :icon="item && item.icon" :title="item.name" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.id + ''"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.uri)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>
<script>
import path from "path";
import Item from "./Item";
export default {
  name: "SidebarItem",
  components: {
    Item,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      required: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    this.onlyOneChild = null;
    return {
      menuShow: true,
    };
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          this.onlyOneChild = item;
          return true;
        }
      });
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, uri: "", noShowingChildren: true };
        return true;
      }
      return false;
    },
    resolvePath(routePath) {
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>
<style lang="scss">
$--menu-height: 40px;
.el-menu {
  border: none !important;
  height: 100%;
  background-color: #fff;
  .parent {
    margin-left: 1px;
    .el-submenu {
      &__title {
        padding: 0;
        height: $--menu-height;
        line-height: $--menu-height;
        > span,
        i {
          font-size: 14px;
          color: #6b7db3;
        }
        .el-submenu__icon-arrow {
          top: 50%;
          right: 0;
          margin-top: -8px;
          transition: transform 0.3s;
          font-size: 16px;
          color: #6b7db3;
          font-weight: 600;
          margin-right: 15px;
        }
      }
      a {
        text-decoration: none;
      }
    }

    > a {
      .el-menu-item {
        font-size: 16px;
      }
    }
  }
  &--collapse {
    width: 32px !important;
    .el-menu-item {
      margin-left: -10px;
    }
    .el-submenu {
      &__title {
        margin-left: -10px;
      }
      .el-submenu__icon-arrow,
      span {
        display: none;
      }
    }
  }
  &-item {
      height: $--menu-height !important;
      line-height: $--menu-height !important;
      font-size: 14px;
      &:hover,
      &:focus,
      &.is-active {
        color: #6b7db3;
        border-left: 3px solid #6b7db3;
        background: #f3f5fa !important;
        > span {
          color: #6b7db3;
        }
      }
    }
}
</style>
