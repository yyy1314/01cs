<template>
  <div>
    <!-- 图片上传组件辅助-->
    <el-upload
       multiple
      :action="uploadUrl"
      :headers="headers"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
      class="editor-uploader"
      name="file"
      style="height:0"/>

    <!-- 视频上传 -->

    <el-dialog
      :visible.sync="videoFlag"
      :close-on-click-modal="false"
      title="视频上传进度"
      width="184px"
      center
    >
      <el-progress v-if="videoFlag == true" :percentage="videoUploadPercent" type="circle" />

    </el-dialog>

    <div style="0">
      <el-upload
        :action="uploadUrl"
        :show-file-list="false"
        :headers="headers"
        :on-success="handleVideoSuccess"
        :before-upload="beforeUploadVideo"
        :on-progress="uploadVideoProcess"
        class="avatar-uploader el-upload--text editor-uploader-video"
      />
    </div>

    <quill-editor
      ref="myQuillEditor"
      v-model="content"
      :options="editorOption"
      class="editor"
      @ready="onEditorReady($event)"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"/>
  </div>
</template>
<script>
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  ['blockquote', 'code-block'], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  // [{'direction': 'rtl'}],                         // 文本方向
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ['clean'], // 清除文本格式
  ['link', 'image', 'video'] // 链接、图片、视频
]
import { getToken } from '@/utils/auth'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {

  components: {
    quillEditor
  },
  props: {
    /* 编辑器的内容*/
    value: {
      type: String,
      default: '1' // kb
    },
    /* 图片大小*/
    maxSize: {
      type: Number,
      default: 4000 // kb
    }
  },

  data() {
    return {
      videoUploadPercent: 0,
      videoFlag: false,
      videoForm: {
        Video: ''
      },
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      content: this.value,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        theme: 'snow', // or 'bubble'
        placeholder: '请输入你要写的内容...',
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.editor-uploader input').click()
                  console.log(value)
                } else {
                  this.quill.format('image', false)
                }
              },
              video: function(value) {
                document.querySelector('.editor-uploader-video input').click()
                // console.log(value)
              }
            }
          }
        }
      }
    }
  },
  computed: {
    uploadUrl() {
      return "https://api.ctdu.com.cn/api/admin/putFile"
    }
  },
  watch: {
    value: function(e, o) {
      this.content = this.value
    }
  },
  mounted() {
  },

  methods: {
    onEditorReady(e) {
    },
    handleVideoSuccess(res, file) {
      const quill = this.$refs.myQuillEditor.quill
      if (res.code == 200) {
        this.videoFlag = false
        this.videoUploadPercent = 100
        const length = quill.getSelection().index
        quill.insertEmbed(length, 'video', res.res.image)
        console.log(res)
        quill.setSelection(length + 1)
      } else {
        this.$message.error('视频插入失败')
      }
      this.quillUpdateImg = false
    },
    beforeUploadVideo(e) {
      console.log(e)
    },
    // 视频上传中
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = Number(file.percentage.toFixed(0))
    },
    onEditorBlur() {
      // 失去焦点事件
    },
    onEditorFocus() {
      // 获得焦点事件
    },
    onEditorChange() {
      // 内容改变事件
      this.$emit('input', this.content)
    },

    // 富文本图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true
    },

    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      const quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.code == 200) {
        // 获取光标所在位置
        const length = quill.getSelection().index
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.res.image)
        console.log(res)
        // 调整光标到最后
        quill.setSelection(length + 1)
        console.log('图片上传成功')
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    }
  }
}
</script>

<style>
.editor {
  line-height: normal !important;
  height: 360px;
}
.ql-snow .ql-tooltip[data-mode=link]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
  content: '等宽字体';
}
</style>
