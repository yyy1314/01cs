
<template>
  <div class="informationPublish">

    <el-form
      ref="requestData"
      :model="requestData"
      :rules="rules"
      status-icon
      label-width="100px"
      class="demo-ruleForm">

      <div class="primeArea">
        <el-form-item label="资讯名称" prop="title">
          <el-input v-model="requestData.title" type="text" />
        </el-form-item>

        <el-form-item label="资讯来源" prop="source">
          <el-input v-model="requestData.source" type="text" />
        </el-form-item>

        <el-form-item label="活动分类" prop="type">
          <el-select v-model="requestData.type" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in classification"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>

      </div>
      <el-form-item label="上传视频">
        <el-upload
          drag
          :action="baseURL + '/upload/video'"
          :headers="headers"
          name="video"
          :on-success="onvideoSuccess"
          :on-remove="onVideoRemove"
          accept="video/*"
          :file-list="videoList"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将视频拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传视频文件，且不超过50M</div>
        </el-upload>
      </el-form-item>




      <el-form-item label="资讯封面" prop="cover">
        <!-- <el-upload
          :show-file-list="false"
          :headers = "headers"
          :action="uploadUrl"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader single-img">

          <img v-if="requestData.cover" :src="requestData.cover" class="avatar">

          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload> -->
        <upload-img
          :img-url.sync="requestData.cover"
          :img-width="300"
          :auto-crop-width="244"
          :auto-crop-height="142"
        />
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" width="100%" alt="">
        </el-dialog>
      </el-form-item>

      <div class="quillEditorBox" style="display:flex">
        <div class="title">资讯介绍</div>
        <div class="quillEditor">
          <tinymce v-model="requestData.content" />
        </div>
      </div>

      <el-form-item>
        <el-button type="primary" @click="submitForm('requestData')">保存</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>

    </el-form>

    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>

  </div>
</template>

<script>
import options from '@/utils/country-level2-data.js';
import { Message } from 'element-ui';
import { informationCreate, informationCategory, informationDetails } from '@/api/information';
import { getToken } from '@/utils/auth';
import UploadImg from '@/components/UploadImg';
import request from '@/utils/request';
import Tinymce from '@/components/TinyMCE.vue';
export default {
  components: {
    UploadImg,Tinymce
  },
  data() {
    return {
      cover: '',
      content: '',
      editorOption: {},
      imageUrl: '',
      options: options, // 存放城市数据
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      dialogImageUrl: '',
      dialogVisible: false,
      requestData: {
        title: '',
        video: null,
        source: '',
        cover: '',
        type: '',
        content: '',
        videoId:null
      },

      videoList:[],
      rules: {
        title: [
          { required: true, trigger: 'blur', message: '活动名称为必填'}
        ],
        type: [
          { required: true, trigger: 'change', message: '请选择资讯分类'}
        ],
        source: [
          { required: true, trigger: 'change', message: '请填写咨询来源'}
        ],
        cover: [
          { required: true, trigger: 'click', message: '请至少上传一张图片'}
        ]
      },
      vipDataList: [],
      classification: [],
      editId: '',
      editDetails: {},
      limitNumber: 2,
      baseURL:request.defaults.baseURL
    }
  },
  computed: {
    uploadUrl() {
      return this.$store.state.uploadUrl
    }
  },
  watch: {
    cover() {
      this.requestData.cover = this.cover
    }
  },
  created() {

    // 获取活动分类列表
    informationCategory({}).then(response => {
      this.classification = response.res.data
      if (this.$route.query.editId) {
        this.editId = this.$route.query.editId
        informationDetails({ information_id: this.$route.query.editId }).then(e => {
          this.requestData.title = e.res.title;
          if(e.res.video){
            this.videoList.push({
              name:e.res.video.name,url:e.res.video.video_url
            });
             this.requestData.videoId = e.res.video.id;
          }
          this.requestData.source = e.res.source;
          this.requestData.type = e.res.type;
          this.cover = e.res.cover;
          this.requestData.cover = e.res.cover;
          this.requestData.content = e.res.content;
          this.$route.meta.title = '编辑资讯';
        })
      }
    })
  },
  methods: {

    //上传视频成功
    onvideoSuccess:function(response, file, fileList){
      this.videoList = [];
      this.requestData.videoId = response.res.id;
      this.videoList.push({
            name:response.res.name,url:response.res.video_url
      });
      console.log(this.videoList);
    },
    onVideoRemove:function(file, fileList){
      this.requestData.videoId = null;
    },
    // 发布资讯
    submitForm(formName) {

      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
          // 发送请求
          const requestData = {
            title: this.requestData.title,
            content: this.requestData.content,
            type: this.requestData.type,
            cover: this.requestData.cover,
            source: this.requestData.source,
            media_file_id:this.requestData.videoId
          }
          if (this.editId) {
            requestData.information_id = this.editId;
          }
          informationCreate(requestData).then(response => {
            console.log(response)
            Message({
              message: `${this.editId ? '编辑' : '发布'}成功`,
              type: 'success',
              duration: 5 * 1000
            })
            setTimeout(e => {
              that.$router.go(-1)
            }, 500)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 预览
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 删除图片
    handleRemove(file, fileList) {
      // console.log(file.response.res.image)
      console.log(file)
      console.log(fileList)
      console.log(this.requestData.image)
      this.requestData.image = this.requestData.image.filter(e => e.url !== file.url)
      console.log(this.requestData.image)
    },
    // 图片放大
    handlePictureCardPreview(file) {
      console.log(123456)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传图片失败
    handleError(e) {
      console.log(e)
    },
    // 上传图片成功
    handleSuccess(e) {
      console.log(e)
      this.requestData.image.push({ url: e.res.image })
    },

    handleAvatarSuccess(res, file) {
      console.log(res)
      console.log(file)
      this.requestData.cover = res.res.image
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

    //   if (!isJPG) {
    //     this.$message.error('上传头像图片只能是 JPG 格式!')
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传头像图片大小不能超过 2MB!')
    //   }
    //   return isJPG && isLt2M
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .primeArea{
        width:500px;
        .middleLine{
            text-align: center;
        }
    };
    .selectList{
        padding-bottom:16px;
        .typeName{
            padding-right:20px;
            min-width: 80px;
            display: inline-block;
            text-align-last:justify
        };
        .typeMoney{
            padding-left:20px;
            width: 170px;
        }
    };
    .quillEditorBox{
        display: flex;
        margin-bottom: 50px;
        .title{
            width: 100px;
            padding-right: 12px;
            text-align: right;
            font-size: 14px;
            color: #606266;
            font-weight: 700;
            line-height: 40px;
        };
        .quillEditor{
            flex:1;

        }
    }

</style>
