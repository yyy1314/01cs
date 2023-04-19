<template>
    <div class="login-container">
        <el-form :inline="true" :model="query">
            <el-form-item >
                <el-input
                        v-model="query.name"
                        placeholder="商品名称"
                        style="width: 160px;"
                        class="filter-item"
                />
            </el-form-item>
            <el-form-item>
                <el-select v-model="query.type" clearable placeholder="商品分类">
                    <el-option
                            v-for="item in goodsCategoryData"
                            :key="item.guid"
                            :label="item.name"
                            :value="item.id"
                    />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select v-model="query.status" clearable placeholder="上下架">
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
            <el-form-item style="float:right">
                <el-button class="filter-item" type="primary" @click="publish">发布商品</el-button>
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
                                <img :src="scope.row.img" style="max-width: 500px;max-height: 500px;border:2px solid #eee">
                                <img slot="reference" :src="scope.row.img" alt="" style="height:60px;margin:0 auto">
                            </el-popover>
                        </div>
                    </div>

                </template>
            </el-table-column>
            <el-table-column align="center" label="商品名称" >
                <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>

            <el-table-column align="center" label="商品价格" >
                <template slot-scope="scope">{{ scope.row.price }}</template>
            </el-table-column>

            <el-table-column align="center" label="商品分类">
                <template slot-scope="scope">{{ scope.row.created_at | timeConversion }}</template>
            </el-table-column>

            <el-table-column align="center" label="商品库存">
                <template slot-scope="scope">{{ scope.row.stock }}</template>
            </el-table-column>

            <el-table-column align="center" label="推荐">
                <template slot-scope="scope">
                  <el-switch
                    :value="scope.row.recommend == 1 ? true : false" @change="switchRecommend(scope.row)"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </template>
            </el-table-column>

            <el-table-column align="center" label="上下架">
                <template slot-scope="scope">
                  <el-switch
                    :value="scope.row.status == 1 ? true : false" @change="switchStatus(scope.row)"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </template>
            </el-table-column>

            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">{{ scope.row.created_at | timeConversion }}</template>
            </el-table-column>

            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="viewProject(scope.row)">详情</el-button>
                    <el-button type="text" size="small" @click="showDialogDelete(scope.row)">删除</el-button>
                    <el-button type="text" size="small" @click="editorActivity(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination
                :total="total"
                :page.sync="pageIndex"
                :limit.sync="pageSize"
                @pagination="handleFilter"
        />

        <!-- 删除 -->
        <el-dialog
                :visible.sync="dialogDelete"
                :close-on-click-modal="false"
                title="删除"
                width="600px"
                center
        >
            <span>请您确认：是否删除  《{{ activeGoods.name }}》</span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="changeDelete()">确 定</el-button>
      </span>
        </el-dialog>

    </div>
</template>

<script>
    import Pagination from '@/components/Pagination'

    import { goodsList, goodsDetails, goodsRecommend, goodsUpDown, goodsCreate, goodsDel, goodsCategory} from '@/api/goods'

    export default {
        name: 'Goods',
        components: { Pagination },
        data() {
            return {
                pageIndex: 1,
                pageSize: 10,
                total: 0,
                query: {
                    platformType: this.platformType,
                    name: null,
                    type: null,
                    status: null
                },
                statusListData: [
                    {
                        name: '全部',
                        id: null
                    },
                    {
                        name: '上架',
                        id: 1
                    },
                    {
                        name: '下架',
                        id: 2
                    }
                ],
                listLoading: true,
                dataList: [],
                activeGoods: {},
                dialogHot: false,
                dialogDelete: false,
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
            goodsCategory().then(e => {
                console.log(e)
                this.goodsCategoryData = [...[{ id: null, name: '全部' }], ...e.res]
            })
        },
        methods: {
            InitData() {
                this.listLoading = true
                goodsList(
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
                    path: '/goods/details?id=' + e.id
                })
            },
            publish() {
                this.$router.push({
                    path: '/goods/publish'
                })
            },
 
            switchRecommend: function(row){
                let recommend = row.recommend == 1 ? 0 : 1;
                goodsRecommend({goods_id: row.id,recommend:recommend}).then(e => {
                    if(e.code == 200){
                       row.recommend = recommend;
                    }
                });
            },
            // 上下架--
            switchStatus(row) {
                goodsUpDown({ goods_id: row.id}).then(e => {
                   if(e.code == 200){
                      row.status = row.status == 1 ? 2 : 1;
                   }
                }, err => {
                    console.log(err)
                })
            },
            // 显示删除弹窗
            showDialogDelete(e) {
                this.activeGoods = e
                this.dialogDelete = true
            },
            // 删除资讯
            changeDelete() {
                const that = this
                goodsDel({ goods_id: this.activeGoods.id }).then(e => {
                    setTimeout(e => {
                        this.dialogDelete = false
                        that.InitData()
                    }, 500)
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                }, err => {
                    console.log(err)
                })
            },
            // 编辑
            editorActivity(e) {
                this.$router.push({
                    path: `/goods/publish?editId=${e.id}`
                })
            },
            showType(id) {
                console.log(id)
                console.log(this.goodsCategoryData)
                return this.goodsCategoryData.find(e => e.id == id) ? this.goodsCategoryData.find(e => e.id == id).name : '暂无'
            },
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
