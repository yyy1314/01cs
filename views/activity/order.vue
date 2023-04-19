<template>
  <div class="login-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.actName"
          placeholder="请输入活动名称"
          style="width: 400px;"
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
      <el-form-item>
        <el-input
          v-model="query.remark"
          placeholder="请输入备注"
          style="width: 200px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.notify" clearable placeholder="短信通知">
          <el-option label="未发" value="0"></el-option>
          <el-option label="已发" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="InitData">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="success" icon="el-icon-message" @click="sendSMS()">发短信</el-button>
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
      <el-table-column type="index" align="center" label="序号" width="100" />
      <el-table-column align="center" label="订单编号" width="150">
        <template slot-scope="scope">{{ scope.row.out_trade_no }}</template>
      </el-table-column>
      <el-table-column align="center" label="活动名称">
        <template slot-scope="scope">{{ scope.row.activity.name.substr(0,24) + '...' }}</template>
      </el-table-column>
      <el-table-column align="center" label="报名姓名" width="100">
        <template slot-scope="scope">{{ scope.row.join_name }}</template>
      </el-table-column>
      <el-table-column align="center" label="联系电话" width="150">
        <template slot-scope="scope">{{ scope.row.join_mobile }}</template>
      </el-table-column>
      <el-table-column align="center" label="订单状态" width="100">
        <template
          slot-scope="scope"
        >{{ scope.row.status == 1 ? '待支付' : scope.row.status == 2 ? '已支付' : scope.row.status == 4 ? '审核通过' : scope.row.status == 5 ? '审核不通过' : "已取消"}}</template>
      </el-table-column>
      <el-table-column align="center" label="回复" width="100">
        <template slot-scope="scope">{{ scope.row.sms_up ? scope.row.sms_up.join(';') : "未回" }}</template>
      </el-table-column>
      <el-table-column align="center" label="短信条数" width="100">
        <template slot-scope="scope">{{ scope.row.sms_count }}</template>
      </el-table-column>
      <el-table-column align="center" label="备注" width="100">
        <template slot-scope="scope">{{ scope.row.remark ? scope.row.remark.substr(0,4) + '...' : ''}}</template>
      </el-table-column>
      <el-table-column align="center" label="报名时间" width="180">
        <template slot-scope="scope">{{ scope.row.created_at | timeConversion }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="pass(scope.row.id)"
            v-show="scope.row.status == 2 && scope.row. channel == 1"
          >通过</el-button>
          <el-button
            type="text"
            size="small"
            @click="noPass(scope.row.id)"
            v-show="scope.row.status == 2 && scope.row. channel == 1"
          >不通过</el-button>
          <el-button type="text" size="small" @click="moreDetails(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="setting(scope.row)">设置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="pageIndex" :limit.sync="pageSize" :page-sizes="[10,15,20,30,50,100,300]" @pagination="handleFilter"/>
    <!-- 弹窗 设置-->
    <el-dialog
      :visible.sync="dialogSetting"
      :close-on-click-modal="false"
      :title="dialogTitle"
      width="600px"
      center
    >
      <el-form ref="requestData" :rules="rules" :model="requestData" label-width>
        <el-form-item label="座次" prop="name">
          <el-input v-model="requestData.seat" type="text" placeholder="请输入座次信息"/>
        </el-form-item>
        <el-form-item label="餐饮" prop="sort">
          <el-input v-model="requestData.repast" type="text" placeholder="请输入餐饮信息" />
        </el-form-item>
        <el-form-item label="其他" prop="other">
          <el-input v-model="requestData.other" type="textarea" rows="5" placeholder="其他" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetting = false">取 消</el-button>
        <el-button type="primary" @click="saveSetting('requestData')">确 定</el-button>
      </div>
    </el-dialog>
    <activity-join-sms :visible="sendSMSVisible" :query="sendSmsQuery" @close="sendSMSVisible = false"></activity-join-sms>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import activityJoinSms from '@/components/activity/activityJoinSms.vue';
import grant from '@/utils/grant.js';
import {
  activityJoin,
  activityJoinSetting,
  activityPass
} from "@/api/activity";
export default {
  name: "UserCenter",
  components: { Pagination, activityJoinSms },
  data() {
    return {
      activityData: "",
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      query: {
        platformType: this.platformType,
        name: null,
        scope: null,
        actName: null,
        num: null,
        notify: null,
        remark: null,
      },
      sendSmsQuery:{

      },
      scopeList: [
        {
          name: "测试1",
          value: 1
        }
      ],
      requestData: {
        seat: "",
        repast: "",
        other: ""
      },
      rules: {
        seat: [{ required: true, trigger: "blur", message: "座次信息必填" }],
        repast: [{ required: true, trigger: "blur", message: "到期时间必选" }]
      },
      listLoading: true,
      dialogTitle: "设置",
      dialogSetting: false,
      dialogEditVisible: false,
      sendSMSVisible:false,
      orderList: [],
      editId: 0
    };
  },
  created() {
    grant.isSuperUser = this.$store.getters.role_id === 0;
    grant.permissions = this.$store.getters.permissions;
    this.query.actName = this.$route.query.activity_name;
    this.InitData();
  },
  methods: {
    InitData() {
      activityJoin({
        per_page: this.pageSize,
        page: this.pageIndex,
        activity_name: this.query.actName,
        join_name: this.query.name,
        out_trade_no: this.query.num,
        notify: this.query.notify,
        remark: this.query.remark,
      }).then(response => {
          this.orderList = response.res.items;
          this.total = response.res.total;
          this.pageIndex = response.res.current_page;
          this.pageSize = Number(response.res.per_page);
          this.listLoading = false;
        },err => {
          this.listLoading = false;
        }
      );
    },
    // 分页
    handleFilter: function(e) {
      this.pageSize = e.limit;
      this.InitData();
    },
    moreDetails: function(e) {
      console.log(e);

      this.$router.push({
        path: `/activity/orderDetails?id=${e.id}`
      });
    },
    sendSMS(){
      if(!grant.hasAccess('activity_join.send_sms')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      if(!this.query.actName){
        this.$message({
          type:'info',
          message:'请输入活动名称'
        });
        return;
      }
      this.sendSmsQuery = {
        per_page: 9999,
        page: 1,
        activity_name: this.query.actName,
        join_name: this.query.name,
        out_trade_no: this.query.num,
        notify: this.query.notify,
        remark: this.query.remark,
      };
      this.sendSMSVisible = true;
    },
    ReviewApplication: function() {
      this.dialogEditVisible = false;
      this.$message({
        type: "success",
        message: "审核成功"
      });
    },
    setting: function(e) {
      this.dialogSetting = true;
      this.editId = e.id;
      this.requestData.seat = e.seat;
      this.requestData.repast = e.repast;
      this.requestData.other = e.other;
      // activityJoinSetting().then(e=>{
      //
      // })
    },
    saveSetting: function(data) {
      this.$refs[data].validate(valid => {
        if (valid) {
          if (this.editId) {
            this.requestData.activity_join_id = this.editId;
          }
          activityJoinSetting(this.requestData).then(e => {
            this.dialogSetting = false;
            this.InitData();
          });
        }
      });
    },
    //报名通过
    pass(id) {
      activityPass({
        activity_join_id: id,
        status: 4
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            showClose: true,
            message: "操作成功",
            type: "success"
          });
          this.InitData()
        }
      });
      console.log(id);
    },
    noPass(id) {
      activityPass({
        activity_join_id: id,
        status: 5
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            showClose: true,
            message: "操作成功",
            type: "success"
          });
           this.InitData()
        }

      });
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
