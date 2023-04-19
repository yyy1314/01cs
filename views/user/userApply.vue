<template>
    <div class="login-container">
        <el-form :inline="true" :model="query">
            <el-form-item>
                <el-select v-model="query.status" clearable placeholder="状态">
                    <el-option
                            v-for="item in statusList"
                            :key="item.guid"
                            :label="item.name"
                            :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="query.vip" clearable placeholder="申请等级">
                    <el-option
                            v-for="item in vipList"
                            :key="item.id"
                            :label="item.describe"
                            :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table
                v-loading="listLoading"
                :data="dataList"
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
            <el-table-column align="center" label="头像" >
                <template slot-scope="scope">
                    <img
                            :src="scope.row.users.picture"
                            style="width:40px;margin:0 auto"
                    >
                </template>
            </el-table-column>
            <el-table-column align="center" label="姓名" >
                <template slot-scope="scope">{{ scope.row.users.name }}</template>
            </el-table-column>
            <el-table-column align="center" label="手机" >
                <template slot-scope="scope">{{ scope.row.users.mobile}}</template>
            </el-table-column>
            <el-table-column align="center" label="职位">
                <template slot-scope="scope">{{ scope.row.users.position }}</template>
            </el-table-column>
            <el-table-column align="center" label="公司">
                <template slot-scope="scope">{{ scope.row.users.unit }}</template>
            </el-table-column>
            <el-table-column align="center" label="申请等级">
                <template slot-scope="scope">{{ showVip(scope.row.vip) }}</template>
            </el-table-column>
            <el-table-column align="center" label="当前等级">
                <template slot-scope="scope">{{ showVip(scope.row.users.vip) }}</template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">{{ scope.row.status==1 ? "待审核": scope.row.status == 2 ? "审核通过" : "审核未通过"}}</template>
            </el-table-column>
            <el-table-column align="center" label="注册时间">
                <template slot-scope="scope">{{ scope.row.users.created_at | timeConversion }}</template>
            </el-table-column>
            <el-table-column align="center" label="申请时间">
                <template slot-scope="scope">{{ scope.row.created_at | timeConversion}}</template>
            </el-table-column>
            <el-table-column align="center" label="会员到期时间">
                <template slot-scope="scope">{{ scope.row.indate | timeConversion}}</template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope" v-if="scope.row.status == 1">

                    <el-button type="text" size="small" @click="compileFn(scope.row)">通过</el-button>
                    <el-button type="text" size="small" @click="MemberAuditNoPass(scope.row.id)">不通过</el-button>
                </template>
            </el-table-column>

        </el-table>
        <pagination
                :total="total"
                :page.sync="pageIndex"
                :limit.sync="pageSize"
                @pagination="handleFilter"
        />
        <userCompile v-if="compileShow" :id="activeUserId" @close="userCompileClose"></userCompile>


        <!-- 弹窗通过-->
