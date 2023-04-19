<template>
  <div class="login-container">
    <el-form :inline="true" :model="query">
      <el-form-item>
        <el-input
          v-model="query.title"
          placeholder="资讯名称"
          style="width: 160px;"
          class="filter-item"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="query.type" clearable placeholder="资讯类型">
          <el-option
            v-for="item in informationCategoryData"
            :key="item.guid"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button class="filter-item" type="primary" @click="publish">发布资讯</el-button>
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
      <el-table-column type="index" align="center" label="序号" width="60" />
      <el-table-column align="center" label="封面">
        <template slot-scope="scope">
          <div class="commodityDetails" width="180">
            <div class="left">
              <el-popover placement="right" title trigger="hover">
                <img
                  :src="scope.row.cover"
                  style="max-width: 500px;max-height: 500px;border:2px solid #eee"
                />
                <img slot="reference" :src="scope.row.cover" alt style="height:60px;margin:0 auto" />
              </el-popover>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="资讯名称">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">{{ scope.row.created_at | timeConversion }}</template>
      </el-table-column>

      <el-table-column align="center" label="来源">
        <template slot-scope="scope">{{ scope.row.source }}</template>
      </el-table-column>
      <el-table-column align="center" label="资讯类型">
        <template slot-scope="scope">{{ showType(scope.row.type) }}</template>
      </el-table-column>

      <el-table-column align="center" label="是否推荐">
        <template slot-scope="scope">{{ scope.row.hot==1?"推荐":"正常" }}</template>
      </el-table-column>

      <el-table-column align="center" label="浏览量">
        <template slot-scope="scope">{{ scope.row.pv }}</template>
      </el-table-column>

      <el-table-column align="center" label="排序">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sort" placeholder="请输入内容" style="width: 100px;" @blur="informationSortFn(scope.row.id,scope.row.sort)"></el-input>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDialogHot(scope.row)">
            {{
            scope.row.hot==1?'设为正常':'设为推荐' }}
          </el-button>
          <el-button type="text" size="small" @click="viewProject(scope.row)">查看资讯详情</el-button>
          <br />
          <el-button type="text" size="small" @click="showDialogDelete(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="editorActivity(scope.row)">编辑</el-button>
          <el-button
            type="text"
            size="small"
            v-clipboard:copy="'../informationParticulars/informationParticulars?id=' + scope.row.id"
            v-clipboard:success="copy"
          >复制链接</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page.sync="pageIndex"
      :limit.sync="pageSize"
      @pagination="handleFilter"
    />
    <!-- 上下架 -->
    <el-dialog
      :visible.sync="dialogHot"
      :close-on-click-modal="false"
      title="上下架"
      width="600px"
      center
    >
      <span>请您确认：是否将 《{{ activeInformation.title }}》 设为 {{ activeInformation.hot==1?'正常':'推荐' }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogHot = false">取 消</el-button>
        <el-button type="primary" @click="changeStatus()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog
      :visible.sync="dialogDelete"
      :close-on-click-modal="false"
      title="删除"
      width="600px"
      center
    >
      <span>请您确认：是否删除 《{{ activeInformation.title }}》</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="changeDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import grant from '@/utils/grant.js';
import {
  getInformationList,
  informationDel,
  informationHot,
  informationCategory,
  informationSort
} from "@/api/information";

export default {
  name: "Information",
  components: { Pagination },
  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      query: {
        platformType: this.platformType,
        title: null,
        type: null
      },
      scopeList: [
        {
          name: "测试1",
          value: 1
        }
      ],
      listLoading: true,
      dataList: [],
      activeInformation: {},
      dialogHot: false,
      dialogDelete: false,
      informationCategoryData: []
    };
  },
  computed: {
    testUrl() {
      return 111;
    }
  },
  mounted() {
    console.log(this.testUrl);
  },
  created() {
    grant.isSuperUser = this.$store.getters.role_id === 0;
    grant.permissions = this.$store.getters.permissions;
    this.InitData();
    informationCategory().then(e => {
      console.log(e);
      this.informationCategoryData = [
        ...[{ id: null, name: "全部" }],
        ...e.res.data
      ];
    });
  },
  methods: {
    InitData() {
      this.listLoading = true;
      getInformationList({
        per_page: this.pageSize,
        page: this.pageIndex,
        title: this.query.title,
        type: this.query.type
      }).then(e => {
        console.log(e);
        this.total = e.res.total;
        this.pageIndex = e.res.current_page;
        this.pageSize = Number(e.res.per_page);
        this.dataList = e.res.items;
        this.listLoading = false;
      });
      // getActivityList({
      //   per_page: this.pageSize,
      //   page: this.pageIndex
      // }).then(
      //   response => {
      //     console.log(response)
      //     this.dataList = response.res.data

      //     this.query.total = response.res.total
      //     this.pageIndex = response.res.current_page
      //     this.pageSize = Number(response.res.per_page)
      //     console.log(this.query)
      //     this.listLoading = false
      //   },
      //   err => {
      //     console.log(err)
      //     this.listLoading = false
      //   }
      // )
    },
    // 搜索
    handleSearch: function() {
      this.pageIndex = 1;
      this.InitData();
      console.log(this.query);
    },
    // 分页
    handleFilter: function(e) {
      this.pageSize = e.limit;
      this.InitData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    viewProject(e) {
      this.$router.push({
        path: "/information/details?information_id=" + e.id
      });
    },
    publish() {
      if(!grant.hasAccess('information.create')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      this.$router.push({
        path: "/information/publish"
      });
    },
    //  显示上下架
    showDialogHot(e) {
      console.log(e);
      this.activeInformation = e;
      this.dialogHot = true;
    },
    // 改变活动状态--
    changeStatus(e) {
      const that = this;
      informationHot({
        information_id: this.activeInformation.id,
        hot: this.activeInformation.hot == 1 ? 2 : 1
      }).then(
        e => {
          setTimeout(e => {
            this.dialogHot = false;
            that.InitData();
          }, 500);
          this.$message({
            type: "success",
            message: "操作成功"
          });
        },
        err => {
          console.log(err);
        }
      );
    },
    // 显示删除弹窗
    showDialogDelete(e) {
      if(!grant.hasAccess('information.delete')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      this.activeInformation = e;
      this.dialogDelete = true;
    },
    // 删除资讯
    changeDelete() {
      const that = this;
      informationDel({ information_id: this.activeInformation.id }).then(
        e => {
          setTimeout(e => {
            this.dialogDelete = false;
            that.InitData();
          }, 500);
          this.$message({
            type: "success",
            message: "操作成功"
          });
        },
        err => {
          console.log(err);
        }
      );
    },
    // 编辑
    editorActivity(e) {
      if(!grant.hasAccess('information.edit')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      this.$router.push({
        path: `/Information/publish?editId=${e.id}`
      });
    },
    showType(id) {
      console.log(id);
      console.log(this.informationCategoryData);
      return this.informationCategoryData.find(e => e.id == id)
        ? this.informationCategoryData.find(e => e.id == id).name
        : "其他";
    },
    copy(id) {
      this.$message({
          showClose: true,
          message: "复制成功",
          type: "success"
        });
    },
    informationSortFn(id,sort){
        informationSort({
          information_id:id,
          sort:sort
        }).then(res=>{
          if(res.code == 200){
            this.$message({
                showClose: true,
                message: "操作成功",
                type: "success"
              });
          }
          this.InitData();
        })
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
