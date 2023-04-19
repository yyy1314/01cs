<template>
  <div style="height: calc(100vh - 180px);overflow-y: scroll;">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="活动名称"
          style="width: 160px;"
          class="filter-item"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.category" clearable placeholder="活动分类">
          <el-option
            v-for="item in ActivityCategory"
            :key="item.guid"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.status" clearable placeholder="活动状态">
          <el-option
            v-for="item in activityStates"
            :key="item.guid"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button class="filter-item" type="primary" @click="publish">发布活动</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      element-loading-text="Loading"
      border
      fit
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" align="center" label="序号" width="60" />

      <el-table-column align="center" label="活动名称" width="400" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="活动类型" width="100">
        <template slot-scope="scope">{{ showType(scope.row.type) }}</template>
      </el-table-column>

      <el-table-column align="center" label="截止报名时间" width="150">
        <template slot-scope="scope">{{ scope.row.deadline | timeConversion }}</template>
      </el-table-column>

      <el-table-column align="center" label="活动时间" width="180">
        <template
          slot-scope="scope"
        >{{ scope.row.start_at | timeConversion("Y-M-D") }} ~{{ scope.row.end_at | timeConversion("Y-M-D") }}</template>
      </el-table-column>

      <el-table-column align="center" label="报名人数" width="70">
        <template slot-scope="scope">{{ scope.row.join_num }} / {{ scope.row.max_join_num }}</template>
      </el-table-column>

      <el-table-column align="center" label="活动状态" width="100">
        <template slot-scope="scope">{{ scope.row.state_description | activityState_description }}</template>
      </el-table-column>
      <el-table-column align="center" label="上下架" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status == 1" active-color="#13ce66" inactive-color="#ff4949" @change="onStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewProject(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="goOrder(scope.row)">报名记录</el-button>
          <el-button type="text" size="small" @click="showDialogDelete(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="editorActivity(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="importJoin(scope.row)">导入报名</el-button>
          <el-button type="text" size="small" @click="downFile(scope.row.encryptid)">导出报名</el-button>
          <el-button
            type="text"
            size="small"
            v-clipboard:copy="'../newActivityParticulars/newActivityParticulars?id=' + scope.row.id"
            v-clipboard:success="copy"
          >链接</el-button>
          <el-button type="text" size="small" @click="downWxacode(scope.row)">二维码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <join-import :visible="importVisible" :detail="detail" @close="importVisible = false"></join-import>
    <pagination :total="total" :page.sync="pageIndex" :limit.sync="pageSize" :page-sizes="[10,15,20,30,50,100,300]" @pagination="handleFilter"/>
  </div>
</template>

<script>
import {
  getActivityList,
  activityRelease,
  activityDel,
  getActivityCategory,
  downFileExel
} from "@/api/activity";
import Pagination from "@/components/Pagination";
import joinImport from "@/components/activity/import.vue";
import request from '@/utils/request';
import grant from '@/utils/grant.js';

export default {
  name: "UserCenter",
  components: { Pagination,joinImport },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      query: {
        name: null,
        status: null,
        category: null
      },
      ActivityCategory: [],
      activityStates: [
        {
          name: "全部",
          value: null
        },
        {
          name: "上架",
          value: 1
        },
        {
          name: "下架",
          value: 2
        }
      ],
      listLoading: true,
      dataList: [],
      detail:{},
      importVisible:false,
      baseURL:request.defaults.baseURL
    };
  },
  computed: {},
  mounted() {},
  created() {
    grant.isSuperUser = this.$store.getters.role_id === 0;
    grant.permissions = this.$store.getters.permissions;
    this.InitData();

    // 获取活动类型
    getActivityCategory().then(e => {
      this.ActivityCategory = [...[{ id: null, name: "全部" }], ...e.res];
    });
  },
  methods: {

    InitData() {
      this.listLoading = true;
      getActivityList({
        per_page: this.pageSize,
        page: this.pageIndex,
        name: this.query.name,
        type: this.query.category,
        status: this.query.status
      }).then(
        response => {
          this.dataList = response.res.items;
          this.total = response.res.total;
          this.pageIndex = response.res.current_page;
          this.pageSize = Number(response.res.per_page);
          this.listLoading = false;
        },
        err => {
          this.listLoading = false;
        }
      );
    },
    // 搜索
    handleSearch: function(e) {
      this.pageIndex = 1;
      this.InitData();
    },
    // 分页
    handleFilter: function(e) {
      this.pageSize = e.limit;
      this.InitData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    viewProject(e) {
      this.$router.push({
        path: "/activity/details?id=" + e.id
      });
    },
    importJoin(row){
      this.detail = row;
      this.importVisible = true;
    },
    publish() {
      if(!grant.hasAccess('activity.create')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      this.$router.push({
        path: "/activity/publish"
      });
    },
    onStatusChange(row){
      row.status = row.status == 1 ? 2 : 1;
      activityRelease({
        activity_id: row.id,
        status: row.status
      }).then(e => {
          this.$message({
            type: "success",
            message: "操作成功"
          });
        });
    },

    // 显示删除弹窗
    showDialogDelete(row) {
      if(!grant.hasAccess('activity.delete')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      this.$confirm('删除' + row.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       activityDel({ activity_id: row.id }).then(e => {
           this.InitData();
           this.$message({
             type: "success",
             message: "操作成功"
           });
         });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 编辑
    editorActivity(e) {
      if(!grant.hasAccess('activity.edit')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      this.$router.push({
        path: `/activity/publish?editId=${e.id}`
      });
    },
    // 查看订单
    goOrder(e) {
      this.$router.push({
        path: `/activity/order?activity_name=${e.name}`
      });
    },
    showType(id) {
      return this.ActivityCategory.find(e => e.id == id)
        ? this.ActivityCategory.find(e => e.id == id).name
        : "暂无";
    },

    copy(id) {
      this.$message({
          showClose: true,
          message: "复制成功",
          type: "success"
        });
    },
    downWxacode(row){
      let path = 'pages/newActivityParticulars/newActivityParticulars?id=' + row.id;
      window.open(request.defaults.baseURL + '/qrcode/wxacode?path=' + encodeURI(path));
    },
    //下载表格
    downFile(id) {
      window.open(
        this.baseURL + "/activityJoinExport?encryptid=" + id
      );
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.applyInstructions {
  padding: 0 0 20px 0;
  .title {
    font-size: 20px;
    line-height: 50px;
  }
  .text {
    font-size: 14px;
    line-height: 18px;
  }
}
.buttonWrap {
  text-align: center;
  padding: 20px 0 0 0;
}
</style>
