<template>
  <div class="merchantsDetails">
    <div class="list">
      <div class="listTitle">资讯名称：</div>
      <div class="listText">{{ informationDetails.title }}</div>
    </div>
    <div class="list">
      <div class="listTitle">来源：</div>
      <div class="listText">{{ informationDetails.source }}</div>
    </div>
    <div class="list">
      <div class="listTitle">浏览量：</div>
      <div class="listText">{{ informationDetails.pv }}</div>
    </div>
    <div class="list">
      <div class="listTitle">是否推荐：</div>
      <div class="listText">{{ informationDetails.hot==1?"推荐":"正常" }}</div>
    </div>
    <!-- <div class="list">
      <div class="listTitle">点赞数量：</div>
      <div class="listText">{{ informationDetails.like_num }}</div>
    </div> -->

    <div class="list">
      <div class="listTitle">图片上传：</div>
      <div class="listText publicityPicture">

        <el-popover placement="right" title="" trigger="hover">
          <img :src="informationDetails.cover" style="max-width: 500px;max-height:500px">
          <img slot="reference" :src="informationDetails.cover" alt="" style="height:100px;width:auto;display:block;margin-right:20px">
        </el-popover>

      </div>
    </div>
    <div class="list">
      <div class="listTitle">活动介绍：</div>
      <div class="listText" >
        <div class="richText" v-html="informationDetails.content"/>
      </div>
    </div>
    <el-button class="filter-item" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>

  </div>
</template>

<script>
import { informationDetails } from '@/api/information'
export default {
  name: 'Publish',
  data() {
    return {
      informationDetails: {}
    }
  },
  mounted() {
    console.log(this.$route.query.id)
    // 获取顶大详情
    informationDetails({ information_id: this.$route.query.information_id }).then(e => {
      this.informationDetails = e.res
      console.log(this.informationDetails)
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
