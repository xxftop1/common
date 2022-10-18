<!-- 公用头部 -->
<template>
  <div class="height-fill width-fill base-header">
    <p class="base-header__logo" @click="toBack">
      <img :src="imgUrl ? imgUrl : baseImgUrl" alt="" />
    </p>
    <div class="base-header__oper">
      <el-popover title="个人资料" width="200" trigger="click" :open-delay="100">
        <table
          class="setting-box setting-box--border"
          cellspacing="0"
          cellpadding="0"
          border="0"
        >
          <tr>
            <th width="60">用户名</th>
            <td class="text-right mr-5">
              {{ userInfo.nickName || userInfo.displayName }}
            </td>
          </tr>
          <tr>
            <th width="60">手机号</th>
            <td class="text-right mr-5">{{ userInfo.phone }}</td>
          </tr>
        </table>
        <table class="setting-box mt-5">
          <tr>
            <td class="user-operate">
              <a href="javascript:;" @click="modifyPassword = true">修改密码</a>
            </td>
            <slot name="otherOper"></slot>
          </tr>
        </table>
        <div slot="reference">
          <img src="../assets/img/touxiang1.png" alt="" />
        </div>
      </el-popover>
      <span>|</span>
      <!-- <i class="iconfont icon-shezhi"></i> -->
      <span @click="logout">
        <i class="iconfont icon-tuichu"></i>
      </span>
    </div>
    <el-dialog
      title="修改密码"
      width="430px"
      :visible.sync="modifyPassword"
      append-to-body
      close-on-click-modal
      close-on-press-escape
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="原密码" prop="password" :error="errors.oldPassword">
          <el-input
            type="password"
            v-model="form.password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" :error="errors.newPassword">
          <el-input
            type="password"
            v-model="form.newPassword"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="renewPassword"
          :error="errors.confirmPassword"
        >
          <el-input
            type="password"
            v-model="form.renewPassword"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-row class="text-center">
          <el-button type="primary" @click="handleModifyUserPassword">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { removeUserInfo, getToken, getUserInfo } from "../sdk/cookie";
import network from "../api/index.js";
import api from "../sdk/api.js";
export default {
  name: "",
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
    //修改密码接口
    apiUrl: {
      type: String,
      default: "",
    },
    //密码正则
    passwordPattern: {
      type: String,
      default: "",
    },
  },
  data() {
    const validator = (rule, value, callback) => {
      let test = this.passwordPattern
        ? this.passwordPattern
        : /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!test.test(value)) {
        callback(new Error("密码长度为8-20位，必须包括字母、数字"));
      } else {
        if (this.form.renewPassword !== "") {
          this.$refs.form.validateField("renewPassword");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      let test = this.passwordPattern
        ? this.passwordPattern
        : /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (!test.test(value)) {
        callback(new Error("密码长度为8-20位，必须包括字母、数字"));
      } else if (value !== this.form.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userInfo: {
        nickName: "",
        displayName: "",
        phone: "",
      },
      baseImgUrl: "",
      modifyPassword: false,
      form: {
        password: "",
        newPassword: "",
        renewPassword: "",
      },
      rules: {
        password: [{ trigger: "blur", required: true, message: "请输入密码" }],
        newPassword: [{ validator: validator, trigger: "blur", required: true }],
        renewPassword: [{ validator: validatePass2, trigger: "blur", required: true }],
      },
      errors: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    const { nickName, displayName, phone } = getUserInfo();
    this.userInfo = {
      nickName,
      displayName,
      phone,
    };
    if (!this.imgUrl) {
      this.baseImgUrl = require("../assets/img/xiaohua.png");
    }
  },
  computed: {},
  //事件
  methods: {
    toBack() {
      if (this.imgUrl) {
        return;
      }
      sessionStorage.removeItem("COMMON-CHILD-MENUS");
      history.pushState(null, "/", "/");
    },
    /**
     * 修改密码
     */
    handleModifyUserPassword() {
      const $form = this.$refs.form;
      $form.validate((valid) => {
        if (valid) {
          const { password, newPassword, renewPassword } = this.form;
          if (password === newPassword) {
            this.errors.newPassword = "请设置一个新的密码!";
            return;
          }
          if (newPassword !== renewPassword) {
            this.errors.confirmPassword = "两次输入的密码不一致!";
            return;
          }
          if (!this.apiUrl) {
            this.$message.warning("请确认请求接口有值！");
            return;
          }
          this.getRequest(
            this.apiUrl +
              `?password=${password}&renewPassword=${renewPassword}&newPassword=${newPassword}`
          ).then((res) => {
            if (res && res.data.code === 200) {
              this.$message.success("恭喜您，密码修改成功!");
              this.modifyPassword = false;
              $form.resetFields();
              $form.clearValidate();
            } else {
              return;
            }
          });
        }
      });
    },
    /**
     * 登出
     */
    async logout() {
      try {
        const prev = process.env.VUE_APP_KEYS ? process.env.VUE_APP_KEYS : "COMMON";
        if (this.imgUrl) {
          Object.keys(sessionStorage).forEach((key) => {
            if (key.includes(prev)) {
              sessionStorage.removeItem(key);
            }
          });
          Object.keys(localStorage).forEach((key) => {
            if (key.includes(prev)) {
              localStorage.removeItem(key);
            }
          });
          removeUserInfo();
          this.$router.push("/login");
          return;
        }
        const token = getToken();
        if (!token) {
          return;
        }
        const res = await network.getRequest(api.Logout);
        if (res && res.data.code === 200) {
          Object.keys(sessionStorage).forEach((key) => {
            if (key.includes(prev)) {
              sessionStorage.removeItem(key);
            }
          });
          Object.keys(localStorage).forEach((key) => {
            if (key.includes(prev)) {
              localStorage.removeItem(key);
            }
          });
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
    i {
      font-size: 22px;
    }
    .icon-tuichu {
      margin-left: 15px;
    }
    .icon-shezhi {
      margin-left: 15px;
      // margin-right: 15px;
    }
  }
}
.setting-box {
  width: 100%;

  &.setting-box--border {
    border-bottom: 1px solid #f3f3f3;
  }

  tr {
    &.business-config {
      background-color: $--base-background;
    }

    th,
    td {
      padding: 10px 2px;
      border-top: 1px solid #f3f3f3;
    }

    th {
      color: #999;
      font-size: 14px;
      font-weight: normal;
      line-height: 1;
    }

    td {
      .el-radio--mini.is-bordered {
        margin-right: 5px;

        .el-radio__input {
          display: none;
        }

        .el-radio__label {
          padding-left: 3px;
        }
      }

      &.user-operate {
        width: 50%;
        padding: 3px 0;
        text-align: center;
        border-top: none;

        // &:first-child {
        //   border-right: 1px solid #f1f1f1;
        // }

        > a {
          color: $--color-black;
          text-decoration: none;

          &:hover {
            color: $--color-primary;
          }
        }
      }
    }
  }
}
</style>
