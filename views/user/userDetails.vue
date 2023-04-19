<template>
  <div class="login-container">

    <div class="optionTop">
      <el-button class="filter-item" type="primary" >冻结</el-button>
      <el-button class="filter-item" type="primary" >身份设置</el-button>
      <el-button class="filter-item" type="primary" >认证</el-button>
      <el-button class="filter-item" type="primary" >升级</el-button>
    </div>

    <div class="head-portrait-wrapper">
      <div class="centerBox">
        <img class="portrait" src="@/assets/index1.jpg" alt="">
        <div class="name text">张小帅</div>
        <div class="text">身份：人才专家</div>
      </div>
    </div>

    <div>
      <el-table
        :data="dataList"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="会员信息">
          <template slot-scope="scope">
            <div >手机号码:181122341234</div>
            <div >微信号：dasd4asd54546</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="会员信息" >

          <template slot-scope="scope">
            <div >手机号码:181122341234</div>
            <div >微信号：dasd4asd54546</div>
          </template>

        </el-table-column>
        <el-table-column align="center" label="公司信息" >
          <template slot-scope="scope">
            <div >手机号码:181122341234</div>
            <div >微信号：dasd4asd54546</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" >
          <template slot-scope="scope">
            <div >手机号码:181122341234</div>
            <div >微信号：dasd4asd54546</div>
          </template>
        </el-table-column>
      </el-table>

    </div>

  </div>
</template>

<script>
export default {
  name: 'UserDetails',
  data() {
    return {
      listLoading: false,
      dataList: [{}]
    }
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .head-portrait-wrapper{
        .centerBox{
            text-align: center;
            font-size: 12px;
            line-height: 24px;
            padding:30px 0;
            .portrait{
                display: block;
                width:100px;
                height:100px;
                border-radius: 50%;
                margin:0 auto;
                border:2px solid #eee;
            };
        }
    }
</style>
