<template>
  <div class="login-container">

    <el-form :inline="true" :model="query">

      <!-- <el-form-item>
        <el-input
          v-model="query.name"
          placeholder="请输入公司名称"
          style="width: 200px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.scope" clearable placeholder="行业方向">
          <el-option
            v-for="item in scopeList"
            :key="item.guid"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.scope" clearable placeholder="会员类型">
          <el-option
            v-for="item in scopeList"
            :key="item.guid"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.scope" clearable placeholder="身份证类型">
          <el-option
            v-for="item in scopeList"
            :key="item.guid"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.scope" clearable placeholder="认证状态">
          <el-option
            v-for="item in scopeList"
            :key="item.guid"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.scope" clearable placeholder="冻结状态">
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
      </el-form-item> -->
      <el-form-item style="float:right">
        <el-button class="filter-item" type="primary" @click="addRole()">新增</el-button>
      </el-form-item>

    </el-form>

    <el-table
      v-loading="listLoading"
      :data="rolesList"
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
      <el-table-column align="center" label="角色名称" >
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">{{ scope.row.created_at | timeConversion }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="moreDetails(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteRole(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="pageIndex"
      :limit.sync="pageSize"
      @pagination="handleFilter"
    />

    <!-- 删除 -->
    <el-dialog
      :visible.sync="dialogDelete"
      :close-on-click-modal="false"
      title="删除"
      width="600px"
      center
    >
      <span>请您确认：是否删除  《{{ activeRole.name }}》 角色</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="affirmDelete()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getRolesList, roleDel } from '@/api/role'
// import { userCenter } from '@/api/User'
// import { getVipList } from '@/api/vip'
import Pagination from '@/components/Pagination'
export default {
  name: 'UserCenter',
  components: { Pagination },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      query: {
        platformType: this.platformType,
        name: null,
        scope: null
      },
      scopeList: [{
        name: '测试1',
        value: 1
      }],
      listLoading: true,
      dialogEditVisible: false,

      dataList: [],
      rolesList: [],
      editId: '',
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '资讯名称为必填' }
        ],
        sort: [
          { required: true, trigger: 'blur', message: '资讯序号为必填' }
        ]
      },
      requestData: {
        name: '',
        sort: ''
      },
      dialogDelete: false,
      activeRole: {}
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData: function() {
      getRolesList(
        { per_page: Number(this.pageSize),
          page: Number(this.pageIndex) }
      ).then(e => {
        console.log(e)
        this.listLoading = false
        this.pageIndex = Number(e.res.current_page)
        this.pageSize = Number(e.res.per_page)
        this.total = e.res.total
        this.rolesList = e.res.data
      })
    },
    handleSearch: function() {

    },
    handleFilter: function(e) {
      this.pageSize = Number(e.limit)
      this.initData()
    },
    moreDetails: function(e) {
      this.$router.push({
        path: '/roleManagement/details?editId=' + e.id
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
    showVip: function(id) {
      return this.vipList.find(e => e.id == id) ? this.vipList.find(e => e.id == id).describe : '暂无'
    },
    addRole: function(e) {
      console.log(e)
      this.$router.push({
        path: `/roleManagement/details${e && e.id ? '?editId=${e.id}' : ''}`
      })
    },
    deleteRole: function(e) {
      this.dialogDelete = true
      this.activeRole = e
    },
    affirmDelete: function(e) {
      console.log(e)
      roleDel({ role_id: this.activeRole.id }).then(e => {
        console.log(e)
        this.initData()
        setTimeout(e => {
          this.dialogDelete = false
        }, 500)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
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
