<template>
  <el-dialog :title="scene == 'enterprise' ? '导入企业' : '导入政府' " :visible.sync="importShow" :close-on-click-modal="false" width="40%" top="20px" @close="close()">
    <div class="p-1 d-flex flex-wrap a-center j-sb">
      <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <el-upload
              ref="upload"
              drag
              :multiple="false"
              :limit="1"
              :action="baseURL + importUri"
              :headers="uploadHeaders"
              name="file"
              :on-remove="onRemove"
              :on-success="importPreview"
              :file-list="excelList"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传xlsx文件&nbsp;<a target="_blank" :href="baseURL.replace('/api/admin','') + '/storage/import_template/' + excelTemplate">excel模板下载</a></div>
            </el-upload>
          </div>
      </div>
      <div class="p-1" style="width: 48%;">
        <div class="d-flex flex-column">
          <div class="">导入前数据验证</div>
          <div class="pt-1">
             总数：{{preview.total}}<br/>
             已存在：<span v-for="(item,index) in preview.invalid" :key="index">{{ item }}&nbsp;</span>
          </div>
        </div>
      </div>

    </div>
    <div class="d-flex j-end"><el-button type="success" size="small" @click="doImport">确定</el-button></div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request';
import { getToken } from '@/utils/auth.js';
import { excelImport } from '@/api/enterprise.js';
import { excelImport as excelImportOfG } from '@/api/enterprisepublish.js';

export default {
  props:{
    scene: {
      type:String,
      default:'enterprise',
    },
  },
  data() {
    return {
      baseURL:request.defaults.baseURL,
      importUri:null,
      importShow:true,
      form:{
        file_path:null,
      },
      excelList: [],
      uploadHeaders: {
        Authorization: 'Bearer ' + getToken()
      },
      preview:{
        total: 0,
        invalid:0,
      },
      excelTemplate:null,
    }
  },
  created() {
    if(this.scene == 'enterprise'){
      this.importUri = '/member_unit_enterprise/import_preview';
      this.excelTemplate = 'member_unit_enterprise.xlsx';
    }else{
      this.importUri = '/member_unit_government/import_preview';
      this.excelTemplate = 'member_unit_government.xlsx';
    }
  },
  methods:{
    onRemove(file, fileList){
      this.form.file_path = null;
      Object.assign(this.preview,{
        total: 0,
        invalid:0,
      });
    },
    importPreview(response, file, fileList){
      if(response.code == 200){
         console.log('importPreview');
         this.form.file_path = response.res.path;
         this.preview = {
           total:response.res.total,
           invalid:response.res.invalid,
         };
      }else{
        this.$message({
           showClose: true,
           message: response.msg
        });
        this.$refs.upload.clearFiles();

      }
    },
    doImport(){
      if(!this.form.file_path){
        this.$message({
           showClose: true,
           message: "请选择有效excel文件"
        });
        return;
      }
      if(this.scene == 'enterprise'){
        excelImport(...this.form).then(res=>{
          this.importRes(res);
        });
      }else{
        excelImportOfG(...this.form).then(res=>{
          this.importRes(res);
        });
      }
    },
    importRes(res){
      if(res.code == 200){
         this.$message({
            showClose: true,
            message: '导入成功',
            type: 'success'
         });
         this.close();
      }else{
         this.$message({
            showClose: true,
            message: res.msg
         });
      }
    },
    close(){
      this.$emit("importClose");
    }
  }
}
</script>

<style>
</style>
