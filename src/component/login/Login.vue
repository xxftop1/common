<template>
  <section class="login">
    <p class="login-header">
      <img src="../../assets/img/logo.png" alt="" class="login-header__img" />
    </p>
    <div class="login-content">
      <main class="login-content__box">
        <div class="login-content__title">
          <p class="login-content__title__welcome">
            欢迎<span style="color: #2e974c">登录</span>
          </p>
          <p>万怡医学内部管理系统</p>
        </div>
        <el-form
          ref="form"
          :model="form"
          class="login-content__form"
          :rules="rules"
          autocomplete="off"
        >
          <el-form-item prop="email">
            <el-input
              type="text"
              id="Input_UserName"
              v-model="form.email"
              auto-complete="email"
              @keyup.enter.native="handleSubmit"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              id="Input_Password"
              v-model="form.password"
              auto-complete="new-password"
              @keyup.enter.native="handleSubmit"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item prop="captcha" style="position:reletive">
              <el-inputs
                type="text"
                id="Input_Captcha"
                prefix-icon="el-icon-c-scale-to-original"
                v-model="form.captcha"
                auto-complete="new-captcha"
                @keyup.enter.native="handleSubmit"
                placeholder="验证码"
              ></el-inputs>
              <el-image
                class="captcha"
                :src="captchaurl"
                @click="getCaptcha"
              ></el-image>
            </el-form-item> -->
          <el-form-item prop="error" :error="errorMsg" v-show="errorMsg"></el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              id="Button_Login"
              class="login-button"
              :loading="submitStatus"
              @click="handleSubmit"
              >登录</el-button
            >
          </el-form-item>
          <el-form-item>
            <div class="password_update">
              <el-checkbox v-model="rememberPaw">记住密码</el-checkbox>
              <!-- <el-button type="text">忘记密码</el-button> -->
            </div>
          </el-form-item>
        </el-form>
      </main>
    </div>
    <el-dialog
      title="忘记密码"
      width="500px"
      :visible.sync="modifyPassword"
      :inline="true"
    >
      <el-form
        ref="form"
        :model="passwordform"
        :rules="passwordrules"
        label-width="100px"
      >
        <el-form-item label="手机号：" prop="phone" required>
          <el-input
            type="password"
            v-model="form.phone"
            auto-complete="off"
            style="width: 200px"
          ></el-input>
          <el-button @click="getverificationCode" type="primary" class="ml-20">
            点击获取验证码
          </el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="verificationCode" required>
          <el-input
            type="password"
            v-model="form.verificationCode"
            auto-complete="off"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" required>
          <el-input
            type="password"
            v-model="form.newPassword"
            auto-complete="off"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword" required>
          <el-input
            type="password"
            v-model="form.confirmPassword"
            auto-complete="off"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item class="reset_password">
          <el-button type="primary" @click="handleModifyUserPassword">重置密码</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </section>
</template>

<script>
import { setRememberInfo, removeRememberInfo, getUserInfo } from "../../sdk/cookie.js";
import { mapActions } from "vuex";
const Base64 = require("js-base64").Base64;
export default {
  props: {
    currentApp: String,
  },
  name: "Login",
  data() {
    const validator = (rule, value, callback) => {
      const test = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!test.test(value)) {
        callback(new Error("密码长度为8-20位，必须包括字母、数字"));
      } else {
        callback();
      }
    };
    return {
      captchaurl: "",
      modifyPassword: false,
      rememberPaw: true, //是否记住密码
      form: {
        email: "",
        password: "",
        captcha: "",
        captchaCode: "",
        captchaData: "",
      },
      passwordform: {
        phone: "",
        newPassword: "",
        verificationCode: "",
        confirmPassword: "",
      },
      passwordrules: {
        phone: [{ validator, trigger: "blur" }],
        newPassword: [{ validator, trigger: "blur" }],
        confirmPassword: [{ validator, trigger: "blur" }],
      },
      rules: {
        email: [
          {
            required: true,
            message: "请输入用户名或邮箱",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },

          {
            type: "string",
            min: 6,
            message: "密码不能少于6位",
            trigger: "blur",
          },
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
          },
        ],
      },
      errorMsg: "",
      submitStatus: false,
    };
  },
  created() {
    debugger
    if (this.rememberPaw) {
      const rememberInfo = getUserInfo("wy-rememberInfo");
      if (rememberInfo) {
        const { userId, password } = rememberInfo;
        this.form.email = userId;
        this.form.password = Base64.decode(password);
      }
    }
  },
  mounted() {},
  computed: {},
  methods: {
    ...mapActions("global", ["login"]),
    /**
     * 重置密码
     */
    getverificationCode() {},
    handleModifyUserPassword() {
      const $form = this.$refs.passeordform;
    },
    async handleSubmit() {
      const valid = await this.$refs.form.validate();
      if (valid) {
        this.submitStatus = true;
        if (this.errorMsg !== "") {
          this.errorMsg = "";
        }
        let params = {
          loginName: this.form.email.trim(),
          password: this.form.password,
          code: this.form.captcha.trim(),
        };
        // 子应用单独访问
        if (!window.__POWERED_BY_QIANKUN__) {
          params.currentApp = this.currentApp;
        }
        try {
          const res = await this.login(params);
          if (res && res.data.code === 200) {
            this.submitStatus = false;
            //勾选了选中密码
            if (this.rememberPaw) {
              let password = Base64.encode(this.form.password); // base64加密
              setRememberInfo("wy", this.form.email.trim(), password, 7);
            } else {
              removeRememberInfo("wy");
            }
            this.$emit("ok", res);
          } else {
            this.errorMsg = res.data.msg;
            this.submitStatus = false;
          }
        } catch (error) {
          this.submitStatus = false;
          console.log(error);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.login {
  #Input_UserName,
  #Input_Password {
    border-radius: 8px !important;
    height: 40px !important;
    line-height: 40px !important;
    background: #f5f6f8;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 15px;
  }
  .el-checkbox__inner {
    background: #f5f6f8;
    border: 1px solid #b2b7c0;
    border-radius: 4px;
    &:hover {
      border-color: #b2b7c0;
    }
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #2e974c;
    border-color: #2e974c;
  }
}
</style>
<style lang="scss" scoped>
$--color-text-primary: #4d4d4d;
.login {
  background-color: #e9eff4;
  background-image: url("../../assets/img/bg.png");
  background-size: 100% 50%;
  background-position: bottom;
  background-repeat: no-repeat;
  min-height: 0;
  overflow: hidden;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  &-header {
    background: #fff;
    height: 70px;
    display: flex;
    align-items: center;
    padding: 8px 0;
    &__img {
      margin-left: 120px;
      height: 100%;
    }
  }

  .login-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    flex: 1;
    width: 100%;
    overflow: hidden;
    &__box {
      min-height: 340px;
      width: 360px;
      background: #fff;
      border-radius: 8px;
      padding: 20px 40px;
    }
    &__title {
      width: 100%;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 500;
      color: $--color-text-primary;
      line-height: 36px;
      &__welcome {
        font-size: 26px;
        font-weight: bold;
        color: $--color-text-primary;
      }
    }
    &__form {
      width: 100%;
      height: fit-content;
      .password_update {
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .login-button {
        width: 100%;
        margin-top: 10px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #2e974c;
        border-radius: 4px;
      }
    }
    .login-footer-center {
      text-align: center;
      color: $--color-gray;
      font-size: 12px;
      line-height: 60px;
    }
    .reset_password {
      margin: 0px;
      text-align: center;
    }
  }
}
</style>
