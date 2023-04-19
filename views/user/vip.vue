<template>
    <div class="login-container">
        <el-form :inline="true">
            <el-form-item style="float:right">
                <el-button class="filter-item" type="primary" @click="addCategory()">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table
                v-loading="listLoading"
                :data="VipList"
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
            <el-table-column align="center" label="名称">
                <template slot-scope="scope">{{ scope.row.describe }}</template>
            </el-table-column>
            <el-table-column align="center" label="说明">
                <template slot-scope="scope">{{ scope.row.explain }}</template>
            </el-table-column>
            <el-table-column align="center" label="id">
                <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editCategory(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹窗新增 编辑-->
        <el-dialog
                :visible.sync="dialogAdd"
                :close-on-click-modal="false"
                :title="editId?'编辑等级':'新增等级'"
                width="600px"
                center
        >
            <el-form ref="requestData" :rules="rules" :model="requestData" label-width="80px">
                <el-form-item label="等级名称" prop="describe">
                    <el-input v-model="requestData.describe" type="text" placeholder="请输入分类名称"/>
                </el-form-item>
                <el-form-item label="等级说明" prop="explain">
                    <el-input v-model="requestData.explain" type="textarea" rows="5" placeholder="等级说明"/>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAdd = false">取 消</el-button>
                <el-button type="primary" @click="saveCategory('requestData')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import {Message} from 'element-ui'

    import {getVipList, vipCreate} from '@/api/vip'

    export default {
        name: 'UserCenter',
        components: {Pagination},
        data() {
            return {
                dialogAdd: false,
                listLoading: true,
                categoryList: [],
                dialogTitle: '新增分类',
                requestData: {
                    describe: '',
                    explain: ''
                },
                rules: {
                    describe: [
                        {required: true, trigger: 'blur', message: '等级名称为必填'}
                    ],
                    explain: [
                        {required: true, trigger: 'blur', message: '等级说明为必填'}
                    ]
                },
                editId: '',
                dialogDelete: false,
                activeCategroy: {},
                VipList: []
            }
        },
        created() {
            this.initiData()
        },
        methods: {
            // 初始化数据
            initiData() {
                getVipList().then(e => {
                    this.listLoading = false
                    this.VipList = e.res
                })
            },
            // 新增
            addCategory() {
                this.dialogAdd = true
                this.editId = null
                this.requestData.describe = undefined
                this.requestData.explain = undefined
            },
            // 编辑
            editCategory(e) {
                this.dialogAdd = true
                this.editId = e.id
                this.requestData.describe = e.describe
                this.requestData.explain = e.explain
            },
            // 确认保存
            saveCategory(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const requestData = this.requestData
                        if (this.editId) {
                            requestData.vip_id = this.editId
                        }
                        vipCreate(requestData).then(e => {
                            this.initiData()
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
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .applyInstructions {
        padding: 0 0 20px 0;

        .title {
            font-size: 20px;
            line-height: 50px;
        }
    ;

        .text {
            font-size: 14px;
            line-height: 18px;
        }
    }

    ;
    .buttonWrap {
        text-align: center;
        padding: 20px 0 0 0;
    }
</style>
