<template>
  <div class="login-container">
    <el-form :inline="true" :model="query">
      <el-form-item><el-input v-model="query.name" placeholder="公司名称,行业分类,业务范围" style="width: 200px;" class="filter-item" /></el-form-item>
      <el-form-item>
        <el-select v-model="query.industry_id" clearable placeholder="行业">
          <el-option v-for="item in industryList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
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
      <el-table-column align="center" label="公司名称">
        <template slot-scope="scope">
          <div class="" style="color: #0077AA;text-decoration:underline;cursor: pointer;" @click="openDrawer(scope.row.id)">{{ scope.row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="所在省市">
        <template slot-scope="scope">
          {{ (scope.row.province ? scope.row.province.name : '') + " " + (scope.row.city ?  scope.row.city.name : '') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属行业">
        <template slot-scope="scope">
          {{ scope.row.industry ? scope.row.industry.name : '未知' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员级别">
        <template slot-scope="scope">
          {{ scope.row.vip.describe }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="业务范围">
        <template slot-scope="scope">
          {{ scope.row.business_scope ? (scope.row.business_scope.slice(0,10) + '...') : '' }}
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
    <addEnterprise v-if="dialogEditVisible" @close="addEnterpriseClose" type="1"></addEnterprise>
    <detail :id="activeID" v-if="detailVisible" @detailClosed="onDetailClosed" @detailDeleted="onDetailDeleted"></detail>
    <member-unit-import v-if="importDisplay" @importClose="onImportClose"></member-unit-import>
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
import { getIndustryList } from '@/api/User.js';
import { getopportunityList1, opportunityDetails, exportExcel } from '@/api/enterprise';
import addEnterprise from '@/components/enterpriseindex/addEnterprise.vue';
import Pagination from '@/components/Pagination';
import detail from '@/components/enterpriseindex/detail.vue';
import { getAdminList } from '@/api/admin.js';
import memberUnitImport from '@/components/memberUnit/import.vue';
import grant from '@/utils/grant.js';

export default {
  components: {
    Pagination,
    detail,
    addEnterprise,
    memberUnitImport
  },
  data() {
    return {
      dialogDeleteVisible: false,
      total: 20,
      pageIndex: 1,
      pageSize: 10,
      query: {
        name: '',
        unit: '',
        industry_id: null,
        creator_id: null,
        follow_up_id: null,
        created_at:null,
      },
      industryList:[],
      followUpList: [],
      creatorList: [],
      listLoading: true,
      dialogEditVisible: false,
      detailVisible: false,
      importDisplay: false,
      dataList: [],
      activeID: null,
      activeData: {},
    };
  },
  created() {
    grant.isSuperUser = this.$store.getters.role_id === 0;
    grant.permissions = this.$store.getters.permissions;
    setTimeout(e => {
      this.listLoading = false;
    }, 500);
    getIndustryList().then(res => {
      if (res.code == 200) {
        this.industryList = res.res;
      }
    });
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
      getopportunityList1({
        per_page: this.pageSize,
        page: this.pageIndex,
        keyword: this.query.name,
        follow_up_id: this.query.follow_up_id,
        industry_id: this.query.industry_id,
        creator_id: this.query.creator_id,
        created_at:this.query.created_at,
      }).then(e => {
        this.dataList = e.res.items;
        this.total = e.res.total;
      });
    },
    handleSearch: function() {

      this.initData();
    },
    // 下一页
    handleFilter: function() {
      console.log(11);
      this.initData();
    },
    openDrawer(id) {
      this.activeID = id;
      this.detailVisible = true;
      console.log("open detail");
    },
    excelImport(){
      if(!grant.hasAccess('member_unit_enterprise.import')){
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
    derive() {
      if(!grant.hasAccess('member_unit_enterprise.export')){
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
    addEnterpriseClose(){
      this.initData();
      this.dialogEditVisible = false;
    },

  }
};
</script>

<style rel="stylesheet/scss" lang="scss"></style>

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
