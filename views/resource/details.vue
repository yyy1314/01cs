<template>
  <div class="merchantsDetails">
    <div class="list">
      <div class="listTitle">资源标题：</div>
      <div class="listText">{{ resourceDetails.title }}</div>
    </div>
    <div class="list">
      <div class="listTitle">资源类型：</div>
      <div class="listText">{{ showType(resourceDetails.type) }}</div>
    </div>
    <div class="list">
      <div class="listTitle">招商类型：</div>
      <div class="listText">{{ resourceDetails.category==1 ? "企业":'政府' }}</div>
    </div>
    <div class="list">
      <div class="listTitle">截止时间：</div>
      <div class="listText">{{ resourceDetails.deadline | timeConversion }}</div>
    </div>
    <div class="list">
      <div class="listTitle">地址：</div>
      <div class="listText">{{ resourceDetails.location }}</div>
    </div>
    <div class="list">
      <div class="listTitle">规模：</div>
      <div class="listText">{{ resourceDetails.scale }}万</div>
    </div>

    <div class="list">
      <div class="listTitle">背景介绍：</div>
      <div class="listText">{{ resourceDetails.bg_info }}</div>
    </div>

    <div class="list">
      <div class="listTitle">建设内容：</div>
      <div class="listText">{{ resourceDetails.content }}</div>
    </div>

    <div class="list">
      <div class="listTitle">效益分析：</div>
      <div class="listText">{{ resourceDetails.benefit }}</div>
    </div>

    <div class="list">
      <div class="listTitle">合作方式：</div>
      <div class="listText">{{ resourceDetails.cooperation==1?"独资":"合资" }}</div>
    </div>

    <!-- <div class="list">
      <div class="listTitle">活动日期：</div>
      <div class="listText">{{ resourceDetails.start_at | timeConversion("Y-M-D") }}   ~   {{ resourceDetails.end_at | timeConversion("Y-M-D") }}</div>
    </div>
    <div class="list">
      <div class="listTitle">活动举办地址：</div>
      <div class="listText">{{ resourceDetails.location }}</div>
    </div>
    <div class="list">
      <div class="listTitle">已报名人数：</div>
      <div class="listText">{{ resourceDetails.join_num }}</div>
    </div>
    <div class="list">
      <div class="listTitle">可报名人数：</div>
      <div class="listText">{{ resourceDetails.max_join_num }}</div>
    </div>

    <div class="list">
      <div class="listTitle">活动状态：</div>
      <div class="listText">{{ resourceDetails.state_description | activityState_description }}</div>
    </div>

    <div class="list">
      <div class="listTitle">上下架：</div>
      <div class="listText">{{ resourceDetails.status==1?'上架':'下架' }}</div>
    </div> -->
    <!-- <div class="list">
      <div class="listTitle">发布人：</div>
      <div class="listText">中旅联盟</div>
    </div> -->
    <!-- <div class="list">
      <div class="listTitle">咨询电话：</div>
      <div class="listText">{{ resourceDetails.tel }}</div>
    </div>
    <div class="list">
      <div class="listTitle">价格设置：</div>

      <div class="listText">
        <div v-for="obj,index in resourceDetails.pricesData" :key="index" class="listMain">
          <span class="miTitle"> {{ obj.describe }}</span>
          <span class="price">收费￥{{ obj.price }}</span>
        </div>
      </div>

    </div> -->
    <div class="list">
      <div class="listTitle">图片上传：</div>
      <div class="listText publicityPicture">

        <!-- <img
          v-for="obj,index in resourceDetails.activity_imgs"
          :src="obj"
          class="imgList"
        > -->

        <el-popover v-for="obj,index in resourceDetails.imgs" :key="index" placement="top" title="" trigger="hover">
          <img :src="obj" style="max-width: 500px;max-height:500px">
          <img slot="reference" :src="obj" alt="" style="height:100px;width:auto;display:block;margin-right:20px">
        </el-popover>

      </div>
    </div>
    <el-button class="filter-item" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
  </div>
</template>

<script>
import { resourceDetails, resourceCategory } from '@/api/resource'
export default {
  name: 'Publish',
  data() {
    return {
      resourceDetails: {},
      category: []
    }
  },
  mounted() {
    console.log(this.$route.query.id)
    // 获取顶大详情
    resourceDetails({ resource_id: this.$route.query.id }).then(e => {
      this.resourceDetails = e.res
      // this.resourceDetails.pricesDataArray = this.resourceDetails.pricesData.map(e => {
      //   return {
      //     describe: e.describe,
      //     id: e.id,
      //     price: this.resourceDetails.prices[e.id]
      //   }
      // })
      console.log(this.resourceDetails)
      // getVipList({}).then(response => {
      //  this.vipDataList = response.res
      // const pricesArray = this.resourceDetails.prices
      // this.resourceDetails.prices = this.vipDataList.map(e => {
      //   return {
      //     describe: e.describe,
      //     id: e.id,
      //     price: pricesArray[e.id]
      //   }
      // })
      // })
    }, err => {
      console.log(err)
    })
    resourceCategory().then(e => {
      this.category = e.res
    })
  },
  methods: {
    showType(id) {
      console.log(id)
      console.log(this.category)
      return this.category.find(e => e.id == id) ? this.category.find(e => e.id == id).name : '暂无'
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
