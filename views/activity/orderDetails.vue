<template>
    <div class="merchantsDetails">
        <div class="list">
            <div class="listTitle">活动名称：</div>
            <div class="listText">{{ orderDetails.activity.name }}</div>
        </div>
        <div class="list">
            <div class="listTitle">活动封面：</div>
            <div class="listText">
                <el-popover placement="right" title="" trigger="hover">
                    <img :src="orderDetails.activity.activity_imgs" style="max-width: 500px;max-height:500px">
                    <img slot="reference" :src="orderDetails.activity.activity_imgs" alt=""
                         style="height:100px;width:auto;display:block;margin-right:20px">
                </el-popover>
            </div>
        </div>

        <div class="list">
            <div class="listTitle">活动时间：</div>
            <div class="listText">{{ orderDetails.activity.start_at | timeConversion("Y-M-D") }} ~ {{ orderDetails.activity.end_at |
                timeConversion("Y-M-D") }}
            </div>
        </div>

        <div class="list">
            <div class="listTitle">订单号：</div>
            <div class="listText">{{ orderDetails.out_trade_no }}</div>
        </div>
        <div class="list">
            <div class="listTitle">支付方式：</div>
            <div class="listText">微信支付</div>
        </div>
        <div class="list">
            <div class="listTitle">下单时间：</div>
            <div class="listText">{{ orderDetails.created_at | timeConversion }}</div>
        </div>
        <div class="list">
            <div class="listTitle">订单金额：</div>
            <div class="listText">￥{{ orderDetails.amount }}</div>
        </div>
        <div class="list">
            <div class="listTitle">报名人：</div>
            <div class="listText">{{ orderDetails.join_name }}</div>
        </div>
        <!-- <div class="list">
          <div class="listTitle">报名价格：</div>
          <div class="listText">￥2900/人</div>
        </div> -->
        <div class="list">
            <div class="listTitle">联系电话：</div>
            <div class="listText">{{ orderDetails.join_mobile }}</div>
        </div>
        <!-- <div class="list">
          <div class="listTitle">参加人数：</div>
          <div class="listText">{{ orderDetails.join_mobile }}</div>
        </div> -->

        <div class="list">
            <div class="listTitle">备注：</div>
            <div class="listText">{{ orderDetails.remark }}</div>
        </div>
        <el-button class="filter-item" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
    </div>
</template>

<script>

    import {activityJoinDetails} from '@/api/activity'

    export default {
        name: 'Publish',
        data() {
            return {
                orderDetails: {},
                
            }
        },
        mounted() {          
            activityJoinDetails({activity_join_id: this.$route.query.id}).then(e => {
                this.orderDetails = e.res
            })
        },
        methods: {}
    }
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    .merchantsDetails {
        .list {
            display: flex;
            font-size: 14px;
            line-height: 22px;
            padding: 10px 0;
            color: #333333;

            .listTitle {
                width: 100px;
                text-align: right;
                padding-right: 10px;
            }
        ;

            .listText {
                flex: 1;

                img {
                    display: block;
                    height: 100px;
                }
            }
        ;

            .listText.publicityPicture {
                display: flex;

                .imgList {
                    width: 60px;
                    margin-right: 10px;
                }
            }
        ;

            .listText.issuerWrap {
                display: flex;

                .imgWrap {
                    img {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                    }
                }
            ;

                .rightText {
                    padding-left: 10px;

                    .nameWrap {
                        padding-bottom: 6px;
                    }
                }
            }
        ;

            .listText .listMain {
                .miTitle {
                    display: inline-block;
                    width: 80px;
                    text-align-last: justify;
                    padding-right: 20px;
                }
            ;

                .price {
                    color: #FF3300;
                }
            }
        }
    }
</style>
