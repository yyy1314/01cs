<template>
  <div class="merchantsDetails">
    <div class="list">
      <div class="listTitle">真实姓名：</div>
      <div class="listText">王张三</div>
    </div>
    <div class="list">
      <div class="listTitle">手机号码：</div>
      <div class="listText">15888888888</div>
    </div>
    <div class="list">
      <div class="listTitle">身份证号：</div>
      <div class="listText">421045435413515156135351</div>
    </div>
    <div class="list">
      <div class="listTitle">身份证件照：</div>
      <div class="listText publicityPicture">
        <img
          class="imgList"
          src="@/assets/index.jpg"
        >
        <img
          class="imgList"
          src="@/assets/index3.jpg"
        >
      </div>
    </div>
    <div class="list">
      <div class="listTitle">公司名称：</div>
      <div class="listText">深圳市某某公司</div>
    </div>
    <div class="list">
      <div class="listTitle">组织机构代码：</div>
      <div class="listText">X456D41DASDADA213</div>
    </div>
    <div class="list">
      <div class="listTitle">营业执照：</div>
      <div class="listText publicityPicture">
        <img
          class="imgList"
          src="@/assets/index.jpg"
        >
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
                width:120px;
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
        }
    }
</style>
