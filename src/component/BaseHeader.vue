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
              {{ userInfo.nickName + "/" + userInfo.userName }}
            </td>
          </tr>
          <tr>
            <th width="60">邮箱</th>
            <td class="text-right mr-5">{{ userInfo.email }}</td>
          </tr>
        </table>
        <table class="setting-box mt-5">
          <tr>
            <td class="user-operate">
              <a href="javascript:;" @click="modifyPassword = true">修改密码</a>
            </td>
            <td class="user-operate">
              <a href="javascript:;" @click="openUserForm">修改资料</a>
            </td>
            <slot name="otherOper"></slot>
          </tr>
        </table>
        <div slot="reference">
          <img
            style="
              height: 26px;
              margin-right: 15px;
              width: 26px;
              border-radius: 50%;
              vertical-align: middle;
            "
            :src="userInfo.icon ? userInfo.icon : require('../assets/img/touxiang1.png')"
            alt=""
          />
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

    <el-dialog
      title="修改个人信息"
      width="900px"
      :visible.sync="userVisible"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <user-edit-form
        :param="userForm"
        :formLabel="userFormLabel"
        :rules="userRules"
        :span="12"
        ref="userForm"
      >
      </user-edit-form>
      <el-row class="text-center">
        <el-button plain @click="cancel">取消</el-button>
        <el-button type="primary" @click="saveUser" :loading="userloading"
          >保存</el-button
        >
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { removeUserInfo, getToken, getUserInfo } from "../sdk/cookie";
import network from "../api/index.js";
import api from "../sdk/api.js";
import UserEditForm from "./UserEditForm.vue";
import sdk from "../sdk/index";
export default {
  name: "",
  components: { UserEditForm },
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
      userInfo: {},
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

      //修改用户资料
      userVisible: false,
      userloading: false,
      userForm: {
        id: "",
        idno: "",
        cellPhone: "",
        tellPhone: "",
        email: "",
        education: "",
        school: "",
        graduateDate: "",
        major: "",
        bankName: "",
        bankAccount: "",
        bank: [], //开户行
        emergencyName: "", //紧急联系人
        emergencyPhone: "",
        emergencyContact: "",
      },
      userFormLabel: [
        {
          mode: "idno",
          type: "input",
          label: "身份证号",
        },
        {
          mode: "tellPhone",
          type: "input",
          label: "私人手机",
        },
        {
          mode: "cellPhone",
          type: "input",
          label: "公司手机",
        },
        {
          mode: "email",
          type: "input",
          label: "邮箱",
        },
        {
          mode: "education",
          type: "select",
          opts: sdk.getDistBytype("education"),
          label: "最高学历",
        },
        {
          mode: "school",
          type: "input",
          label: "毕业学校",
        },
        {
          mode: "graduateDate",
          type: "date",
          label: "毕业时间",
        },
        {
          mode: "major",
          type: "input",
          label: "专业",
        },
        {
          mode: "bankName",
          type: "input",
          label: "开户行",
        },
        {
          mode: "bank",
          type: "cascader",
          label: "开户行地址",
          opts: [],
        },
        {
          mode: "bankAccount",
          type: "input",
          label: "开户行账号",
        },
        {
          mode: "emergencyName",
          type: "input",
          label: "紧急联系人姓名",
        },
        {
          mode: "emergencyPhone",
          type: "input",
          label: "紧急联系人电话",
        },
        {
          mode: "emergencyContact",
          type: "select",
          label: "紧急联系人关系",
          opts: sdk.getDistBytype("emergency_contact"),
        },
      ],
      userRules: {
        cellPhone: [
          { required: true, trigger: "blur", message: "请输入手机" },
          { pattern: /^1[3456789]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
        ],
        email: [
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        idno: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          {
            pattern: /^[1-8][1-7]\d{4}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/,
            message: "身份证号格式不正确",
            trigger: "blur",
          },
        ],
      },
      areas: [],
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    const { id, nickName, displayName, phone, icon, email, userName } = getUserInfo();
    this.userInfo = {
      nickName,
      displayName,
      phone,
      icon,
      email,
      userName,
      id,
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
    openUserForm() {
      let requestArr = [network.getRequest(api.Detail + `?id=${this.userInfo.id}`)];
      const areas = JSON.parse(sessionStorage.getItem("COMMON-areas"));
      if (!areas) {
        requestArr.push(network.getRequest(api.Area));
      }
      Promise.all(requestArr).then((res) => {
        if (res) {
          const data = res[0].data.data;
          this.userForm = { ...data };
          this.userForm.bank = [];
          if (data.bankProvince) {
            this.userForm.bank.push(data.bankProvince);
          }
          if (data.bankCity) {
            this.userForm.bank.push(data.bankCity);
          }
          if (res.length > 1) {
            const value = res[1].data.data;
            sessionStorage.setItem("COMMON-areas", JSON.stringify(value));
            this.userFormLabel.splice(9, 1, {
              mode: "bank",
              type: "cascader",
              label: "开户行地址",
              opts: value,
            });
          } else {
            this.userFormLabel.splice(9, 1, {
              mode: "bank",
              type: "cascader",
              label: "开户行地址",
              opts: areas,
            });
          }
          this.userVisible = true;
        }
      });
    },
    async saveUser() {
      try {
        const valid = await this.$refs.userForm.$refs.form.validate();
        if (valid) {
          this.userloading = true;
          const param = { ...this.userForm };
          param.id = this.userInfo.id;
          if (param.bank.length > 0) {
            param.bankProvince = param.bank[0];
            param.bankCity = param.bank[1];
          }
          let res = await network.postRequest(api.UpdateSelf, this.userForm);
          if (res && res.data.code === 200) {
            this.$message.success("修改个人信息成功！");
            this.$refs.userForm.$refs.form.resetFields();
            this.cancel();
          }
          this.userloading = false;
        }
      } catch (error) {
        this.userloading = false;
        console.log(error);
      }
    },
    cancel() {
      if (this.$refs.userForm) {
        this.$refs.userForm.$refs.form.resetFields();
      } else {
        Object.keys(this.userForm).forEach((key) => {
          if (typeof key === "string") {
            this.userForm[key] = "";
          } else if (key instanceof Array) {
            this.userForm[key] = [];
          }
        });
      }
      this.userVisible = false;
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
          // if (!this.apiUrl) {
          //   this.$message.warning("请确认请求接口有值！");
          //   return;
          // }
          network
            .postRequest(api.UpdatePassword, {
              oldPassword: password,
              renewPassword: renewPassword,
              newPassword: newPassword,
            })
            .then((res) => {
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
