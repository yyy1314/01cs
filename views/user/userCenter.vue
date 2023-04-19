<template>
  <div class="login-container">
    <el-form :inline="true" :model="query">
      <el-form-item><el-input v-model="query.name" placeholder="请输入用户名称" style="width: 200px;" class="filter-item" /></el-form-item>
      <el-form-item><el-input v-model="query.unit" placeholder="请输入公司名称" style="width: 200px;" class="filter-item" /></el-form-item>
      <el-form-item>
        <el-select v-model="query.industry" clearable placeholder="行业方向">
          <el-option v-for="item in industryList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.vip" clearable placeholder="会员类型"><el-option v-for="item in vipList" :key="item.id" :label="item.describe" :value="item.id" /></el-select>
      </el-form-item>
      <el-form-item><el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button></el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="dataList" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" align="center" label="序号" width="60" />
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.picture" style="width:40px;margin:0 auto" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          {{ scope.row.sex == null ? '未知' : scope.row.sex == 1 ? '男' : '女' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位">
        <template slot-scope="scope">
          {{ scope.row.position }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司">
        <template slot-scope="scope">
          {{ scope.row.unit }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司类别">
        <template slot-scope="scope">
          {{ scope.row.unit_category == null ? '暂无' : scope.row.unit_category == 1 ? '企业' : '政府' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员等级">
        <template slot-scope="scope">
          {{ showVip(scope.row.vip) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status == 1 ? '正常' : '冻结' }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="人脉显示">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.contacts_display == 1" active-color="#13ce66" inactive-color="#ff4949" @change="switchContactsDisplay(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button class="filter-item" type="text" @click="compileFn(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>

      <!--            <el-table-column align="center" label="操作">-->
      <!--                <template slot-scope="scope">-->
      <!--                    <el-button type="text" size="small" @click="moreDetails(scope.row)">详情</el-button>-->
      <!--                </template>-->
      <!--            </el-table-column>-->
    </el-table>

    <pagination :total="total" :page.sync="query.pageIndex" :limit.sync="query.pageSize" @pagination="handleFilter" />
    <userCompile v-if="compileShow" :id="activeId" @close="userCompileClose"></userCompile>
  </div>
</template>

<script>
import { userCenter, getIndustryList, getuserDetail, switchContactsDisplay } from '@/api/User';
import { getVipList } from '@/api/vip';
import Pagination from '@/components/Pagination';
import userCompile from '@/components/userCenter/userCompile.vue';

export default {
  name: 'UserCenter',
  components: { Pagination, userCompile },
  data() {
    return {
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      query: {
        industry: this.platformType,
        name: null,
        vip: null,
        unit: null,
      },
      scopeList: [
        {
          name: '测试1',
          value: 1
        }
      ],
      listLoading: true,
      dialogTitle: '会员审核',
      dialogEditVisible: false,
      dataList: [],
      vipList: [],
      industryList: [],
      InformationList: [
        {
          name: '全部',
          id: 0
        },
        {
          name: '已注册',
          id: 1
        }
      ],
      compileShow: false,
      activeId:null,
    };
  },
  created() {
    this.InitData();
    getVipList().then(e => {
      this.vipList = e.res;
    });
    getIndustryList().then(e => {
      this.industryList = e.res;
    });
  },
  methods: {
    InitData() {
      setTimeout(e => {
        this.listLoading = false;
      }, 500);
      userCenter({
        ...this.query,
        per_page: this.pageSize,
        page: this.pageIndex
      }).then(e => {
        this.dataList = e.res.data;
        this.pageSize = Number(e.res.per_page);
        this.pageIndex = e.res.current_page;
        this.total = e.res.total;
      });
    },
    handleSearch: function() {
      this.InitData();
    },
    handleFilter: function(e) {
      this.pageIndex = e.page;
      this.pageSize = e.limit;
      console.log(this.pageSize);
      this.InitData();
    },
    moreDetails: function(e) {
      this.$router.push({
        path: '/user/userDetails'
      });
    },
    switchContactsDisplay(row) {
      let contacts_display = row.contacts_display == 1 ? 0 : 1;
      switchContactsDisplay({
        id: row.id,contacts_display
      }).then(res => {
        if (res.code == 200){
          row.contacts_display = contacts_display;
        }
      });
    },
    showVip: function(id) {
      return this.vipList.find(e => e.id == id) ? this.vipList.find(e => e.id == id).describe : '暂无';
    },
    compileFn(id) {
      this.activeId = id;
      this.compileShow = true;
    },
    userCompileClose() {
      this.compileShow = false;
      this.InitData();
    }
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
