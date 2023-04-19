<template>
  <div class="login-container">
    <el-form :inline="true" :model="query">
      <el-form-item >
        <el-input
          v-model="query.title"
          placeholder="项目名称"
          style="width: 160px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.type" clearable placeholder="项目类型">
          <el-option
            v-for="item in resourceCategoryData"
            :key="item.guid"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="query.category" clearable placeholder="招商类型">
          <el-option
            v-for="item in categoryListData"
            :key="item.guid"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.provinces" clearable placeholder="省">
          <el-option
            v-for="item in provinces"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.cities" clearable placeholder="城市">
          <el-option
            v-for="item in cities"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button class="filter-item" type="primary" @click="publish">发布项目</el-button>
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
      <el-table-column type="index" align="center" label="序号" width="60"/>

      <el-table-column align="center" label="项目标题" width="300" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column align="center" label="地点" width="200" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.location }}</template>
      </el-table-column>

      <el-table-column align="center" label="创建时间" width="180">
        <template slot-scope="scope">{{ scope.row.created_at | timeConversion }}</template>
      </el-table-column>

      <el-table-column align="center" label="截止时间" width="180">
        <template slot-scope="scope">{{ scope.row.deadline | timeConversion }}</template>
      </el-table-column>
      <el-table-column align="center" label="资源类型" width="120">
        <template slot-scope="scope">{{ showType(scope.row.type) }}</template>
      </el-table-column>

      <el-table-column align="center" label="上下架" width="100">
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.status == 1 ? true : false" @change="switchStatus(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="招商类型" width="100">
        <template slot-scope="scope">{{ scope.row.category==1?"企业":'政府' }}</template>
      </el-table-column>
       <el-table-column align="center" label="访问量" width="80">
        <template slot-scope="scope">{{ scope.row.pv }}</template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewProject(scope.row)">详情</el-button>
          <el-button type="text" size="small" @click="goOrder(scope.row)">订单</el-button>
          <el-button type="text" size="small" @click="showDialogDelete(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="editorActivity(scope.row)">编辑</el-button>
          <el-button
            type="text"
            size="small"
            v-clipboard:copy="scope.row.category == 1?'../projectDockingParticulars/projectDockingParticulars?id=' + scope.row.id:'../investmentParticulars/investmentParticulars?id=' + scope.row.id"
            v-clipboard:success="copy"
          >链接</el-button>
          <el-button type="text" size="small" @click="downWxacode(scope.row)">二维码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="pageIndex" :limit.sync="pageSize" @pagination="handleFilter"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { getResourceList, resourceDel, resourceCategory, resourceAdded, gitCity} from '@/api/resource';
import request from '@/utils/request';
import grant from '@/utils/grant.js';
export default {
  name: 'Resource',
  components: { Pagination },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      query: {
        platformType: this.platformType,
        title: null,
        type: null,
        category: null,
        cities:null,
        provinces:null
      },
      categoryListData: [
        {
          name: '全部',
          id: 0
        },
        {
          name: '政府',
          id: 2
        },
        {
          name: '企业',
          id: 1
        }
      ],
      scopeList: [{
        name: '测试1',
        value: 1
      }],
      listLoading: true,
      dataList: [],
      activeResource: {},
      dialogHot: false,
      dialogDelete: false,
      resourceCategoryData: [],
      cities:[],
      provinces:[]
    }
  },
  computed: {
    testUrl() {
      return 111
    }
  },
  mounted() {

  },
  created() {
    grant.isSuperUser = this.$store.getters.role_id === 0;
    grant.permissions = this.$store.getters.permissions;
    this.InitData();
    resourceCategory({
      type:"all"
    }).then(e => {
      this.resourceCategoryData = [{ id: 0, name: '全部' }, ...e.res]
    })
    gitCity().then(e => {
      this.provinces =  ["全部",...e.res.provinces]
      this.cities =  ["全部",...e.res.cities]
    })
  },
  methods: {
    InitData() {
      this.listLoading = true
      getResourceList(
        { per_page: this.pageSize,
          page: this.pageIndex,
          title: this.query.title,
          type: this.query.type,
          category: this.query.category,
          city: this.query.cities == "全部"?null:this.query.cities,
          province: this.query.provinces == "全部"?null:this.query.provinces,

        }).then(e => {

        this.total = e.res.total;
        this.pageIndex = e.res.current_page;
        this.pageSize = Number(e.res.per_page);
        this.dataList = e.res.items;
        this.listLoading = false;
      })
    },
    // 搜索
    handleSearch: function() {
      this.pageIndex = 1
      this.InitData();

    },
    // 分页
    handleFilter: function(e) {
      this.pageSize = e.limit
      this.InitData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    viewProject(e) {
      this.$router.push({
        path: '/resource/details?id=' + e.id
      })
    },
    publish() {
      if(!grant.hasAccess('resource.create')){
          this.$message({
            type: "success",
            message: "无权限"
          });
          return;
      }
      this.$router.push({
        path: '/resource/publish'
      })
    },
    // 改变状态--
    switchStatus(row) {
      let status = row.status == 1 ? 2 : 1;
      resourceAdded({ resource_id: row.id, status: status }).then(e => {
          if(e.code == 200){
              row.status = status;
          }
      }, err => {
        console.log(err)
      })
    },
    // 显示删除弹窗
    showDialogDelete(e) {
      if(!grant.hasAccess('resource.delete')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      this.activeResource = e;
      this.$confirm('此操作将删除项目, 是否继续?', '删除'+this.activeResource.title, {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }).then(() => {
            resourceDel({ resource_id: this.activeResource.id }).then(response=>{
              if(response.code === 200){
                this.$message({
                 message: '删除成功',
                 type: 'success'
                });
                this.InitData();
              }else{
                this.$message({
                  message: response.msg,
                  type: 'warning'
                });
              }
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
      if(!grant.hasAccess('resource.edit')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      this.$router.push({
        path: `/resource/publish?editId=${e.id}`
      });
    },
    showType(id) {

      return this.resourceCategoryData.find(e => e.id == id) ? this.resourceCategoryData.find(e => e.id == id).name : '暂无'
    },
    goOrder(e) {

      this.$router.push({
        path: `/resource/order?id=${e.id}`
      })
    },
    copy(id) {
      this.$message({
          showClose: true,
          message: "复制成功",
          type: "success"
        });
    },
    downWxacode(row){
      let path = null;
      if(row.category == 1){
        path = 'pages/projectDockingParticulars/projectDockingParticulars?id=' + row.id;
      }else if(row.category == 2){
        path = 'pages/investmentParticulars/investmentParticulars?id=' + row.id;
      }
      window.open(request.defaults.baseURL + '/qrcode/wxacode?path=' + encodeURI(path));
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
