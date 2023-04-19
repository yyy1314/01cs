<template>
  <el-dialog :title=" detail.id ? '编辑' : '新增' " :visible="true" width="40%" :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="字段名称">
        <el-input v-model="form.name" placeholder="必填,2-5字,展示在小程序端的名称"></el-input>
      </el-form-item>
      <el-form-item label="字段描述">
        <el-input v-model="form.description" placeholder="必填,2-25字,对字段的用途描述"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-radio-group v-model="form.category">
          <el-radio label="resource">项目</el-radio>
          <el-radio label="activity">活动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio label="text">单行文本</el-radio>
          <el-radio label="textarea">多行文本</el-radio>
          <el-radio label="radio">单选框</el-radio>
          <el-radio label="select">下拉框</el-radio>
          <el-radio label="checkbox">多选框</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选项" v-if="['radio','select','checkbox'].indexOf(form.type) != -1">
        <el-tag
          :key="index"
          v-for="(option,index) in form.options"
          closable
          :disable-transitions="false"
          @close="handleOptionClose(option)">
          {{option}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="optionInputVisible"
          v-model="optionInputValue"
          ref="saveOptionInput"
          size="small"
          @keyup.enter.native="handleOptionInputConfirm"
          @blur="handleOptionInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showOptionInput">+ 选项</el-button>
      </el-form-item>
      <el-form-item label="是否必填">
        <el-radio-group v-model="form.is_required">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-radio-group v-model="form.display">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="默认值" v-if="['text','textarea'].indexOf(form.type) != -1">
        <el-input v-model="form.default" placeholder="选填,25字以内"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.sort_order" placeholder="选填,数字小的排序靠前" ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {createCustomField} from '@/api/customField.js';
export default {
  props: {
    detail: {
      type:Object,
      default(){
        return {
          id:null,
          name:null,
          description: null,
          category:'resource',
          type:'text',
          options: [],
          default: null,
          is_required: 0,
          display: 0,
          sort_order: 0
        };
      }
    }
  },
  data() {
    let form = Object.assign({},this.detail);
    if(form.options === null){
      form.options = [];
    }

  	return {
      form: form,
      optionInputVisible: false,
      optionInputValue: ''
  	}
  },
  beforeCreate: function () {

  },
  created: function () {

  },
  methods: {
    handleClose: function (){
      this.$emit('close');
    },
    handleOptionClose(option) {
      this.form.options.splice(this.form.options.indexOf(option), 1);
    },
    showOptionInput() {
      this.optionInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveOptionInput.$refs.input.focus();
      });
    },
    handleOptionInputConfirm() {
      let inputValue = this.optionInputValue;
      if (inputValue) {
        this.form.options.push(inputValue);
      }
      this.optionInputVisible = false;
      this.optionInputValue = '';
    },
    submit(){
      createCustomField(this.form).then(response=>{
        if(response.code == 200){
           this.$message({
            message: '编辑成功',
            type: 'success'
           });
           this.$emit('close');
        }else{
          this.$message({
            message: response.msg,
            type: 'warning'
          });
        }
      });
    }
  }
}
</script>

<style scoped>
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
</style>
