<template>
    <div class="login-container">
        <el-form :inline="true" >
            <el-form-item style="float:right">
                <el-button class="filter-item" type="primary" @click="addCategory()">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table
                v-loading="listLoading"
                :data="adminList"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row
        >
            <el-table-column
                    type="index"
                    align="center"
                    label="序号"
                    width="60"/>
            <el-table-column align="center" label="头像">
                <template slot-scope="scope">
                    <img :src="scope.row.picture?scope.row.picture:defaultAvatar" alt="" style="height:60px;margin:0 auto">
                </template>
            </el-table-column>
            <el-table-column align="center" label="名字" >
                <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column align="center" label="手机号码" >
                <template slot-scope="scope">{{ scope.row.mobile }}</template>
            </el-table-column>
            <el-table-column align="center" label="角色">
                <template slot-scope="scope">{{ roleTxt(scope.row) }}</template>
            </el-table-column>
            <el-table-column align="center" label="最近登录" >
                <template slot-scope="scope">{{ scope.row.lately_login }}</template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editCategory(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteCategory(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
                :total="total"
                :page.sync="pageIndex"
                :limit.sync="pageSize"
                @pagination="handleFilter"
        />

        <!-- 弹窗新增 编辑-->
        <el-dialog
                :visible.sync="dialogAdd"
                :close-on-click-modal="false"
                :title="editId?'编辑管理员':'新增管理员'"
                width="600px"
                center
        >
            <el-form ref="addRequestData" :rules="rules" :model="addRequestData" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addRequestData.name" type="text" placeholder="请输入名称"/>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="addRequestData.role_id" placeholder="请选择" style="width:100%">
                        <el-option
                                v-for="item in rolesList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model="addRequestData.mobile" :disabled="addRequestData.mobile && editId?true:false " type="number" placeholder="请输入手机号码"/>
                </el-form-item>
                <el-form-item label="头像" prop="imgUrl">
                    <upload-img
                            :img-url.sync="imgUrl"
                            :img-width="300"
                            :auto-crop-width="320"
                            :auto-crop-height="320"
                    />
                </el-form-item>
            </el-form >

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAdd = false">取 消</el-button>
                <el-button type="primary" @click="saveCategory('addRequestData')" >确 定</el-button>
            </div>
        </el-dialog>

        <!-- 弹窗删除 -->
        <el-dialog
                :visible.sync="dialogDelete"
                :close-on-click-modal="false"
                title="删除"
                width="500px"
                center
        >
            <span>请您确认：是否删除 手机号为 {{ activeAdmin.mobile }} 的 {{ activeAdmin.name }}用户 </span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="affirmDelete()">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import UploadImg from '@/components/UploadImg'
    import Pagination from '@/components/Pagination'
    import { Message } from 'element-ui'
    import { getAdminList, adminDel, adminCreate } from '@/api/admin'
    import { getRolesList } from '@/api/role'
    import { validatPhone } from '@/utils/validate.js'
    import grant from '@/utils/grant.js';
    export default {
        name: 'UserCenter',
        components: { Pagination, UploadImg },
        data() {
            var checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('号码不能为空'))
                } else {
                    if (!validatPhone(value)) {
                        return callback(new Error('手机号码或者固话不合法'))
                    }
                }
                callback()
            }
            return {
                defaultAvatar: require('@/assets/defaultAvatar.png'),
                imgUrl: '',
                dialogChange: false,
                pageIndex: 1,
                pageSize: 10,
                total: 0,
                dialogVisible: false,
                dialogImageUrl: '',
                dialogAdd: false,
                listLoading: true,
                categoryList: [],
                dialogTitle: '新增分类',
                addRequestData: {
                    name: '',
                    mobile: '',
                    imgUrl: '',
                    role_id: 0,
                },
                rules: {
                    name: [{ required: true, trigger: 'blur', message: '名称为必填' }],
                    mobile: [{ required: true, trigger: 'blur', validator: checkPhone }],
                    imgUrl: [
                        { required: true, trigger: 'blur', message: '头像为必传' }
                    ]
                },
                addRules: {
                    name: [{ required: true, trigger: 'blur', Message: '名称为必填' }]
                },
                editId: '',
                dialogDelete: false,
                activeAdmin: {},
                adminList: [],
                rolesList: []
            }
        },
        computed: {
            uploadUrl() {
                return this.$store.state.uploadUrl
            }
        },
        created() {
          grant.isSuperUser = this.$store.getters.role_id === 0;
          grant.permissions = this.$store.getters.permissions;
          this.initData();
          getRolesList().then(e => {
              this.rolesList = [{ 'name': '超级管理员', id: 0 }, ...e.res.data]
          });
        },
        methods: {
            // 初始化数据
            initData() {
                getAdminList({
                  per_page: this.pageSize,
                  page: this.pageIndex,
                }).then(
                    response => {
                        this.total = response.res.total
                        this.pageIndex = response.res.current_page
                        this.pageSize = Number(response.res.per_page)
                        this.adminList = response.res.items
                        this.listLoading = false
                    },
                    err => {
                        this.listLoading = false
                    }
                )
            },
            // 新增
            addCategory() {
                this.dialogAdd = true
                this.editId = null
                this.addRequestData = {
                    name: '',
                    mobile: '',
                    password: '',
                    affirm_password: '',
                    imgUrl: '',
                    role_id: null
                }
                this.imgUrl = '';
            },
            // 编辑
            editCategory(e) {
              if(!grant.hasAccess('admin.edit')){
                  this.$message({
                    type: "warning",
                    message: "无权限"
                  });
                  return;
              }
              this.dialogAdd = true
              this.editId = e.id
              this.addRequestData = {
                  id: e.id,
                  imgUrl: e.picture,
                  mobile: e.mobile,
                  name: e.name,
                  role_id: e.role_id
              }
              this.imgUrl = e.picture ? e.picture : null;
            },
            // 删除
            deleteCategory(e) {
              if(!grant.hasAccess('admin.delete')){
                  this.$message({
                    type: "warning",
                    message: "无权限"
                  });
                  return;
              }
                this.dialogDelete = true
                this.activeAdmin = e
            },
            // 确认保存
            saveCategory(addRequestData) {
                const that = this
                that.addRequestData.imgUrl = that.imgUrl
                this.$refs[addRequestData].validate((valid) => {
                    if (valid) {
                        const addRequestData = {
                            mobile: this.addRequestData.mobile,
                            role_id: this.addRequestData.role_id,
                            name: this.addRequestData.name,
                            picture: this.addRequestData.imgUrl
                        }
                        if (this.editId) {
                            addRequestData.admin_id = this.editId
                        }
                        adminCreate(addRequestData).then(e => {
                            this.initData();
                            Message({
                                message: `${this.editId ? '编辑' : '新增'}成功`,
                                type: 'success',
                                duration: 5 * 1000
                            })
                            setTimeout(e => {
                                this.dialogAdd = false
                            }, 1000)
                        })
                    }
                })
            },
            // 确认删除
            affirmDelete(e) {
                adminDel({ admin_id: this.activeAdmin.id }).then(e => {
                    this.initData();
                    Message({
                        message: '删除成功',
                        type: 'success',
                        duration: 5 * 1000
                    })
                    setTimeout(e => {
                        this.dialogDelete = false
                    }, 1000)
                })
            },
            handleAvatarSuccess(res, file) {
                this.addRequestData.img = res.res.image
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg'
                const isLt2M = file.size / 1024 / 1024 < 2
                return isJPG && isLt2M
            },
            // 图片放大
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url
                this.dialogVisible = true
            },
            // 分页
            handleFilter: function(e) {
                this.pageSize = e.limit
                this.initData();
            },
            roleTxt(row){
              if(row.role_id === 0){
                return '超级管理员';
              }
              if(row.role){
                return row.role.name;
              }else{
                return '未设置';
              }

            },

        }
    }
</script>

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
