<template>
     <editor ref="editor" :apiKey="tinymceApiKey" :init="initTinymceEditor" @onChange="onChange" @onInit="fillContent" @onShow="fillContent"/>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import { getToken } from '@/utils/auth';
import request from '@/utils/request';
import { informationImport } from '@/api/information';
export default {
  model: {
    prop: 'content',
    event: 'change'
  },
  props: {
    content: String
  },
  components: {Editor},
  data: function () {
    return {
       remoteBaseURL:request.defaults.baseURL,
       tinymceApiKey: "zoxdx26s7q3tk0mtckxopx7y3x7iri6au94d95gl2v6jc83v",
       initTinymceEditor:{
         width:1200,
         min_height:700,
         max_height: 700,
         resize: 'both',
         menubar: false,
         language_url: '/static/tinymce/zh_CN.js',
         images_upload_handler: this.editorImagesUploadHandler,
         language: 'zh_CN',
            font_formats: "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
         plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern emoticons autosave autoresize importArticle',
         toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
         styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
         table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | lineheight | importArticle',
         setup: this.setup,
       },
    }
  },
  methods: {
    editorImagesUploadHandler:function(blobInfo, success, failure, progress){
        var xhr, formData;
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', this.remoteBaseURL + '/upload/image');
        xhr.setRequestHeader('Authorization', 'Bearer ' + getToken());
        xhr.upload.onprogress = function(e){
            progress(e.loaded / e.total * 100);
        }
        xhr.onload = function() {
            var json;
            if (xhr.status == 403) {
                failure('HTTP Error: ' + xhr.status, { remove: true });
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300 ) {
                failure('HTTP Error: ' + xhr.status);
                return;
            }
            json = JSON.parse(xhr.responseText);
            success(json.res.url);
        };
        xhr.onerror = function () {
            failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
        }
        formData = new FormData();
        formData.append('image', blobInfo.blob(), blobInfo.filename());
        xhr.send(formData);
    },
    setup:function(editor){
      editor.editorManager.EditorManager.PluginManager.add('importArticle', (editor, url) =>{
          editor.ui.registry.addButton('importArticle', {
            text: '导入文章',
            onAction:()=>{
              this.openDialog(editor);
            }
          });
          editor.ui.registry.addMenuItem('importArticle', {
            text: '导入文章',
            onAction:()=>{
              this.openDialog(editor);
            }
          });
          return {
            getMetadata: function () {
              return  {
                name: '公众号文章导入',
                url: 'http://exampleplugindocsurl.com'
              };
            }
          };
      });
    },
    fillContent(event,editor){
      setTimeout(()=>{
        editor.setContent(this.content);
      },500);
    },
    openDialog:function(editor) {
      return editor.windowManager.open({
        title: '导入微信公众号文章',
        body: {
          type: 'panel',
          items: [
            {
              type: 'input',
              name: 'article_url',
              label: '文章链接'
            }
          ]
        },
        buttons: [
          {
            type: 'cancel',
            text: '取消'
          },
          {
            type: 'submit',
            text: '确定',
            primary: true
          }
        ],
        onSubmit: function (api,details) {
          let data = api.getData();
          editor.setProgressState(true);
          informationImport({article_url:data.article_url}).then(response=>{
             if(response.code === 200){
              editor.setContent(response.res.html);
              api.close();
             }else{
              this.$message({
                message: response.msg,
                type: 'warning'
              });
             }
             editor.setProgressState(false);
          });

        }
      });
    },
    onChange(event,editor){
      this.$emit('change', event.level.content);
    }
  }
}
</script>

<style>
</style>
