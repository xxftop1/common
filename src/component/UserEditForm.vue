<!--  -->
<template>
  <div class="height-fill width-fill edit-form">
    <el-form
      :model="param"
      ref="form"
      label-width="120px"
      :rules="rules"
      label-position="center"
    >
      <el-row type="flex" justify="start" v-for="v in rows" :key="v">
        <el-col
          :span="span"
          v-for="(item, index) in formLabel.slice((v - 1) * cols, v * cols)"
          :key="index"
        >
          <el-form-item
            :label="item.label + ':'"
            :prop="item.mode"
            :error="!param.id && item.error ? item.error : ''"
            :class="[!param.id && item.error ? 'error' : '']"
          >
            <el-cascader
              v-model="param[item.mode]"
              :options="item.opts"
              filterable
              :props="{ value: 'id', label: 'name' }"
              class="width-fill"
              v-if="item.type === 'cascader'"
            ></el-cascader>
            <el-input
              v-model="param[item.mode]"
              :placeholder="'请输入' + item.label"
              v-if="item.type === 'input'"
              :show-password="item.mode.includes('password')"
              :disabled="
                ['employeeId', 'positionLevel', 'allowanceValue', 'age'].includes(
                  item.mode
                )
                  ? true
                  : false
              "
            ></el-input>
            <el-input
              v-model="param[item.mode]"
              :placeholder="'请输入' + item.label"
              v-if="item.type === 'textarea'"
              type="textarea"
              :rows="2"
            ></el-input>
            <el-select
              v-model="param[item.mode]"
              :placeholder="'请选择' + item.label"
              v-if="item.type === 'specSelect'"
              class="width-fill"
              clearable
              filterable
            >
              <el-option
                v-for="item in item.opts"
                :key="item.id"
                :label="item.positionName"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select
              v-model="param[item.mode]"
              :placeholder="'请选择' + item.label"
              v-if="item.type === 'select'"
              class="width-fill"
              clearable
              filterable
            >
              <el-option
                v-for="item in item.opts"
                :key="item.dictValue + new Date().getTime()"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
            <el-date-picker
              v-model="param[item.mode]"
              type="date"
              :placeholder="'请选择' + item.label"
              v-if="item.type === 'date'"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              :disabled="['birthday'].includes(item.mode) ? true : false"
            >
            </el-date-picker>
            <el-date-picker
              v-model="param[item.mode]"
              type="datetime"
              :placeholder="'请选择' + item.label"
              v-if="item.type === 'datetime'"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <slot></slot>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    param: Object,
    formLabel: Array,
    rules: Object,
    span: {
      type: Number,
      default: 8,
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
    cols() {
      return Math.ceil(24 / this.span);
    },
    rows() {
      return Math.ceil(this.formLabel.length / this.cols);
    },
  },
  //事件
  methods: {},
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>
