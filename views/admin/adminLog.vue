<template>
  <div class="login-container">

    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.keyword"
          placeholder="请输入内容"
          style="width: 160px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.admin_id" clearable placeholder="管理员">
          <el-option
            v-for="item in admins"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="refreshList()">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table  :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="管理员">
        <template slot-scope="scope">
          {{ scope.row.admin.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="query.page" :limit.sync="query.per_page" :page-sizes="[10,15,20,30,50,100,300]" @pagination="refreshList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { getAdminLog } from '@/api/admin';
import { getAdminList } from '@/api/admin.js';
export default {
  components: {Pagination},
  data() {
    return {
      list:[],
      total:0,
      admins:[],
      query:{
        admin_id:null,
        keyword:null,
        page:1,
        per_page:10,
      },
    }
  },
  created: function () {
    getAdminList().then(response => {
       this.admins = response.res.items;
    });
    this.refreshList();
  },
  methods: {
    refreshList(){
      getAdminLog(this.query).then(response=>{
        this.list = response.res.items;
        this.total = response.res.total;
      });
    },
  }


}


</script>

<style scoped>


</style>
