<template>
  <div style="height: calc(100vh - 180px);overflow-y: scroll;">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.keyword"
          placeholder="请输入模板code"
          style="width: 160px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.category" clearable placeholder="分类">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.type" clearable placeholder="类型">
          <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="refreshList()">搜索</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button class="filter-item" type="primary" @click="onEdit()">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table  :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="模板名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="模板CODE">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类">
        <template slot-scope="scope">
          {{ categoryTxt(scope.row.category) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          {{ typeTxt(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ statusTxt(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          {{ scope.row.admin.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text"  size="small" @click="onDetail(scope.row)">详情</el-button>
          <el-button v-if="scope.row.status == 2" type="text"  size="small" @click="onEdit(scope.row)">修改</el-button>
          <el-button v-if="scope.row.status != 0" type="text"  size="small" @click="onDelete(scope.row)">删除</el-button>
          <el-button type="text"  size="small" @click="onTest(scope.row)">测试</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="query.page" :limit.sync="query.per_page" :page-sizes="[10,15,20,30,50,100,300]" @pagination="refreshList()" />
    <edit v-if="editOpen" :detail="formDetail" @close="onEditClose()"></edit>
    <detail v-if="detailOpen" :detail="detail" @close="detailOpen = false"></detail>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import Edit from '@/components/smsTemplate/edit.vue';
import Detail from '@/components/smsTemplate/detail.vue';
import {getSmsTemplates,deleteSmsTemplate,testSmsTemplate} from '@/api/smsTemplate.js';
const collect = require('collect.js');
import grant from '@/utils/grant.js';
export default {
  components: {Pagination,Edit,Detail},
  data() {
    return {
      list:[],
      total:0,
      categories:[{id:'activity',name:'活动'},{id:'member_unit',name:'会员单位'}],
      types:[{id:1,name:'短信通知'},{id:2,name:'推广短信'}],
      statusArr:[{id:0,name:'审核中'},{id:1,name:'审核通过'},{id:2,name:'审核失败'}],
      editOpen:false,
      formDetail:null,
      detailOpen:false,
      detail:null,
      query:{
        keyword:null,
        category:null,
        type:null,
        page:1,
        per_page:15,
      },
    }
  },
  computed: {


  },
  created: function () {
    grant.isSuperUser = this.$store.getters.role_id === 0;
    grant.permissions = this.$store.getters.permissions;
    this.refreshList();
  },
  methods: {
    refreshList(){
      getSmsTemplates(this.query).then(response=>{
        this.list = response.res.items;
        this.total = response.res.total;
      });
    },
    categoryTxt(category) {
      return collect(this.categories).where('id',category).first().name;
    },
    typeTxt(type) {
      return collect(this.types).where('id',type).first().name;
    },
    statusTxt(status) {
      return collect(this.statusArr).where('id',status).first().name;
    },
    onEditClose(){
      this.editOpen = false;
      this.refreshList();
    },
    onDetail(row){
      this.detail = row;
      this.detailOpen = true;
    },
    onEdit(row=null){
      if(row){
        if(!grant.hasAccess('sms_template.edit')){
            this.$message({
              type: "warning",
              message: "无权限"
            });
            return;
        }
        this.formDetail = collect(row).only(['id', 'name','category','type','content','remark']).all();
      }else{
        if(!grant.hasAccess('sms_template.create')){
            this.$message({
              type: "warning",
              message: "无权限"
            });
            return;
        }
        this.formDetail = {
          id:null,
          name:null,
          category:'activity',
          type:1,
          content:null,
          remark:null,
        };
      }
      this.editOpen = true;
    },
    onDelete(row){
      if(!grant.hasAccess('sms_template.delete')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
     this.$confirm('此操作将永久删除短信模板, 是否继续?', '短信模板删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           deleteSmsTemplate({id:row.id}).then(response=>{
             if(response.code === 200){
               this.$message({
                message: '删除成功',
                type: 'success'
               });
               this.refreshList();
             }else{
               this.$message({
                 message: response.msg,
                 type: 'warning'
               });
             }
           });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
     });


    },
    onTest(row){
      this.$prompt('请输入手机号码', '测试短信发送', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^1[3456789]{1}\d{9}$/,
              inputErrorMessage: '手机号码格式不正确'
            }).then(({ value }) => {
               testSmsTemplate({id:row.id,mobile:value}).then(response=>{
                 if(response.code === 200){
                   this.$message({
                    message: '发送成功',
                    type: 'success'
                   });
                 }else{
                   this.$message({
                     message: response.msg,
                     type: 'warning'
                   });
                 }
               });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消测试'
              });
            });
    }
  }

}
</script>

<style scoped>
</style>
