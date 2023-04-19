<template>
  <div class="login-container">
    <el-select v-model="value" placeholder="请选择" style="float:left" @change="change">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-form :inline="true">
      <el-form-item style="float:right">
        <el-button class="filter-item" type="primary" @click="addCategory()">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="categoryList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="排序">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="center" label="id">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editCategory(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteCategory(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗新增 编辑-->
    <el-dialog
      :visible.sync="dialogAdd"
      :close-on-click-modal="false"
      :title="editId?'编辑分类':'新增分类'"
      width="600px"
      center
    >
      <el-form ref="requestData" :rules="rules" :model="requestData" label-width="80px">
        <el-form-item label="分类性质" prop="sort">
          <el-radio v-model="radio" label="1" @change="radioChange1">政府</el-radio>
          <el-radio v-model="radio" label="2" @change="radioChange2">企业</el-radio>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="requestData.name" type="text" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类排序" prop="sort">
          <el-input v-model="requestData.sort" type="number" placeholder="请输入排序号" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="saveCategory('requestData')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹窗删除 -->
    <el-dialog
      :visible.sync="dialogDelete"
      :close-on-click-modal="false"
      title="删除"
      width="600px"
      center
    >
      <span>请您确认：是否删除 《 {{ activeCategroy.name }} 》 资源分类</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="affirmDelete()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { Message } from "element-ui";
import grant from '@/utils/grant.js';

import {
  informationCategory,
  informationCategoryCreate,

} from "@/api/information";
import {
  resourceCategoryDel,
  resourceCategory,
  resourceCategoryCreate,
  resourceList
} from "@/api/resource";

export default {
  name: "UserCenter",
  components: { Pagination },
  data() {
    return {
      dialogAdd: false,
      listLoading: true,
      categoryList: [],
      dialogTitle: "新增分类",
      requestData: {
        name: "",
        sort: ""
      },
      rules: {
        name: [{ required: true, trigger: "blur", message: "资讯名称为必填" }],
        sort: [{ required: true, trigger: "blur", message: "资讯序号为必填" }]
      },
      editId: "",
      dialogDelete: false,
      activeCategroy: {},
      options: [
        {
          value: "1",
          label: "政府"
        },
        {
          value: "2",
          label: "企业"
        }
      ],
      value: "政府",
      radio: "1"
    };
  },
  created() {
    grant.isSuperUser = this.$store.getters.role_id === 0;
    grant.permissions = this.$store.getters.permissions;
    this.initiData();
  },
  methods: {
    // 初始化数据
    initiData() {
      resourceCategory({}).then(
        response => {
          console.log(response);
          this.categoryList = response.res;
          this.listLoading = false;
        },
        err => {
          console.log(err);
          this.listLoading = false;
        }
      );
    },
    getList() {
      resourceList({ type: "enterprise" }).then(res => {
        console.log(res);
        this.categoryList = res.res;
      });
    },
    // 新增
    addCategory() {
      this.dialogAdd = true;
      this.editId = null;
      this.requestData.name = undefined;
      this.requestData.sort = undefined;
      this.requestData.type = this.radio == "1" ? "government" : "enterprise";
      console.log(123456);
    },
    // 编辑
    editCategory(e) {
      console.log(e);
      this.dialogAdd = true;
      this.editId = e.id;
      this.requestData.name = e.name;
      this.requestData.sort = e.sort;
      this.requestData.type = this.radio == "1" ? "government" : "enterprise";
      console.log("编辑");
    },
    // 删除
    deleteCategory(e) {
      if(!grant.hasAccess('resource_category.delete')){
          this.$message({
            type: "warning",
            message: "无权限"
          });
          return;
      }
      this.dialogDelete = true;
      this.activeCategroy = e;
    },
    // 确认保存
    saveCategory(formName) {
      console.log(formName);
      const that = this;
      this.$refs[formName].validate(valid => {
        console.log(that.requestData);
        if (valid) {
          const requestData = this.requestData;
          if (this.editId) {
            requestData.resource_category_id = this.editId;
          }
          resourceCategoryCreate(requestData).then(e => {
            console.log(e);
            if (this.radio == "1") {
              this.initiData();
            } else {
              this.getList();
            }

            Message({
              message: `${this.editId ? "编辑" : "新增"}成功`,
              type: "success",
              duration: 5 * 1000
            });

            setTimeout(e => {
              this.dialogAdd = false;
            }, 1000);
          });
        }
      });
    },
    // 确认删除
    affirmDelete(e) {
      let that = this
      console.log(e);
      resourceCategoryDel({
        resource_category_id: this.activeCategroy.id
      }).then(e => {
        console.log(e);
        if (this.radio == "1") {
          that.initiData();
        } else {
          that.getList();
        }
        Message({
          message: "删除成功",
          type: "success",
          duration: 5 * 1000
        });

        setTimeout(e => {
          this.dialogDelete = false;
        }, 1000);
      });
    },
    //下拉改变
    change(e) {
      if (e == 1) {
        this.initiData();
        this.radio = "1";
      } else if (e == 2) {
        this.getList();
        this.radio = "2";
      }
    },
    radioChange1(e) {
      this.requestData.type = e == "1" ? "government" : "enterprise";
      console.log(this.requestData.type);
    },
    radioChange2(e) {
      this.requestData.type = e == "1" ? "government" : "enterprise";
      console.log(this.requestData.type);
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
