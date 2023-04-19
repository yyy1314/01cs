<template>
    <div class="login-container">
        <el-form :inline="true" :model="query">
            <el-form-item>
                <el-select v-model="query.status" clearable placeholder="订单状态">
                    <el-option
                            v-for="item in statusListData"
                            :key="item.guid"
                            :label="item.name"
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
                ref="multipleTable"
                :data="dataList"
                tooltip-effect="dark"
                element-loading-text="Loading"
                border
                fit
                @selection-change="handleSelectionChange"
        >
            <el-table-column
                    type="index"
                    align="center"
                    label="序号"
                    width="60"/>
            <el-table-column align="center" label="商品图片" >
                <template slot-scope="scope">

                    <div class="commodityDetails" width="180">
                        <div class="left">
                            <el-popover placement="right" title="" trigger="hover">
                                <img :src="scope.row.goods.img" style="max-width: 500px;max-height: 500px;border:2px solid #eee">
                                <img slot="reference" :src="scope.row.goods.img" alt="" style="height:60px;margin:0 auto">
                            </el-popover>
                        </div>
                    </div>

                </template>
            </el-table-column>
            <el-table-column align="center" label="商品名称" >
                <template slot-scope="scope">{{ scope.row.goods.name }}</template>
            </el-table-column>

            <el-table-column align="center" label="订单价格" >
                <template slot-scope="scope">{{ scope.row.amount }}</template>
            </el-table-column>


            <el-table-column align="center" label="支付时间">
                <template slot-scope="scope">{{ scope.row.pay_at | timeConversion }}</template>
            </el-table-column>

            <el-table-column align="center" label="订单状态">
                <template slot-scope="scope">{{ showStatus(scope.row.status) }} </template>
            </el-table-column>

            <el-table-column align="center" label="下单时间">
                <template slot-scope="scope">{{ scope.row.created_at | timeConversion }}</template>
            </el-table-column>

            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="viewProject(scope.row)">详情</el-button>
                    <el-button v-if="scope.row.status == 2" type="text" size="small" @click="showDialogHot(scope.row)">发货</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
                :total="total"
                :page.sync="pageIndex"
                :limit.sync="pageSize"
                @pagination="handleFilter"
        />
        <!-- 发货 -->
        <el-dialog
        :visible.sync="dialogSendOut"
        :close-on-click-modal="false"
        title="商品发货"
        width="600px"
        center
        >
            <el-form ref="requestData" :rules="rules" :model="requestData" label-width="">
                <el-form-item label="快递名称" prop="express_name">
                    <el-input v-model="requestData.express_name" type="text" placeholder="请输入快递名称"/>
                </el-form-item>
                <el-form-item label="快递单号" prop="express_no">
                    <el-input v-model="requestData.express_no" type="text" placeholder="请输入快递单号"/>
                </el-form-item>
            </el-form >
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogSendOut = false">取 消</el-button>
                <el-button type="primary" @click="sendOut('requestData')">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'

    import { goodsOrderList, goodsOrderSendOut } from '@/api/goodsOrder'
    import { goodsCategory} from '@/api/goods'
    import { Message } from 'element-ui'

    export default {
        name: 'GoodsOrder',
        components: { Pagination },
        data() {
            return {
                pageIndex: 1,
                pageSize: 10,
                total: 0,
                query: {
                    name: null,
                    type: null,
                    status: null
                },
                requestData: {
                    'express_no':'',//快递单号
                    'express_name':'',//快递名称
                },
                rules: {
                    express_no: [
                        { required: true, trigger: 'blur', message: '快递单号为必填' }
                    ],
                    express_name: [
                        { required: true, trigger: 'blur', message: '快递名称为必填' }
                    ]
                },
                statusListData: [
                    {
                        name: '全部',
                        id: null
                    },
                    {
                        name: '待支付',
                        id: 1
                    },
                    {
                        name: '待发货',
                        id: 2
                    },
                    {
                        name: '待收货',
                        id: 3
                    },
                    {
                        name: '已完成',
                        id: 4
                    },
                    {
                        name: '已取消',
                        id: 5
                    },
                ],
                listLoading: true,
                dataList: [],
                activeGoods: {},
                dialogSendOut: false,
                goodsCategoryData: []
            }
        },
        computed: {
            testUrl() {
                return 111
            }
        },
        mounted() {
            console.log(this.testUrl)
        },
        created() {
            this.InitData()
        },
        methods: {
            InitData() {
                this.listLoading = true
                goodsOrderList(
                    { per_page: this.pageSize,
                        page: this.pageIndex,
                        name: this.query.name,
                        type: this.query.type,
                        status: this.query.status
                    }).then(e => {
                    this.total = e.res.total
                    this.pageIndex = e.res.current_page
                    this.pageSize = Number(e.res.per_page)
                    this.dataList = e.res.data
                    this.listLoading = false
                })
                goodsCategory({}).then(e => {
                    this.goodsCategoryData = [...[{ id: null, name: '全部' }], ...e.res]
                })
            },
            // 搜索
            handleSearch: function() {
                this.pageIndex = 1
                this.InitData()
                console.log(this.query)
            },
            // 分页
            handleFilter: function(e) {
                this.pageSize = e.limit
                this.InitData()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            viewProject(e) {
                this.$router.push({
                    path: '/goodsOrder/details?id=' + e.id
                })
            },
            //  显示发货
            showDialogHot(e) {
                this.activeGoods = e
                this.dialogSendOut = true
            },
            //发货
            sendOut(requestData){
                this.$refs[requestData].validate((valid) => {
                    if (valid) {
                        this.requestData.goods_order_id = this.activeGoods.id
                        goodsOrderSendOut(this.requestData).then(e=>{
                            setTimeout(e => {
                                this.dialogSendOut = false
                                this.InitData()
                            }, 500)
                            Message({
                                message: '操作成功',
                                type: 'success',
                                duration: 5 * 1000
                            })
                        })
                    }
                })
            },
            showType(id) {
                return this.goodsCategoryData.find(e => e.id == id) ? this.goodsCategoryData.find(e => e.id == id).name : '暂无'
            },
            showStatus(status){
                switch (status) {
                    case 1:
                        return '待支付'
                        break;
                    case 2:
                        return '待发货'
                        break;
                    case 3:
                        return '待收货'
                        break;
                    case 4:
                        return '已完成'
                        break;
                    case 5:
                        return '已取消'
                        break;
                    default:
                        return '其他'
                }
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
