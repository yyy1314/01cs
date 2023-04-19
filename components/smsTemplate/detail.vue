<template>
  <el-dialog title="短信模板详情" :visible="true" width="40%" :before-close="handleClose">
    <dl>
      <dt class="font-weight p-1">模板名称</dt>
      <dd>{{detail.name}}</dd>
      <dt class="font-weight p-1">模板CODE</dt>
      <dd>{{detail.code}}</dd>
      <dt class="font-weight p-1">模板分类</dt>
      <dd>{{categoryTxt(detail.category)}}</dd>
      <dt class="font-weight p-1">模板类型</dt>
      <dd>{{typeTxt(detail.type) }}</dd>
      <dt class="font-weight p-1">模版内容</dt>
      <dd><el-input type="textarea"  rows="5"  v-model="detail.content" disabled></el-input></dd>
      <dt class="font-weight p-1">审核状态</dt>
      <dd>{{statusTxt(detail.status)}}</dd>
      <dt class="font-weight p-1">审核原因</dt>
      <dd>{{detail.reason ? detail.reason : '无'}}</dd>
      <dt class="font-weight p-1">创建人</dt>
      <dd>{{detail.admin.name}}</dd>
      <dt class="font-weight p-1">创建时间</dt>
      <dd>{{detail.created_at}}</dd>
    </dl>
  </el-dialog>
</template>

<script>
  const collect = require('collect.js');
  export default {
    props: {
      detail: {
        type:Object,
        default(){
          return {

          };
        }
      }
    },
    data() {
    	return {
        categories:[{id:'activity',name:'活动'},{id:'member_unit',name:'会员单位'}],
        types:[{id:1,name:'短信通知'},{id:2,name:'推广短信'}],
        statusArr:[{id:0,name:'审核中'},{id:1,name:'审核通过'},{id:2,name:'审核失败'}],
    	}
    },
    watch: {

    },
    filters: {

    },
    created: function () {
      console.log(this.detail.content);
    },
    methods: {
      categoryTxt(category) {
        return collect(this.categories).where('id',category).first().name;
      },
      typeTxt(type) {
        return collect(this.types).where('id',type).first().name;
      },
      statusTxt(status) {
        return collect(this.statusArr).where('id',status).first().name;
      },
      handleClose: function (){
        this.$emit('close');
      },
    }

  }
</script>

<style scoped>
</style>
