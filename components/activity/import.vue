<template>
  <el-dialog :visible="visible" :title="detail.name + '报名'"  width="30%" :before-close="handleClose" @open="onOpen">
    <p class="py-1">Excel模板中红色字段为必填字段</p>
    <p class="py-1">已有的报名会自动过滤不会重复导入</p>
    <el-upload
        ref="joinUpload"
        :multiple="false"
        :limit="1"
        class="upload-demo"
        :action="baseURL + '/activityJoinImport' "
        :on-success="onSuccess"
        accept=".xls, .xlsx"
        :data="form"
        :auto-upload="false"
        name="join_file"
        :headers="uploadHeaders"
      >
      <el-button slot="trigger" size="small" type="primary">选取Excel</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submit">确定导入</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传xlsx文件&nbsp;<a class="el-button--text" target="_blank" :href="baseURL.replace('/api/admin','') + '/storage/import_template/activity_join.xlsx' ">excel模板下载</a>
      </div>
    </el-upload>
  </el-dialog>
</template>

<script>
import request from '@/utils/request';
import { getToken } from '@/utils/auth.js';
export default {
  props: {
    visible: {
      type:Boolean,
      default:false,
    },
    detail: {
      type:Object,
      default(){
        return {

        };
      }
    }
  },
  data() {
    return {
      baseURL:request.defaults.baseURL,
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken()
      },
      form: {
        activity_id: null,
      },
    }
  },
  watch: {

  },
  filters: {

  },
  created: function () {

  },
  methods: {
    onOpen(){
      this.form.activity_id = this.detail.id;
    },
    onSuccess(response, file, fileList){
      if(response.code === 200){
        this.$message({
          type: "success",
          message: "导入成功"
        });
        this.$emit('close');
      }else{
        this.$message({
          type: "warning",
          message: response.msg
        });
      }
    },
    handleClose: function (){
      this.$emit('close');
    },
    submit(){
        this.$refs.joinUpload.submit();
    }
  }

}
</script>

<style scoped>
</style>
