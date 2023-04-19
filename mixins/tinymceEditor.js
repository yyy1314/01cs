import { getToken } from '@/utils/auth';
import request from '@/utils/request';
export default {
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
         plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern emoticons autosave autoresize',
         toolbar: 'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
         styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
         table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | lineheight',
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
  }
}
