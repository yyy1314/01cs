<template>
  <div class="table role-table">
    <div class="container">
      <el-row>
        <el-col :span="24">
          <!--                    <div class="grid-content bg-purple-dark">-->
          <!--                        <el-tag style="margin: 2% 2% 2% 3%;">会员数  100</el-tag>-->
          <!--                        <el-tag style="margin: 2% 2% 2% 3%;">会员数  100</el-tag>-->
          <!--                        <el-tag style="margin: 2% 2% 2% 3%;">会员数  100</el-tag>-->
          <!--                        <el-tag style="margin: 2% 2% 2% 3%;">会员数  100</el-tag>-->
          <!--                    </div>-->
        </el-col>
      </el-row>
      <el-card v-if="hasActivityJoin" class="box-card" style="float: left;margin-top: 0;">
        <div slot="header" class="clearfix">
          <span>活动报名</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="more(1)">查看更多</el-button>
        </div>
        <el-table :data="activityJoinData" style="width: 100%">
          <el-table-column prop="activity.name" label="活动名称"></el-table-column>
          <el-table-column prop="join_name" label="姓名"></el-table-column>
          <el-table-column prop="join_mobile" label="联系方式"></el-table-column>
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">{{ scope.row.created_at | timeConversion}}</template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card v-if="hasGoodsOrder" class="box-card" style="float: left;margin-top: 0;">
        <div slot="header" class="clearfix">
          <span>商品订单</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="more(2)">查看更多</el-button>
        </div>
        <el-table :data="goodsOrderData" style="width: 100%">
          <el-table-column prop="goods.name" label="商品"></el-table-column>
          <el-table-column prop="amount" label="金额"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{ showStatus(scope.row.status) }}</template>
          </el-table-column>
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">{{ scope.row.created_at | timeConversion}}</template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card v-if="hasResourceJoin" class="box-card" style="float: left;">
        <div slot="header" class="clearfix">
          <span>项目报名</span>
          <el-button  style="float: right; padding: 3px 0" type="text" @click="more(3)">查看更多</el-button>
        </div>
        <el-table :data="resourceJoinData" style="width: 100%">
          <el-table-column prop="resource.title" label="项目名称"></el-table-column>
          <!-- <el-table-column label="类别">
            <template slot-scope="scope">{{ showType(scope.row.category) }}</template>
          </el-table-column> -->
          <el-table-column prop="name" label="名字"></el-table-column>
          <el-table-column prop="mobile" label="手机"></el-table-column>
          <el-table-column align="center" label="报名时间">
            <template slot-scope="scope">{{ scope.row.created_at | timeConversion}}</template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card v-if="hasVipApply" class="box-card">
        <div slot="header" class="clearfix">
          <span>会员申请</span>
          <el-button  style="float: right; padding: 3px 0" type="text" @click="more(4)">查看更多</el-button>
        </div>
        <el-table :data="vipApplyData" style="width: 100%">
          <el-table-column prop="users.name" label="名字"></el-table-column>
          <el-table-column prop="users.mobile" label="手机"></el-table-column>
          <el-table-column  label="状态">
             <template slot-scope="scope">{{ scope.row.status==1 ? "待审核": scope.row.status == 2 ? "审核通过" : "审核未通过"}}</template>
          </el-table-column>
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">{{ scope.row.created_at | timeConversion}}</template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { goodsOrderList } from "@/api/goodsOrder";
import { activityJoin } from "@/api/activity";
import { resourceJoin,resourceCategory } from "@/api/resource";
import { getVipApplyList } from "@/api/vip";
import grant from '@/utils/grant.js';
export default {
  name: "Index",
  data() {
    return {

      goodsOrderData: [],
      vipApplyData: [],
      activityJoinData: [],
      resourceJoinData: [],
      resourceCategoryData:[]
    };
  },
  watch: {
    activeName(v) {
      this.$nextTick(_ => {
        this.$refs[`chart${v}`].echarts.resize();
      });
    }
  },
  computed: {
    // 是超级管理员
    isSupperAdmin: function () {
      return this.$store.getters.role_id === 0;
    },
    hasActivityJoin: function () {
      return grant.hasAnyAccess('activity_join.index');
    },
    hasGoodsOrder: function () {
      return grant.hasAnyAccess('goods_order.index');
    },
    hasResourceJoin: function () {
      return grant.hasAnyAccess('resource_join.index');
    },
    hasVipApply: function () {
      return grant.hasAnyAccess('vip_apply.index');
    },
  },
  created() {
    grant.isSuperUser = this.$store.getters.role_id === 0;
    grant.permissions = this.$store.getters.permissions;
    this.InitData();
  },
  methods: {
    InitData: function() {
      getVipApplyList({ per_page: 4 }).then(e => {
        this.vipApplyData = e.res.data;
      });
      resourceJoin({ per_page: 4 }).then(e => {
        this.resourceJoinData = e.res.data;
      });
      activityJoin({ per_page: 4 }).then(e => {
        this.activityJoinData = e.res.items;
      });
      goodsOrderList({ per_page: 4 }).then(e => {
        this.goodsOrderData = e.res.data;
      });
      resourceCategory({
      type:"all"
    }).then(e => {
      console.log(e)
      this.resourceCategoryData = [...[{ id: null, name: '全部' }], ...e.res]
    })
    },
    more: function(type) {
      switch (type) {
        case 1:
          this.$router.push({
            path: "/activity/order"
          });
          break;
        case 2:
          this.$router.push({
            path: "/goodsOrder/index"
          });
          break;
        case 3:
          this.$router.push({
            path: "/resource/order"
          });
          break;
        case 4:
          this.$router.push({
            path: "/user/userApply"
          });
          break;
      }
    },
    getTime(timestamp) {
      var time = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      // var time = getDate(date);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hour = time.getHours();
      var minute = time.getMinutes();
      var second = time.getSeconds();
      month = month < 10 ? "0" + month : month;
      date = date < 10 ? "0" + date : date;
      hour = hour < 10 ? "0" + hour : hour;
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return month + "-" + date + "  " + hour + "." + minute;
    },
    showStatus(status) {
      switch (status) {
        case 1:
          return "待支付";
          break;
        case 2:
          return "待发货";
          break;
        case 3:
          return "待收货";
          break;
        case 4:
          return "已完成";
          break;
        case 5:
          return "已取消";
          break;
        default:
          return "其他";
      }
    },
    showType(id) {
      console.log(id);
      console.log(this.resourceCategoryData);
      return this.resourceCategoryData.find(e => e.id == id)
        ? this.resourceCategoryData.find(e => e.id == id).name
        : "暂无";
    }
  },
  filters: {
    timeConversion: function(data) {
      var time = new Date(data * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      // var time = getDate(date);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hour = time.getHours();
      var minute = time.getMinutes();
      var second = time.getSeconds();
      month = month < 10 ? "0" + month : month;
      date = date < 10 ? "0" + date : date;
      hour = hour < 10 ? "0" + hour : hour;
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return month + "-" + date + "  " + hour + "." + minute;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.optionTop {
  display: flex;
  font-size: 16px;
  line-height: 26px;
  .selectTime {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .time {
      border: 1px solid #ad2e23;
      color: #ad2e23;
      width: 56px;
      text-align: center;
      border-radius: 2px;
      margin: 0 10px;
    }
  }
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 45%;
  margin: 3% 0 0 3%;
  height: 350px;
  float: left;
}
</style>
