<template>
  <el-dialog :visible="visible" title="活动邀请短信发送"  width="40%" :before-close="handleClose" @open="onOpen">
    <el-form ref="form" :model="form" label-width="80px">
      <p class="p-2">共选择了{{activityJoinCount}}条报名记录，将要发送{{activityJoinCount}}条短信</p>
      <el-form-item label="短信模板">
        <el-select v-model="form.sms_template_id" placeholder="请选择短信模板">
          <el-option v-for="template in templates" :label="template.name" :value="template.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit()" :disabled="submitDisable">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {getSmsTemplates} from '@/api/smsTemplate.js';
  import {activityJoin} from "@/api/activity";
  import {sendActivityJoinSms} from "@/api/activityJoin.js";
  const collect = require('collect.js');
  export default {
    props: {
      visible: {
        type:Boolean,
        default:false,
      },
      query: {
        type:Object,
        default(){
          return {

          };
        }
      }
    },
    data() {
    	return {
        templates:[],
        form: {
          sms_template_id:null,
        },
        activityJoinCount:0,
        submitDisable:false
    	}
    },
    watch: {

    },
    filters: {

    },
    created: function () {
      getSmsTemplates({category:'activity',status:1}).then(response=>{
        this.templates = response.res.items;
      });
    },
    methods: {
      onOpen(){
        this.submitDisable = false;
        activityJoin(this.query).then(response => {
          this.activityJoinCount = response.res.total;
        });
      },
      handleClose: function (){
        this.$emit('close');
      },
      submit(){
        if(this.activityJoinCount == 0){
          return;
        }
        Object.assign(this.form,this.query);
        this.submitDisable = true;
        sendActivityJoinSms(this.form).then(response => {
          if(response.code === 200){
            this.$message({
              type:'success',
              message:'任务已提交后台发送！'
            });
            this.$emit('close');
          }else{
            this.submitDisable = false;
            this.$message({
              type:'warning',
              message:response.msg
            });
          }
        });
      }
    }

  }
</script>

<style scoped>
</style>
