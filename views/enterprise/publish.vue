<template>
  <div class="login-container">
    <el-form :inline="true" :model="query">
      <el-form-item><el-input v-model="query.name" placeholder="单位名称" style="width: 200px;" class="filter-item" /></el-form-item>
      <el-form-item>
        <el-select v-model="query.follow_up_id" clearable placeholder="单位跟进人">
          <el-option v-for="item in followUpList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.creator_id" clearable placeholder="单位创建人">
          <el-option v-for="item in creatorList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="query.created_at"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="单位创建时间"
          end-placeholder="单位创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item><el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button></el-form-item>
      <el-form-item style="float:right"><el-button class="filter-item" type="success" @click="excelImport()">导入</el-button></el-form-item>
      <el-form-item style="float:right"><el-button class="filter-item" type="success" @click="derive()">导出</el-button></el-form-item>
      <el-form-item style="float:right"><el-button class="filter-item" type="primary" @click="addCompany()">新增</el-button></el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="dataList" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" align="center" label="序号" width="60" />
      <el-table-column align="center" label="单位名称">
        <template slot-scope="scope">
          <div class="" style="color: #0077AA;text-decoration:underline;cursor: pointer;" @click="openDrawer(scope.row.id)">{{ scope.row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所在省市">
        <template slot-scope="scope">
          {{ (scope.row.province ? scope.row.province.name : '') + " " + (scope.row.city ?  scope.row.city.name : '')}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="跟进人">
        <template slot-scope="scope">
          {{ scope.row.follow_up.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人">
        <template slot-scope="scope">
          {{ scope.row.creator.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.created_at }}
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="pageIndex" :limit.sync="pageSize" @pagination="handleFilter" />
    <addGovernment v-if="dialogEditVisible" @close="addEnterpriseClose" type="1"></addGovernment>
    <detail :id="activeID" v-if="detailVisible" @detailClosed="onDetailClosed" @detailDeleted="onDetailDeleted"></detail>
    <member-unit-import v-if="importDisplay" @importClose="onImportClose" scene="government"></member-unit-import>
    <!-- 弹窗 -->



    <!-- 弹窗 删除 -->
    <!-- <el-dialog
      :visible.sync="dialogDeleteVisible"
      :close-on-click-modal="false"
      title="删除"
      width="600"
      center
    >
      <span>请您确认：是否删除  《{{ activeData.unit }}》 相关的数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeDelete()">确 定</el-button>
      </span>
    </el-dialog >
 -->
  </div>
</template>

<script>
import { getopportunityList, opportunityDetails, establish , exportExcel } from '@/api/enterprisepublish.js';
import addGovernment from '@/components/enterprisepublish/addGovernment.vue';
import Pagination from '@/components/Pagination';
import detail from '@/components/enterprisepublish/detail.vue';
import { getAdminList } from '@/api/admin.js';
import memberUnitImport from '@/components/memberUnit/import.vue';
import grant from '@/utils/grant.js';

export default {
  components: {
    Pagination,
    detail,
    addGovernment,
    memberUnitImport
  },
  data:function() {
    return {
      dialogDeleteVisible: false,
      total: 20,
      pageIndex: 1,
      pageSize: 10,
      query: {
        name: '',
        unit: '',
        creator_id: null,
        follow_up_id: null,
        created_at:null,
      },
      followUpList: [],
      creatorList: [],
      listLoading: true,
      dialogEditVisible: false,
      detailVisible: false,
      importDisplay: false,
      dataList: [],
      activeID: null,
      activeData: {},
      tableData:{}
    };
  },
  created() {
    grant.isSuperUser = this.$store.getters.role_id === 0;
    grant.permissions = this.$store.getters.permissions;
    setTimeout(e => {
      this.listLoading = false;
    }, 500);
    getAdminList().then(res => {
      console.log(res.res);
      if (res.code == 200) {
        this.followUpList = res.res.items;
        this.creatorList = res.res.items;
      }
    });
    this.initData();
  },
  methods: {
    initData() {
      getopportunityList({
        per_page: this.pageSize,
        page: this.pageIndex,
        keyword: this.query.name,
        industry_id: this.query.industry_id,
        creator_id: this.query.creator_id,
        created_at:this.query.created_at,
      }).then(e => {
        this.dataList = e.res.items;
        this.total = e.res.total;
      });
    },
    handleSearch: function() {
      console.log(1);
      this.initData();
    },
    handleFilter: function() {
      console.log(11);
      this.initData();
    },
    opportunityDelete(e) {
      console.log(e);
      this.activeData = e;
      this.dialogDeleteVisible = true;
    },
    derive() {
      if(!grant.hasAccess('member_unit_government.export')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      exportExcel({
        keyword: this.query.name
      }).then(res => {
        if (res.code == 200) {
          window.open(res.res);
        }
      });
    },
    addCompany() {
      this.dialogEditVisible = true;
    },
    openDrawer(id) {
      this.activeID = id;
      this.detailVisible = true;
      console.log("open detail");
    },
    excelImport(){
      if(!grant.hasAccess('member_unit_government.import')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      this.importDisplay = true;
    },
    onDetailClosed:function(){
       this.detailVisible = false;
       console.log("close detail");
    },
    onImportClose(){
      this.importDisplay = false;
      this.initData();
    },
    onDetailDeleted:function(){
       this.detailVisible = false;
       this.initData();
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    addEnterpriseClose(){
      this.initData()
      this.dialogEditVisible = false;
    },
  }
};
</script>

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
