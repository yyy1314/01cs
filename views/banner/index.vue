<template>
    <div class="login-container">
        <el-form :inline="true" :model="query">
            <el-form-item>
              <el-input
                v-model="query.keyword"
                placeholder="请输入标题"
                style="width: 160px;"
                class="filter-item"
              />
            </el-form-item>
            <el-form-item>
              <el-select v-model="query.scene" clearable placeholder="类型">
                <el-option
                  v-for="item in sceneQuery"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </el-form-item>
            <el-form-item style="float:right">
                <el-button class="filter-item" type="primary" @click="addCategory()">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table
                v-loading="listLoading"
                :data="bannerList"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row
        >
            <el-table-column align="center" label="排序" >
                <template slot-scope="scope">{{ scope.row.sort }}</template>
            </el-table-column>
            <el-table-column align="center" label="类型" >
                <template slot-scope="scope">{{ showScene(scope.row.scene) }}</template>
            </el-table-column>
            <el-table-column align="center" label="名称" >
                <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column align="center" label="图片">
                <template slot-scope="scope">
                    <el-popover placement="right" title="" trigger="hover">
                        <img :src="scope.row.img" style="max-width: 500px;max-height: 500px;border:2px solid #eee">
                        <img slot="reference" :src="scope.row.img" alt="" style="height:60px;margin:0 auto">
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column align="center" label="跳转链接">
                <template slot-scope="scope">{{ scope.row.url }}</template>
            </el-table-column>

            <el-table-column align="center" label="状态">
                <template slot-scope="scope">{{ scope.row.status==1?"上架":"下架" }}</template>
            </el-table-column>

            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="upDown(scope.row)">{{ scope.row.status==1?"下架":"上架" }}</el-button>
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
                :title="editId?'编辑轮播图':'新增轮播图'"
                width="600px"
                center
        >
            <el-form ref="requestData" :rules="rules" :model="requestData">
                <el-form-item label="banner名称" prop="name">
                    <el-input v-model="requestData.name" type="text" placeholder="请输入banner名称"/>
                </el-form-item>
                <el-form-item>
                  <el-select v-model="requestData.scene" clearable placeholder="类型">
                    <el-option
                      v-for="item in scenes"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="banner排序" prop="sort">
                    <el-input v-model="requestData.sort" type="number" placeholder="请输入排序号"/>
                </el-form-item>
                <el-form-item label="链接地址" prop="url">
                    <el-input v-model="requestData.url" type="text" placeholder="请输入链接地址"/>
                </el-form-item>
                <el-form-item label="banner图片" prop="img">
                    <upload-img
                            :img-url.sync="imgUrl"
                            :img-width="345"
                            :auto-crop-width="345"
                            :auto-crop-height="180"
                    />

                </el-form-item>
            </el-form >

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAdd = false">取 消</el-button>
                <el-button type="primary" @click="saveCategory('requestData')" >确 定</el-button>
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
            <span>请您确认：是否删除  《 {{ activeBanner.name }} 》  轮播图</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDelete = false">取 消</el-button>
                <el-button type="primary" @click="affirmDelete()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 弹窗上下架 -->
        <el-dialog
                :visible.sync="dialogUpDown"
                :close-on-click-modal="false"
                title="删除"
                width="600px"
                center
        >
            <span>请您确认：是否{{ activeBanner.status ==1 ? "下架" : "下架" }}  《 {{ activeBanner.name }} 》  轮播图</span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogUpDown = false">取 消</el-button>
        <el-button type="primary" @click="affirmUpDown()">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import Pagination from '@/components/Pagination';
    import { Message } from 'element-ui';
    import { getbannerList, bannerCreate, bannerDel, bannerUpDown} from '@/api/banner';
    import UploadImg from '@/components/UploadImg';
    import grant from '@/utils/grant.js';
    export default {
        name: 'UserCenter',
        components: { Pagination, UploadImg },
        data() {
            return {
                imgUrl: '',
                url: require('@/assets/uploadImg.png'),
                pageIndex: 1,
                pageSize: 10,
                total: 0,
                query: {
                  keyword: null,
                  scene: null,
                },
                sceneQuery: [
                  {code:null,name:'全部类型'},{code:'home',name:'首页'},{code:'shop',name:'商城'},
                ],
                scenes: [
                  {code:'home',name:'首页'},{code:'shop',name:'商城'},
                ],
                dialogVisible: false,
                dialogImageUrl: '',
                dialogAdd: false,
                listLoading: true,
                categoryList: [],
                dialogTitle: '新增分类',
                requestData: {
                    name: '',
                    scene: null,
                    img: '',
                    sort: '',
                    url: ''
                },
                rules: {
                    name: [
                        { required: true, trigger: 'blur', message: 'banner名称为必填' }
                    ],
                    sort: [
                        { required: true, trigger: 'blur', message: 'banner序号为必填' }
                    ],
                    img: [
                        { required: true, trigger: 'blur', message: '图片为必传' }
                    ]
                },
                editId: '',
                dialogDelete: false,
                dialogUpDown: false,
                activeBanner: {},
                bannerList: []
            }
        },
        computed: {
            uploadUrl() {
                return this.$store.state.uploadUrl
            }
        },
        watch: {
            imgUrl() {
                this.requestData.img = this.imgUrl
            }
        },
        created() {
          grant.isSuperUser = this.$store.getters.role_id === 0;
          grant.permissions = this.$store.getters.permissions;
          this.initiData();
        },
        methods: {
            // 初始化数据
            initiData() {
                getbannerList({
                  keyword: this.query.keyword,
                  scene: this.query.scene,
                  per_page: this.pageSize,
                  page:this.pageIndex
                }).then(
                    response => {
                        this.total = response.res.total
                        this.pageIndex = response.res.current_page
                        this.pageSize = Number(response.res.per_page)
                        this.bannerList = response.res.data
                        this.listLoading = false
                    },
                    err => {
                        this.listLoading = false
                    }
                )
            },
            showScene(scene){
              switch (scene) {
                  case 'home':
                      return '首页'
                      break;
                  case 'shop':
                      return '商城'
                      break;
                  default:
                      return '其他'
              }
            },
            handleSearch(){
              this.pageIndex = 1;
              this.initiData();
            },
            // 新增
            addCategory() {
                this.dialogAdd = true
                this.editId = null
                this.imgUrl = ''
                this.requestData = {
                    name: '',
                    img: '',
                    sort: '',
                    url: ''
                }
            },
            // 编辑
            editCategory(e) {
                this.dialogAdd = true
                this.editId = e.id
                this.requestData = e
                this.requestData.imgUrl = this.requestData.img
                this.imgUrl = this.requestData.img
            },
            // 删除
            deleteCategory(e) {
              if(!grant.hasAccess('banner.delete')){
                  this.$message({
                    type: "warning",
                    message: "无权限"
                  });
                  return;
              }
              this.dialogDelete = true;
              this.activeBanner = e;
            },
            //上下架
            upDown(e) {
                this.dialogUpDown = true
                this.activeBanner = e
            },
            affirmUpDown(){
                bannerUpDown({banner_id:this.activeBanner.id}).then( e =>{
                    setTimeout(e => {
                        this.dialogUpDown = false
                        this.initiData()
                    }, 500)
                    Message({
                        message: '操作成功',
                        type: 'success',
                        duration: 5 * 1000
                    })
                })
            },
            // 确认保存
            saveCategory(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const requestData = {
                            name: this.requestData.name,
                            scene: this.requestData.scene,
                            img: this.requestData.img,
                            sort: this.requestData.sort,
                            url: this.requestData.url
                        }
                        if (this.editId) {
                            requestData.banner_id = this.editId
                        }
                        bannerCreate(requestData).then(e => {
                          if(e.code == 200){
                            this.initiData()
                            Message({
                                message: `${this.editId ? '编辑' : '新增'}成功`,
                                type: 'success',
                                duration: 5 * 1000
                            })
                            setTimeout(e => {
                                this.dialogAdd = false
                            }, 1000)
                          }else{
                            Message({
                                message: e.msg,
                                type: 'error',
                                duration: 5 * 1000
                            })
                          }

                        });
                    }
                })
            },
            // 确认删除
            affirmDelete(e) {
                bannerDel({ banner_id: this.activeBanner.id }).then(e => {
                    this.initiData()
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
                this.requestData.img = res.res.image
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg'
                const isLt2M = file.size / 1024 / 1024 < 2

            },
            // 图片放大
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url
                this.dialogVisible = true
            },
            // 分页
            handleFilter: function(e) {
                this.pageSize = e.limit
                this.initiData()
            }
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
