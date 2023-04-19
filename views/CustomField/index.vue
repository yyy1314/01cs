<template>
  <div style="height: calc(100vh - 180px);overflow-y: scroll;">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="请输入字段名称"
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
      <el-table-column align="center" label="字段名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="字段描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
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

      <el-table-column align="center" label="是否必填">
        <template slot-scope="scope">
          {{ scope.row.is_required == 1 ? '必填' : '选填'  }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否显示">
        <template slot-scope="scope">
          {{ scope.row.display == 1 ? '显示' : '不显示'  }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text"  size="small" @click="onEdit(scope.row)">修改</el-button>
          <el-button type="text"  size="small" @click="onDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="query.page" :limit.sync="query.per_page" :page-sizes="[10,15,20,30,50,100,300]" @pagination="refreshList()" />
    <edit v-if="editOpen" :detail="formDetail" @close="onEditClose()"></edit>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import Edit from '@/components/CustomField/edit.vue';
import {getCustomFields,deleteCustomField} from '@/api/customField.js';
const collect = require('collect.js');
import grant from '@/utils/grant.js';
export default {
  components: {Pagination,Edit},
  data() {
    return {
      list:[],
      total:0,
      categories:[{id:'resource',name:'项目'},{id:'activity',name:'活动'}],
      types:[{id:'text',name:'单行文本'},{id:'textarea',name:'多行文本'},{id:'radio',name:'单选框'},{id:'select',name:'下拉框'},{id:'checkbox',name:'多选框'}],
      editOpen:false,
      formDetail:null,
      detailOpen:false,
      detail:null,
      query:{
        name:null,
        category:null,
        type:null,
        page:1,
        per_page:10,
      },
    }
  },
  created: function () {
    grant.isSuperUser = this.$store.getters.role_id === 0;
    grant.permissions = this.$store.getters.permissions;
    this.refreshList();
  },
  methods: {
    refreshList(){
      getCustomFields(this.query).then(response=>{
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
    onEditClose(){
      this.editOpen = false;
      this.refreshList();
    },
    onEdit(row=null){
      if(!grant.hasAccess('custom_field.edit')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      if(row){
        this.formDetail = collect(row).only(['id','name','description','category','type','options','default','is_required','display','sort_order']).all();
      }else{
        this.formDetail = {
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
      this.editOpen = true;
    },
    onDelete(row){
      if(!grant.hasAccess('custom_field.delete')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      this.$confirm('此操作将删除自定义字段, 是否继续?', '删除'+row.name, {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }).then(() => {
            deleteCustomField({id:row.id}).then(response=>{
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
    }
  }
}
</script>

<style>
</style>
