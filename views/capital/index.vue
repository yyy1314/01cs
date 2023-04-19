<template>
  <div class="login-container">

    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="请输入项目标题"
          style="width: 200px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="请输入姓名"
          style="width: 200px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.scope" clearable placeholder="请选择项目类别">
          <el-option
            v-for="item in scopeList"
            :key="item.guid"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button class="filter-item" type="primary" @click="publish">发布资本</el-button>
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
      highlight-current-row
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="50"/>
      <el-table-column align="center" label="姓名" >
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">{{ scope.row.registrationDate }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="recycle(scope.row)">已发布/收回</el-button>
          <el-button type="text" size="small" @click="viewProject(scope.row)">查看项目详情</el-button>
          <el-button type="text" size="small" @click="subscribe(scope.row)">预约人员</el-button>
          <el-button type="text" size="small" @click="subscribe(scope.row)">审核</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      :total="total"
      :page.sync="query.pageIndex"
      :limit.sync="query.pageSize"
      @pagination="handleFilter"
    />

    <!-- 弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogEditVisible"
      :close-on-click-modal="false"
      width="65%"
      top="20px"
    >
      <el-table
        :data="auditDataList"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="头像">
          <template slot-scope="scope">
            <div ><img
              src="@/assets/index.jpg"
              style="width:40px;margin:0 auto"
            ></div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名" >

          <template slot-scope="scope">
            <div >{{ scope.row.name }}</div>
          </template>

        </el-table-column>
        <el-table-column align="center" label="公司信息" >
          <template slot-scope="scope">
            <div >{{ scope.row.company }}</div>

          </template>
        </el-table-column>
        <el-table-column align="center" label="申请类型" >
          <template slot-scope="scope">
            <div >{{ scope.row.company }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效期" >
          <template slot-scope="scope">
            <div >{{ scope.row.validity }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册时间" >
          <template slot-scope="scope">
            <div >{{ scope.row.registrationDate }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="applyInstructions">
        <div class="title">申请说明</div>
        <div class="text">申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明申请说明</div>
      </div>
      <div class="buttonWrap">
        <el-button class="filter-item" type="primary" @click="ReviewApplication()">审核</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'UserCenter',
  components: { Pagination },
  data() {
    return {
      total: 20,
      query: {
        pageIndex: 1,
        pageSize: 10,
        platformType: this.platformType,
        name: null,
        scope: null
      },
      scopeList: [{
        name: '测试1',
        value: 1
      }],
      listLoading: true,
      dialogTitle: '会员审核',
      dialogEditVisible: false,
      auditDataList: [
        {
          checked: true,
          headPortrait: '1',
          name: 'zhangsan',
          gender: '男',
          phone: '18112341234',
          vocation: '建筑材料',
          company: '深圳市某某公司',
          position: '总经理',
          MemberType: '主管',
          validity: '2018-12-12',
          relevanceWX: '123456wx',
          identityCard: '31800519961213125624',
          WhetherTheCertification: '是',
          status: '正常',
          registrationDate: '2019-06-12'
        }
      ],
      dataList: [
        {
          checked: true,
          headPortrait: '1',
          name: 'zhangsan',
          gender: '男',
          phone: '18112341234',
          vocation: '建筑材料',
          company: '深圳市某某公司',
          position: '总经理',
          MemberType: '主管',
          validity: '2018-12-12',
          relevanceWX: '123456wx',
          identityCard: '31800519961213125624',
          WhetherTheCertification: '是',
          status: '正常',
          registrationDate: '2019-06-12'
        },
        {
          checked: true,
          headPortrait: '1',
          name: 'zhangsan',
          gender: '男',
          phone: '18112341234',
          vocation: '建筑材料',
          company: '深圳市某某公司',
          position: '总经理',
          MemberType: '主管',
          validity: '2018-12-12',
          relevanceWX: '123456wx',
          identityCard: '31800519961213125624',
          WhetherTheCertification: '是',
          status: '正常',
          registrationDate: '2019-06-12'
        },
        {
          checked: true,
          headPortrait: '1',
          name: 'zhangsan',
          gender: '男',
          phone: '18112341234',
          vocation: '建筑材料',
          company: '深圳市某某公司',
          position: '总经理',
          MemberType: '主管',
          validity: '2018-12-12',
          relevanceWX: '123456wx',
          identityCard: '31800519961213125624',
          WhetherTheCertification: '是',
          status: '正常',
          registrationDate: '2019-06-12'
        },
        {
          checked: true,
          headPortrait: '1',
          name: 'zhangsan',
          gender: '男',
          phone: '18112341234',
          vocation: '建筑材料',
          company: '深圳市某某公司',
          position: '总经理',
          MemberType: '主管',
          validity: '2018-12-12',
          relevanceWX: '123456wx',
          identityCard: '31800519961213125624',
          WhetherTheCertification: '是',
          status: '正常',
          registrationDate: '2019-06-12'
        }
      ]
    }
  },
  created() {
    setTimeout(e => {
      this.listLoading = false
    }, 500)
  },
  methods: {
    handleSearch: function() {

    },
    handleFilter: function() {
      console.log(11)
    },
    moreDetails: function(e) {
      this.$router.push({
        path: '/user/userDetails'
      })
    },
    upgrade: function(e) {
      console.log(e)
    },
    MemberAudit: function(e) {
      console.log(e)
      this.dialogEditVisible = true
    },
    ReviewApplication: function() {
      console.log(1)
      this.dialogEditVisible = false
      this.$message({
        type: 'success',
        message: '审核成功'
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    recycle(e) {
      this.$message({
        type: 'success',
        message: '回收成功'
      })
    },
    subscribe(e) {
      this.$message({
        type: 'success',
        message: '预约成功'
      })
    },
    viewProject() {
      this.$router.push({
        path: '/capital/details'
      })
    },
    publish() {
      this.$router.push({
        path: '/project/publish'
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .applyInstructions{
    padding:0 0 20px 0;
    .title{
      font-size: 20px;
      line-height: 50px;
    };
    .text{
      font-size: 14px;
      line-height: 18px;
    }
  };
  .buttonWrap{
    text-align: center;
    padding:20px 0 0 0;
  }
</style>
