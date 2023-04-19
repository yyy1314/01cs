<template>
  <div style="height: calc(100vh - 180px);overflow-y: scroll;">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="请输入姓名"
          style="width: 160px;"
          class="filter-item"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker ref="datePicker"
          v-model="dateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="refreshList()">搜索</el-button>
      </el-form-item>


    </el-form>
    <el-table  :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="100">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" width="150">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位">
        <template slot-scope="scope">
          {{ scope.row.position }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.unit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="访问次数" width="100">
        <template slot-scope="scope">
          {{ scope.row.visitor_frequency }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="访问时长(分)" width="120">
        <template slot-scope="scope">
          {{ scope.row.visitor_duration }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text"  size="small" @click="onDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="query.page" :limit.sync="query.per_page" :page-sizes="[10,15,20,30,50,100,300]" @pagination="refreshList()" />
    <detail :visible.sync="detailVisible" :userId="userId" :startAt="query.start_at" :endAt="query.end_at"></detail>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import Detail from '@/components/userLog/detail.vue';
import {getVisitors,getVisitorLogs} from '@/api/userLog.js';
export default {
  components: {Pagination,Detail},
  data() {
    return {
      list:[],
      total:0,
      dateRange:[],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      query:{
        name:null,
        start_at:null,
        end_at:null,
        page:1,
        per_page:10,
      },
      userId:null,
      detailVisible:false
    }
  },
  watch: {
    dateRange: function (val) {
      if(val){
        this.query.start_at = val[0];
        this.query.end_at   = val[1];
      }else{
        this.query.start_at = null;
        this.query.end_at   = null;
      }
    },
  },
  created: function () {
    let date = new Date();
    let today = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    this.dateRange = [today,today];
    this.refreshList();
  },
  methods: {
    refreshList(){
      getVisitors(this.query).then(response=>{
        this.list = response.res.items;
        this.total = response.res.total;
      });
    },
    onDetail(row){
      this.detailVisible = true;
      this.userId= row.id;
    }
  }
}
</script>

<style>
</style>
