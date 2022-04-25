<!-- 公用头部 -->
<template>
  <div class="height-fill width-fill base-header">
    <p class="base-header__logo" @click="toBack">
      <img src="../assets/img/xiaohua.png" alt="" />
    </p>
    <div class="base-header__oper">
      <img src="../assets/img/touxiang1.png" alt="" />
      <span>|</span>
      <i class="iconfont icon-shezhi"></i>
      <span @click="logout">
        <i class="iconfont icon-tuichu"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { removeUserInfo, getToken } from "../sdk/cookie";
import network from "../api/index.js";
import api from "../sdk/api.js";
export default {
  name: "",
  data() {
    return {};
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  //事件
  methods: {
    toBack() {
      history.pushState(null, "/", "/");
    },
    /**
     * 登出
     */
    async logout() {
      try {
        const token = getToken();
        if (!token) {
          return;
        }
        // this.budgetForm.sid
        const res = await network.getRequest(api.Logout);
        if (res && res.data.code === 200) {
          sessionStorage.clear();
          localStorage.clear();
          removeUserInfo();
          if (!window.__POWERED_BY_QIANKUN__) {
            this.$router.push("/login");
            return;
          }
          window.history.replaceState(null, "", "/login");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.base-header {
  height: 50px;
  background: #6b7db3;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &__logo {
    margin-left: 20px;
  }
  &__oper {
    margin-right: 20px;
    color: #fff;
    height: 100%;
    font-size: 22px;
    display: flex;
    align-items: center;
    img {
      height: 26px;
      margin-right: 15px;
    }
    .icon-shezhi {
      margin-left: 15px;
      margin-right: 15px;
    }
  }
}
</style>