<!--        <el-dialog
                :visible.sync="dialogSavePass"
                :close-on-click-modal="false"
                :title="dialogTitle"
                width="600px"
                center
        >
            <el-form ref="requestData" :rules="rules" :model="requestData" label-width="80px">
                <el-form-item label="申请等级" required>
                    <el-select v-model="requestData.vip" clearable placeholder="申请等级">
                        <el-option
                                v-for="item in vipList"
                                :key="item.id"
                                :label="item.describe"
                                :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="到期时间" required >
                    <el-col :span="24">
                        <el-form-item prop="indate" >
                            <el-date-picker
                                    v-model="requestData.indate"
                                    :picker-options="startDatePicker"
                                    :clearable="false"
                                    format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="选择日期"
                                    style="width: 100%;"
                            />
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-form >

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogSavePass = false">取 消</el-button>
                <el-button type="primary" @click="savePass('requestData')" >确 定</el-button>
            </div>
        </el-dialog> -->

        <!-- 弹窗不通过-->
        <el-dialog
                :visible.sync="dialogSaveNoPass"
                :close-on-click-modal="false"
                :title="dialogTitle"
                width="600px"
                center
        >
            <el-form ref="requestData" :rules="rules" :model="requestData" label-width="">
                <el-form-item label="不通过原因" prop="explain">
                    <el-input v-model="requestData.explain" type="textarea" rows="5" placeholder="不通过原因"/>
                </el-form-item>
            </el-form >

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogSaveNoPass = false">取 消</el-button>
                <el-button type="primary" @click="saveNoPass('requestData')" >确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getVipList, getVipApplyList, vipApplyAuditPass, vipApplyAuditNoPass} from '@/api/vip';
    import Pagination from '@/components/Pagination';
    import userCompile from '@/components/userCenter/userCompile.vue';
    export default {
        name: 'userApply',
        components: { Pagination , userCompile },
        data() {
            return {
                startDatePicker: this.beginDate(),
                total: 0,
                pageIndex: 1,
                pageSize: 10,
                query: {
                    pageIndex: 1,
                    pageSize: 10,
                    platformType: this.platformType,
                    name: null,
                    scope: null
                },
                statusList: [
                        {
                            name: '全部',
                            id: null
                        },
                        {
                            name: '待审核',
                            id: 1
                        },
                        {
                            name: '审核通过',
                            id: 2
                        },
                        {
                            name: '审核未通过',
                            id: 3
                        },
                    ],
                requestData: {
                    indate: '',
                    vip: ''
                },
                rules: {
                    vip: [
                        { required: true, trigger: 'blur', message: '申请等级必选' }
                    ],
                    indate: [
                        { required: true, trigger: 'blur', message: '到期时间必选' }
                    ]
                },
                dialogSaveNoPass:false,
                dialogSavePass:false,
                editId:0,
                listLoading: true,
                dialogTitle: '会员审核',
                dialogEditVisible: false,
                dataList: [],
                vipList: [],
                compileShow: false,
                activeUserId: null,
            }
        },
        created() {
            this.InitData();
            getVipList().then(e => {
                console.log(e)
                this.vipList = [...[{ id: null, describe: '全部' }], ...e.res]
                this.requestData.vip = e.res
            })
        },
        methods: {
            InitData() {
                this.listLoading = true
                getVipApplyList(
                    {
                        per_page: this.pageSize,
                        page: this.pageIndex,
                        name: this.query.name,
                        vip: this.query.vip,
                        status: this.query.status
                    }).then(e => {
                    this.dataList = e.res.data
                    this.pageSize = Number(e.res.per_page)
                    this.pageIndex = e.res.current_page
                    this.total = e.res.total
                    this.listLoading = false;
                })
            },
            handleSearch: function() {
                this.InitData()
            },
            handleFilter: function(e) {
                this.pageSize = Number(e.limit)
                this.InitData()
            },
            MemberAuditPass: function(e) {
                console.log(e);
                this.dialogSavePass = true
                this.editId = e
            },
            MemberAuditNoPass:function(e){
                this.dialogSaveNoPass = true
                this.editId = e
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
            // 最小时间
            beginDate() {
                return {
                    disabledDate(time) {
                        return time.getTime() <= Date.now() - 8.64e7
                    }
                }
            },
            savePass:function(data) {
                this.$refs[data].validate((valid=>{
                    if(valid)
                    {
                        if (this.editId) {
                            this.requestData.vip_apply_id = this.editId
                        }
                        vipApplyAuditPass(this.requestData).then(e=>{
                            this.dialogSavePass = false
                            this.InitData();
                        })
                    }
                }))

            },
            saveNoPass:function (data) {
                this.$refs[data].validate((valid=>{
                    if(valid)
                    {
                        if (this.editId) {
                            this.requestData.vip_apply_id = this.editId
                        }
                        vipApplyAuditNoPass(this.requestData).then(e=>{
                            this.dialogSaveNoPass = false
                            this.InitData();
                        })
                    }
                }))
            },
            compileFn(row) {
              this.editId = row.id;
              this.activeUserId = row.user_id;
              this.compileShow = true;
            },
            userCompileClose(memberUnit) {
              this.compileShow = false;
              if(memberUnit){
                vipApplyAuditPass({
                  vip_apply_id : this.editId
                }).then(e=>{
                    this.InitData();
                })
              }
              this.InitData();
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
