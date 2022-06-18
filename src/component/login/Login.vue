<template>
  <el-container class="login">
    <img src="../../assets/img/login.png" alt="" class="login-left__logo" />
    <div class="login-content">
      <div class="login-content__title">
        <p class="login-content__title__welcome">欢迎登录</p>
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
            prefix-icon="el-icon-user"
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
            prefix-icon="el-icon-lock"
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
          <el-link type="primary" :underline="false" class="password_update"
            >忘记密码</el-link
          >
        </el-form-item>
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
      </el-form>
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
  </el-container>
</template>

<script>
import network from "../../api/index.js";
import api from "../../sdk/api.js";
import { setUserInfo } from "../../sdk/cookie.js";
import { mapState, mapActions } from "vuex";
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
  created() {},
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
          // const res = await network.postRequest(api.Login, params);
          if (res && res.data.code === 200) {
            this.submitStatus = false;
            // const { token, userInfo, permissionList } = res.data.data;
            // let data = {
            //   ...userInfo,
            //   token,
            // };
            // localStorage.setItem("COMMIN_USER", JSON.stringify(data));
            // localStorage.setItem("COMMIN_APP", JSON.stringify(permissionList));
            // setUserInfo(JSON.stringify(data), {
            //   path: "/",
            //   domain: window.location.hostname,
            // });
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
    border-radius: 4px !important;
    height: 40px !important;
    line-height: 40px !important;
  }
}
</style>
<style lang="scss" scoped>
$--color-text-primary: #4d4d4d;
.login {
  background-image: url("../../assets/img/loginBg.png");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 0;
  overflow: hidden;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;

  .login-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 340px;
    width: 360px;
    position: relative;
    margin-right: 110px;
    &__title {
      width: 100%;
      margin-bottom: 90px;
      font-size: 24px;
      font-weight: 500;
      color: $--color-text-primary;
      line-height: 36px;
      &__welcome {
        font-size: 43px;
        font-weight: bold;
        color: $--color-text-primary;
        line-height: 64px;
      }
    }
    &__form {
      width: 100%;
      height: fit-content;
      .password_update {
        font-size: 14px;
        font-weight: 500;
        color: #6b7bb3;
        line-height: 29px;
        display: flex;
        justify-content: flex-end;
      }
      .login-button {
        width: 100%;
        border-radius: 37px;
        margin-top: 20px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
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
