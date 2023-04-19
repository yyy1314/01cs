<template>
  <div class="merchantsDetails">
    <div class="list">
      <div class="listTitle">公司名称：</div>
      <div class="listText">海南互生股权投资基金管理有限公司</div>
    </div>
    <div class="list">
      <div class="listTitle">公司地址：</div>
      <div class="listText">海口市滨海大道85号天邑国际大厦8-805</div>
    </div>
    <div class="list">
      <div class="listTitle">法人代表：</div>
      <div class="listText">张建萍</div>
    </div>
    <div class="list">
      <div class="listTitle">注册资本：</div>
      <div class="listText">300万元</div>
    </div>
    <div class="list">
      <div class="listTitle">投资方向：</div>
      <div class="listText">特色小镇、旅游、酒店</div>
    </div>
    <div class="list">
      <div class="listTitle">图片上传：</div>
      <div class="listText publicityPicture">
        <img
          class="imgList"
          src="@/assets/index.jpg"
        >
        <img
          class="imgList"
          src="@/assets/index3.jpg"
        >
        <img
          class="imgList"
          src="@/assets/index2.jpg"
        >
      </div>
    </div>
    <div class="list">
      <div class="listTitle">资本详情：</div>
      <div class="listText">海南互生股权投资基金管理有限公司（以下简称：海南互生公司）成立于2012年，是海南省第一家民营性质的股权投资管理公司。旨在筹集社会资金、优化资</div>
    </div>
    <div class="list">
      <div class="listTitle">发布人：</div>
      <div class="listText issuerWrap">
        <div class="imgWrap">
          <img src="@/assets/index.jpg" >
        </div>
        <div class="rightText">
          <div class="nameWrap">
            <span class="name">今明</span>
            <span class="level">会员</span>
          </div>
          <div class="company">成都XXX旅游有限公司  总经理</div>

        </div>
      </div>
    </div>
    <el-button class="filter-item" icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
  </div>
</template>

<script>
export default {
  name: 'Publish',
  data() {
    return {
    }
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
                width:100px;
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
            }
        }
    }
</style>
