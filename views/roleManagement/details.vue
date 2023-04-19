<template>
  <div class="details-container">

    <el-form
      ref="requestData"
      :model="requestData"
      :rules="rules"
      status-icon
      label-width="100px"
      class="demo-ruleForm">
      <div class="primeArea">
        <el-form-item label="角色名称" prop="name" style="width: 500px;">
          <el-input v-model="requestData.name" type="text" />
        </el-form-item>

        <el-form-item label="角色权限" prop="permissions">
         <div v-for="(item, index) in permissionsList">
            <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" style="font-weight: bold;" @change="handleCheckAllChange(index,item.checkAll)">{{item.tab}}</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="item.checked" @change="handleCheckedChange(index,item.checked)">
              <el-checkbox v-for="permission in item.items" :label="permission.code" :key="permission.code">{{permission.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </div>
      <div class="buttonWrap">
        <el-form-item>
          <el-button type="primary" @click="submitForm('requestData')">保存</el-button>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </div>
    </el-form>

  </div>
</template>

<script>
import { getPermissions, roleCreate, roleDetails } from '@/api/role';
const collect = require('collect.js');
export default {
  name: 'Details',
  data() {
    return {
      requestData: {
        role_id: null,
        name: '',
        permissions: []
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '角色名称为必填' }
        ],
        permissions: [
          { required: true, trigger: 'blur', message: '请选择角色权限' }
        ]
      },
      permissionsList: [],
    }
  },
  watch: {

  },
  created() {
    if(this.$route.query.editId) {
      this.$route.meta.title = '编辑角色';
    }else{
      this.$route.meta.title = '新增角色';
    }
    getPermissions().then(e => {
      this.permissionsList = e.res.map((item,index)=>{
        return Object.assign({
          tab: "",
          items: [
            {
              code: "",
              label: "",
              comment: null,
              order: -1,
              tab: ""
            }
          ],
          isIndeterminate:false,
          checkAll:false,
          checked:[],
        },item);
      });
      if(this.$route.query.editId) {
        roleDetails({ role_id: this.$route.query.editId }).then(e => {
          this.requestData.name = e.res.name;
          this.permissionsList.map((item,index)=>{
            let all = collect(item.items).pluck('code');
            let checked = all.intersect(e.res.permissions ? e.res.permissions : []).all();
            item.checked = checked;
            let checkedCount = item.checked.length;
            item.isIndeterminate = checkedCount > 0 && checkedCount < item.items.length;
            item.checkAll = item.checked.length == item.items.length;
            return item;
          });
        })
      }
    });

  },
  methods: {
    handleCheckAllChange(index,value,) {
      this.permissionsList[index].checked = value ? collect(this.permissionsList[index].items).pluck('code').all() : [];
      this.permissionsList[index].isIndeterminate = false;
    },
    handleCheckedChange(index,value) {
      let checkedCount = value.length;
      this.permissionsList[index].checkAll = checkedCount === this.permissionsList[index].items.length;
      this.permissionsList[index].isIndeterminate = checkedCount > 0 && checkedCount < this.permissionsList[index].items.length;
    },
    submitForm(formName) {
      this.requestData.permissions = collect(this.permissionsList).pluck('checked').collapse().all();
      this.$refs[formName].validate((valid) => {
        if(valid){
          this.requestData.role_id = this.$route.query.editId;
          roleCreate(this.requestData).then(e => {
            this.$message({
              type: 'success',
              message: `${this.$route.query.editId ? '编辑' : '添加'}成功`
            });
            this.$router.go(-1)
          });
        }
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .primeArea{
    width:800px;
  }
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
    padding:20px 0 0 0;
  }
</style>
