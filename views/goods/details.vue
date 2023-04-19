<template>
    <div class="merchantsDetails">
        <div class="list">
            <div class="listTitle">商品名称：</div>
            <div class="listText">{{ goodsDetails.name }}</div>
        </div>
        <div class="list">
            <div class="listTitle">商品价格：</div>
            <div class="listText">{{ goodsDetails.price }}</div>
        </div>
        <div class="list">
            <div class="listTitle">会员价格：</div>
            <div class="listText">{{ goodsDetails.vip_price }}</div>
        </div>
        <div class="list">
            <div class="listTitle">商品分类：</div>
            <div class="listText">{{ goodsDetails.type }}</div>
        </div>
        <div class="list">
            <div class="listTitle">商品库存：</div>
            <div class="listText">{{ goodsDetails.stock }}</div>
        </div>

        <div class="list">
            <div class="listTitle">上下架：</div>
            <div class="listText">{{ goodsDetails.status  == 2 ? '下架' : '上架'}}</div>
        </div>

        <div class="list">
            <div class="listTitle">商品图片：</div>
            <div class="listText publicityPicture">

                <el-popover v-for="obj,index in goodsDetails.img" :key="index" placement="top" title="" trigger="hover">
                    <img :src="obj" style="max-width: 500px;max-height:500px">
                    <img slot="reference" :src="obj" alt="" style="height:100px;width:auto;display:block;margin-right:20px">
                </el-popover>

            </div>
        </div>
        <div class="list">
            <div class="listTitle">活动介绍：</div>
            <div class="listText" >
                <div class="richText" v-html="goodsDetails.intro"/>
            </div>
        </div>
        <el-button class="filter-item" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>

    </div>
</template>

<script>
    import { goodsDetails } from '@/api/goods'
    export default {
        name: 'Publish',
        data() {
            return {
                goodsDetails: {}
            }
        },
        mounted() {
            // 获取商品详情
            goodsDetails({ goods_id: this.$route.query.id }).then(e => {
                this.goodsDetails = e.res
            }, err => {
                console.log(err)
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
