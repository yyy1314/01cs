<template>
    <div class="login-container">
        <el-form :inline="true" >
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
            <el-table-column align="center" label="名称" >
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
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="requestData.name" type="text" placeholder="请输入分类名称"/>
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
            <span>请您确认：是否删除  《 {{ activeCategroy.name }} 》  行业分类</span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="affirmDelete()">确 定</el-button>
      </span>
        </el-dialog>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'
    import { Message } from 'element-ui'

    import { industry, industryCreate, industryDel } from '@/api/industry'

    export default {
        name: 'UserCenter',
        components: { Pagination },
        data() {
            return {
                dialogAdd: false,
                listLoading: true,
                categoryList: [],
                dialogTitle: '新增分类',
                requestData: {
                    name: '',
                },
                rules: {
                    name: [
                        { required: true, trigger: 'blur', message: '分类名称为必填' }
                    ],
                },
                editId: '',
                dialogDelete: false,
                activeCategroy: {}
            }
        },
        created() {
            this.initiData()
        },
        methods: {
            // 初始化数据
            initiData() {
                industry({
                }).then(
                    response => {
                        this.categoryList = response.res
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
                this.requestData.name = undefined
            },
            // 编辑
            editCategory(e) {
                this.dialogAdd = true
                this.editId = e.id
                this.requestData.name = e.name
            },
            // 删除
            deleteCategory(e) {
                console.log('删除')
                this.dialogDelete = true
                this.activeCategroy = e
            },
            // 确认保存
            saveCategory(formName) {
                const that = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const requestData = this.requestData
                        if (this.editId) {
                            requestData.industry_id = this.editId
                        }
                        industryCreate(requestData).then(e => {
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
            },
            // 确认删除
            affirmDelete(e) {
                industryDel({ industry_id: this.activeCategroy.id }).then(e => {
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
