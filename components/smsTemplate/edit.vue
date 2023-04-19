<template>
  <el-dialog :title="detail.id ? '编辑' : '新增' " :visible="true" width="40%" :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="模板分类">
        <el-radio-group v-model="form.category">
          <el-radio label="activity">活动</el-radio>
          <el-radio label="member_unit">会员单位</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="模板类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">短信通知(0.045元/条)</el-radio>
          <el-radio :label="2">推广短信(0.055元/条)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="模板名称">
        <el-input v-model="form.name" placeholder="必填,2-30字"></el-input>
      </el-form-item>
      <el-form-item label="模版内容">
        <el-input type="textarea" v-model="form.content" :autosize="{ minRows: 3, maxRows: 8 }" placeholder="必填,5-255字"></el-input>
        <div v-if="form.type == 1" style="line-height: 20px">
          短信字数含"签名+模版内容+变量内容”，短信70个字数含以内，按1条短信计费；超出70个字为长短信，按照67个字数记为1条短信费用;
          不能发送营销/贷款/借款/中奖/抽奖类短信,不支持金融理财&房产通知类短信(验证码除外)
        </div>
        <div v-if="form.type == 2" style="line-height: 20px">
          推广短信不支持加变量，短信支持退订；短信70个字数含以内，按1条短信计费；超出70个字为长短信，按照67个字数记为1条短信费用;
          不能发送贷款/借款/中奖/抽奖类短信,不支持金融理财&房产通知类短信(验证码除外)
        </div>
      </el-form-item>
      <el-form-item v-if="form.type == 1" label="短信变量">
        <div v-if="form.category == 'activity'" style="line-height: 20px">
          <span class="vartxt">${name}</span> 姓名 | <span class="vartxt">${activity_name}</span> 活动名称 |
          <span class="vartxt">https://api.ctdu.com.cn/ail/${filename}</span> 签到二维码地址<br/>
          <span class="vartxt">${join_time}</span> 参会时间 | <span class="vartxt">${seat}</span> 座排 | <span class="vartxt">${repast}</span> 餐券 |
          <span class="vartxt">${address}</span> 地址
        </div>
        <div v-if="form.category == 'member_unit'" style="line-height: 20px">
          <span class="vartxt">${name}</span> 姓名
        </div>
      </el-form-item>
      <el-form-item label="申请说明">
        <el-input type="textarea" v-model="form.remark" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="必填,2-100字"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {createSmsTemplate,modifySmsTemplate} from '@/api/smsTemplate.js';
const collect = require('collect.js');
export default {
  props: {
    detail: {
      type:Object,
      default(){
        return {
          id:null,
          name:null,
          category:'activity',
          type:1,
          content:null,
          remark:null,
        };
      }
    }
  },
  data() {
  	return {
      form: Object.assign({},this.detail)
  	}
  },
  watch: {

  },
  filters: {

  },
  created: function () {

  },
  methods: {
    handleClose: function (){
      this.$emit('close');
    },

    submit(){
      if(!this.form.id){
        createSmsTemplate(this.form).then(response=>{
          if(response.code == 200){
            this.$message({
             message: '新增成功',
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
      }else{
        modifySmsTemplate(this.form).then(response=>{
          if(response.code == 200){
             this.$message({
              message: '修改成功',
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

}
</script>

<style scoped>
  .vartxt{color: #E6A23C;}
</style>
