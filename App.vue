<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
  
  /* 弹窗 上下居中 */
  .el-dialog{
       display: flex;
       flex-direction: column;
       margin:0 !important;
       position:absolute;
       top:50%;
       left:50%;
       transform:translate(-50%,-50%);
       max-height:calc(100% - 30px);
       max-width:calc(100% - 30px);
   }
   .el-dialog .el-dialog__body{
       flex:1;
       overflow: auto;
   }

   /* 单个图片上传 线框 */
    .avatar-uploader,.single-img{
        cursor:pointer;
        .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        };
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        };
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
    }
    @import "./styles/common.css"
</style>
