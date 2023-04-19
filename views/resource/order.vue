<template>
  <div class="login-container">

    <el-form :inline="true" :model="query">

      <el-form-item>
        <el-input
          v-model="query.actName"
          placeholder="请输入活动名称"
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
        <el-input
          v-model="query.num"
          placeholder="请输入订单号"
          style="width: 200px;"
          class="filter-item"
        />
      </el-form-item>

      <!-- <el-form-item>
        <el-select v-model="query.scope" clearable placeholder="申请会员类型">
          <el-option
            v-for="item in scopeList"
            :key="item.guid"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="" >
        <el-date-picker
          v-model="activityData"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
      </el-form-item> -->

      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="InitData">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="orderList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="100"/>

      <el-table-column align="center" label="资源标题" >
        <template slot-scope="scope">{{ scope.row.resource.title }}</template>
      </el-table-column>

      <el-table-column align="center" label="资源图片" >
        <template slot-scope="scope">
          <el-popover placement="right" title="" trigger="hover">
            <img :src="scope.row.resource.imgs[0]" style="max-width: 500px;max-height: 500px;border:2px solid #eee">
            <img slot="reference" :src="scope.row.resource.imgs[0]" alt="" style="height:60px;margin:0 auto">
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column align="center" label="姓名" >
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="公司" >
        <template slot-scope="scope">{{ scope.row.company }}</template>
      </el-table-column>
      <el-table-column align="center" label="下单时间" >
        <template slot-scope="scope">{{ scope.row.created_at | timeConversion }}</template>
      </el-table-column>
      <el-table-column align="center" label="联系电话">
        <template slot-scope="scope">{{ scope.row.mobile }}</template>
      </el-table-column>
      <el-table-column align="center" label="组织机构代码">
        <template slot-scope="scope">{{ scope.row.business_license_no }}</template>
      </el-table-column>

      <!-- <el-table-column align="center" label="订单编号">
        <template slot-scope="scope">{{ scope.row.out_trade_no }}</template>
      </el-table-column>
      <el-table-column align="center" label="订单状态">
        <template slot-scope="scope">{{ scope.row.status?'已支付':'未支付' }}</template>
      </el-table-column>
      <el-table-column align="center" label="报名总价">
        <template slot-scope="scope">{{ scope.row.amount }}</template>
      </el-table-column> -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="moreDetails(scope.row)">详情</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      :total="total"
      :page.sync="pageIndex"
      :limit.sync="pageSize"
      @pagination="handleFilter"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { resourceJoin } from '@/api/resource'
export default {
  name: 'UserCenter',
  components: { Pagination },
  data() {
    return {
      activityData: '',
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      query: {
        platformType: this.platformType,
        name: null,
        scope: null,
        actName:null,
        num:null
      },
      scopeList: [{
        name: '测试1',
        value: 1
      }],
      listLoading: true,
      dialogTitle: '会员审核',
      dialogEditVisible: false,
      orderList: []
    }
  },
  created() {
    // setTimeout(e => {
    //   this.listLoading = false
    // }, 500)
    this.InitData()
  },
  methods: {
    InitData() {
      resourceJoin({
        resource_id: this.$route.query.id,
        per_page: this.pageSize,
        page: this.pageIndex,
        resource_name:this.query.actName,
        join_name:this.query.name,
        mobile:this.query.num
      }).then(
        response => {
          this.orderList = response.res.data
          this.total = response.res.total
          this.pageIndex = response.res.current_page
          this.pageSize = Number(response.res.per_page)
          this.listLoading = false
        },
        err => {
          console.log(err)
          this.listLoading = false
        }
      )
    },
    // 分页
    handleFilter: function(e) {
      this.pageSize = e.limit
      this.InitData()
    },
    moreDetails: function(e) {
      this.$router.push({
        path: `/resource/details?id=${e.resource.id}`
      })
    },

    ReviewApplication: function() {
      console.log(1)
      this.dialogEditVisible = false
      this.$message({
        type: 'success',
        message: '审核成功'
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
