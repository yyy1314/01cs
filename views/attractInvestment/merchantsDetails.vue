<template>
  <div class="merchantsDetails">
    <div class="list">
      <div class="listTitle">发布标题：</div>
      <div class="listText">儋州市兰洋温泉特色小镇项目招商</div>
    </div>
    <div class="list">
      <div class="listTitle">发布 类别：</div>
      <div class="listText">招商引资</div>
    </div>
    <div class="list">
      <div class="listTitle">截止时间：</div>
      <div class="listText">2019-09-12</div>
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
      <div class="listTitle">所在地：</div>
      <div class="listText">海南省儋州市蓝海镇</div>
    </div>
    <div class="list">
      <div class="listTitle">投资规模：</div>
      <div class="listText">15亿元</div>
    </div>
    <div class="list">
      <div class="listTitle">项目背景：</div>
      <div class="listText">国务院出台《建设海南国际旅游岛若干意见》后，海南面临重大的发展机遇。尤其是海南省委省政府提出加快海南西部地区开发建设以及把儋州建设成为海南西部中心城市的发展战略，给儋州带来巨大的发展空间。兰洋镇作为海南省规划建设的22个风情小镇之一，拥有丰富的旅游资源，以及蓝洋温泉、蓝洋国家森林公园、莲花寺、松涛水库等旅游景点。
      随着蓝洋旅游业的发展，兰洋风情小镇建设将加快步伐，在原有的基础上，进行科学的规划。以风情小镇建设带动兰洋镇经济的发展，吸引更多国内外的游客。</div>
    </div>
    <div class="list">
      <div class="listTitle">建设类容：</div>
      <div class="listText">本项目占地面积600亩，完善水、电、路等基础设施以及商业服务设施。着力把兰洋镇打造成为集旅游、观光、休闲、养生、度假为一体的温泉旅游风情小镇</div>
    </div>
    <div class="list">
      <div class="listTitle">效益分析：</div>
      <div class="listText">根据项目市场信息和行业经济分析，该项目建成后带来极大的经济效益，并可提供几百个就业岗位，很好地解决当地就业问题。</div>
    </div>
    <div class="list">
      <div class="listTitle">合作方式：</div>
      <div class="listText">合资</div>
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
