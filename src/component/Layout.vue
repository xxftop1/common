<!--  -->
<template>
  <div class="height-fill width-fill layout">
    <header>
      <base-header :imgUrl="imgUrl" :apiUrl="apiUrl"></base-header>
    </header>
    <section class="main">
      <template v-if="routes && routes.length > 0">
        <aside style="width: 180px">
          <menu-index :routes="routes"></menu-index>
        </aside>
        <section class="main-box">
          <main :class="[isSetting ? 'setting-main' : 'other-main']">
            <slot></slot>
          </main>
          <footer class="main-box__footer">
            <dynamic-tab :routes="routes"></dynamic-tab>
          </footer>
        </section>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </section>
  </div>
</template>

<script>
import BaseHeader from "./BaseHeader.vue";
import MenuIndex from "./Sidebar/MenuIndex.vue";
import DynamicTab from "./BaseTabs/DynamicTab.vue";
export default {
  components: { BaseHeader, MenuIndex, DynamicTab },
  name: "Layout",
  props: {
    routes: {
      type: Array,
      default: () => [],
    },
    imgUrl: {
      type: String,
      default: "",
    },
    //修改密码接口
    apiUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  computed: {
    isSetting() {
      return this.$route.fullPath.includes("setting");
    },
  },
  //事件
  methods: {},
};
</script>
<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  .main {
    flex: 1;
    display: flex;
    background: #fff;
    padding-top: 1px;
    height: 100%;
    overflow: hidden;
    .main-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      background: #fff;
      margin: 5px;
      margin-bottom: 0;
      .other-main {
        height: calc(100% - 70px);
        background: #ffffff;
        box-shadow: 4px 4px 6px 0px #dce0ee, -4px -4px 6px 0px #dce0ee;
        margin: 10px;
        overflow: hidden;
        margin-bottom: 0;
      }
      .setting-main {
        height: calc(100% - 40px);
        background: #ffffff;
        overflow: hidden;
      }
      &__footer {
        height: 40px;
        margin-left: -5px;
      }
    }
  }
}
</style>
