<template>
    <div class="merchantsDetails">
        <div class="list">
            <div class="listTitle">订单编号：</div>
            <div class="listText">{{ goodsOrderDetails.out_trade_no }}</div>
        </div>
        <div class="list">
            <div class="listTitle">商品名称：</div>
            <div class="listText">{{ goodsOrderDetails.goods.name }}</div>
        </div>
        <div class="list">
            <div class="listTitle">商品图片：</div>
            <div class="listText publicityPicture">

                <el-popover placement="right" title="" trigger="hover">
                    <img :src="goodsOrderDetails.goods.img" style="max-width: 500px;max-height: 500px;border:2px solid #eee">
                    <img slot="reference" :src="goodsOrderDetails.goods.img" alt="" style="height:60px;margin:0 auto">
                </el-popover>

            </div>
        </div>
        <div class="list">
            <div class="listTitle">购买数量：</div>
            <div class="listText">{{ goodsOrderDetails.num }}</div>
        </div>
        <div class="list">
            <div class="listTitle">订单金额：</div>
            <div class="listText">{{ goodsOrderDetails.amount }}</div>
        </div>
        <div class="list">
            <div class="listTitle">支付时间：</div>
            <div class="listText">{{ goodsOrderDetails.pay_at | timeConversion}}</div>
        </div>
        <div class="list">
            <div class="listTitle">下单时间：</div>
            <div class="listText">{{ goodsOrderDetails.created_at | timeConversion }}</div>
        </div>

        <div class="list">
            <div class="listTitle">订单状态：</div>
            <div class="listText">{{ showStatus(goodsOrderDetails.status) }}</div>
        </div>

        <div class="list">
            <div class="listTitle">收货地址：</div>
            <div class="listText">{{goodsOrderDetails.address.province + goodsOrderDetails.address.city + goodsOrderDetails.address.county + goodsOrderDetails.address.address }}</div>
        </div>

         <div class="list">
            <div class="listTitle">快递名称：</div>
            <div class="listText">{{ goodsOrderDetails.express_name ? goodsOrderDetails.express_name : '暂无'}}</div>
        </div>

        <div class="list">
            <div class="listTitle">快递单号：</div>
            <div class="listText">{{ goodsOrderDetails.express_no ? goodsOrderDetails.express_no : '暂无'}}</div>
        </div>

        <el-button class="filter-item" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>

    </div>
</template>

<script>
    import { goodsOrderDetails } from '@/api/goodsOrder'
    export default {
        name: 'Publish',
        data() {
            return {
                goodsOrderDetails: {}
            }
        },
        mounted() {
            // 获取商品详情
            goodsOrderDetails({ goods_order_id: this.$route.query.id }).then(e => {
                this.goodsOrderDetails = e.res
            }, err => {
                console.log(err)
            })
        },
        methods: {
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

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .merchantsDetails{
        .list{
            display: flex;
            font-size: 14px;
            line-height: 22px;
            padding:10px 0;
            color:#333333;
            .listTitle{
                width:130px;
                text-align: right;
                padding-right: 10px;
            };
            .listText{
                flex:1;
                .richText{
                    padding:20px;
                    border:1px solid #eee;
                    border-radius: 10px;
                }
            };
            .listText.publicityPicture{
                display: flex;
                .imgList{
                    width:60px;
                    margin-right:10px;
                }
            };
            .listText.issuerWrap{
                display: flex;
                .imgWrap{
                    img{
                        width:50px;
                        height:50px;
                        border-radius: 50%;
                    }
                };
                .rightText{
                    padding-left:10px;
                    .nameWrap{
                        padding-bottom:6px;
                    }
                }
            };
            .listText .listMain{
                .miTitle{
                    display: inline-block;
                    width:80px;
                    text-align-last: justify;
                    padding-right: 20px;
                };
                .price{
                    color:#FF3300;
                }
            }
        }
    }
</style>
