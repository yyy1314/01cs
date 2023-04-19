<template>
  <div class="h-100" style="overflow: auto;">
    <div class="p-1">
      <el-upload
        class="upload-demo"
        drag
        :action="baseURL + uploadUri"
        :data="{id:id}"
        :headers="uploadHeaders"
        name="attachment"
        :on-success="successFn"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">支持格式doc,docx,xls,xlsx,ppt,pptx,zip,pdf,rar,jpg,png,jpeg,gif,AVI,mov,rmvb,FLV,mp4,3GP,文件大小不能超过50M</div>
      </el-upload>
    </div>
    <div class="p-1">
      <el-table :data="items" style="width: 100%" max-height="400">
        <el-table-column fixed prop="name" label="文件名"></el-table-column>
        <el-table-column prop="created_at" label="上传时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="jump(scope.row.preview_url)">预览</el-button>
            <el-button type="text" size="small" @click="jump(scope.row.download_url)">下载</el-button>
            <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth.js';
import request from '@/utils/request';
import { deleteAttachment } from '@/api/enterprise.js';
import { deleteAttachment as deleteAttachmentOfG } from '@/api/enterprisepublish.js';

export default {
  props: {
    type: {
      type:String,
      default:'enterprise',
    },
    id: {
      type: Number,
      default: null,
    },
    items: {
      type: Array,
      default: function() {
        return [];
      },
    }
  },
  data() {
    return {
      tableData: [],
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken()
      },
      baseURL:request.defaults.baseURL,
      uploadUri:null,
    };
  },
  created() {

    if(this.type == 'enterprise'){
      this.uploadUri = '/member_unit_enterprise/upload_attachment';
    }else{
      this.uploadUri = '/member_unit_government/upload_attachment';
    }
  },
  methods: {
    downFn(index, rows) {
      rows.splice(index, 1);
    },
    jump(url) {
      window.open(url)
    },
    successFn:function(){
      console.log("id:"+this.id);
      this.$emit("attachmentUploaded");
    },
    onDelete(row){
      if(this.type == 'enterprise'){
         deleteAttachment({
            id:this.id,
            media_file_id:row.id
         }).then(res=>{
            if (res.code == 200) {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
              this.$emit("attachmentUploaded");
            } else {
              this.$message({
                showClose: true,
                message: res.msg
              });
            }
         });
      }else{
         deleteAttachmentOfG({
            id:this.id,
            media_file_id:row.id
         }).then(res=>{
            if (res.code == 200) {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
              this.$emit("attachmentUploaded");
            } else {
              this.$message({
                showClose: true,
                message: res.msg
              });
            }
         });
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
