<template>
    <div class="merchantsDetails">
        <div class="list">
            <div class="listTitle">发布活动：</div>
            <div class="listText">{{ activityDetails.name }}</div>
        </div>
        <div class="list">
            <div class="listTitle">报名截止：</div>
            <div class="listText">{{ activityDetails.deadline | timeConversion }}</div>
        </div>
        <div class="list">
            <div class="listTitle">活动日期：</div>
            <div class="listText">{{ activityDetails.start_at | timeConversion("Y-M-D") }}   ~   {{ activityDetails.end_at | timeConversion("Y-M-D") }}</div>
        </div>
        <div class="list">
            <div class="listTitle">活动举办地址：</div>
            <div class="listText">{{ activityDetails.location }} {{ activityDetails.address }}</div>
        </div>
        <div class="list">
            <div class="listTitle">已报名人数：</div>
            <div class="listText">{{ activityDetails.join_num }}</div>
        </div>
        <div class="list">
            <div class="listTitle">可报名人数：</div>
            <div class="listText">{{ activityDetails.max_join_num }}</div>
        </div>

        <div class="list">
            <div class="listTitle">活动状态：</div>
            <div class="listText">{{ activityDetails.state_description | activityState_description }}</div>
        </div>

        <div class="list">
            <div class="listTitle">上下架：</div>
            <div class="listText">{{ activityDetails.status==1?'上架':'下架' }}</div>
        </div>
        <div class="list">
            <div class="listTitle">咨询电话：</div>
            <div class="listText">{{ activityDetails.tel }}</div>
        </div>
        <div class="list">
            <div class="listTitle">价格设置：</div>

            <div class="listText">
                <template>
                    <el-table
                            :data="tableData"
                            style="width: 80%">
                        <el-table-column
                                prop="name"
                                label="套餐名"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="price"
                                label="价格"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="vip_price"
                                label="会员价格"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="explain"
                                label="说明">
                        </el-table-column>
                    </el-table>
                </template>
            </div>

        </div>
        <div class="list">
            <div class="listTitle">图片上传：</div>
            <div class="listText publicityPicture">

                <el-popover v-for="obj,index in activityDetails.activity_imgs" :key="index" placement="top" title="" trigger="hover">
                    <img :src="obj" style="max-width: 500px;max-height:500px">
                    <img slot="reference" :src="obj" alt="" style="height:100px;width:auto;display:block;margin-right:20px">
                </el-popover>

            </div>
        </div>
        <div class="list">
            <div class="listTitle">活动介绍：</div>
            <div class="listText" style="width: 800px !important;flex: none;" v-html="activityDetails.intro"></div>
        </div>
        <el-button class="filter-item" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>

    </div>
</template>

<script>
    import { activityDetails } from '@/api/activity'
    export default {
        name: 'Publish',
        data() {
            return {
                activityDetails: {},
                tableData:[]
            }
        },
        mounted() {
            // 获取顶大详情
            activityDetails({ activity_id: this.$route.query.id }).then(e => {
                this.activityDetails = e.res
                this.tableData = e.res.prices
            }, err => {

            })
        },
        methods: {
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
