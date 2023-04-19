<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="'图片上传'"
      :close-on-click-modal="false"
      :center="true"
      style="width: 100%;min-width:900px"
      top="50px"
      width="50%"
      append-to-body
    >
      <div style=" position: relative;">
        <div class="cropper">
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox"
            :high="option.high"
            :output-size="(option.size/100)"
            :fixed="fixed"
            :active-index="activeIndex"
            @realTime="realTime"
          />
        </div>
        <div class="tool">
          <el-row>
            <div :style="previewStyle2" class="show-preview ssss">
              <div :style="previews.div">
                <img data-id="1" :src="previews.url" :style="previews.img">
              </div>
            </div>
          </el-row>

          <el-row>
            <div style="margin: 25px 15px;">
              <span>裁剪后质量：{{ option.size }}%</span>
              {{option.autoCropWidth}}   {{option.autoCropHeight}}
              <el-slider v-model="option.size" :min="0" :max="100" input-size="small"/>
            </div>
          </el-row>

          <el-row style="margin:0  15px;">
            <el-button-group >
              <el-button
                type="primary"
                round
                style="width:50%"
                @click="finish('base64')"
              >
                <span>裁剪并上传</span>
              </el-button>
              <el-button
                type="primary"
                round
                style="width:50%"
                @click="uploadOriginal()"
              >
                <span>原图上传</span>
              </el-button>
            </el-button-group>
          </el-row>
        </div>
      </div>
    </el-dialog>

    <div class="avatar-uploader single-img" @click="selectFile(value)">
      <img :style="`width:${autoCropWidth}px;height:${autoCropHeight}px`" v-if="sonImgUrl" :src="sonImgUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"/>
    </div>

    <input
      :id="id"
      type="file"
      style="position:absolute; clip:rect(0 0 0 0);"
      accept="image/png, image/jpeg, image/gif, image/jpg"
      @change="uploadImg($event, 1)"
    >
  </div>
</template>

<script>
import VueCropper from '@/components/VueCropper/vue-cropper'
import { putFile } from '@/api/Upload'
export default {
  name: 'UploadImgDialog',
  components: { VueCropper },
  props: {
    autoCropWidth: { type: [Number, String], default: 100 },
    autoCropHeight: { type: [Number, String], default: 100 },
    afterSuccess: { type: Function, default: () => {} },
    url: { type: String, default: null },
    imgUrl: { type: String, default: null },
    value: { type: [String, Number], default: null },
    buttontext: { type: String, default: '选择图片' },
    hidden: { type: Boolean, default: false },
    index: { type: Number, default: 0 }
  },
  data() {
    return {
      img: '',
      id: null,
      dialogVisible: false,
      cAutoCropHeight: this.cAutoCropHeight,
      cAutoCropWidth: this.cAutoCropWidth,
      fixed: true,
      previews: {},
      previewStyle2: {},
      option: {
        img: this.url,
        size: 50,
        full: false,
        outputType: 'jpeg',
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: this.autoCropWidth,
        autoCropHeight: this.autoCropHeight,
        centerBox: false,
        high: true,
        example2: null
      },
      activeIndex: 0
    }
  },
  computed: {
    curl: {
      get() {
        return this.url
      },
      set(val) {
        this.$emit('update:url', val)
      }
    },
    cvalue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    },
    sonImgUrl() {
      return this.imgUrl
    }
  },
  watch: {
    url(val) {
      this.option.url = val
    }
  },
  created() {
    var t = this
    t.id = t.guid()
  },

  methods: {
    // 实时预览函数
    realTime(data) {
      var previews = data
      if (previews.w > previews.h) {
        this.previewStyle2 = {
          width: previews.w + 'px',
          height: previews.h + 'px',
          overflow: 'hidden',
          marginTop: 10 / (240 / previews.w) + 'px',
          zoom: 240 / previews.w
        }
      } else {
        this.previewStyle2 = {
          width: previews.w + 'px',
          height: previews.h + 'px',
          overflow: 'hidden',
          marginTop: 10 / (240 / previews.h) + 'px',
          zoom: 240 / previews.h
        }
      }
      this.cAutoCropWidth = previews.w
      this.cAutoCropHeight = previews.h
      this.previews = data
    },

    upload(base64) {
      console.log(this.activeIndex)
      console.log(1111111)
      var that = this
      putFile({ base64 }).then(response => {
        this.$emit('afterSuccess', response.res.image, this.activeIndex)
        that.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
          duration: 2000
        })
        that.dialogVisible = false
      })
    },
    uploadOriginal() {
      var t = this
      console.log(1)
      var fileSize = t.option.img.length - (t.option.img.length / 8) * 2
      if (fileSize / 1024 > 1025) {
        var image = new Image()
        image.src = t.option.img
        image.onload = function() {
          var canvas = document.createElement('canvas')
          var cxt = canvas.getContext('2d')
          canvas.width = image.width
          canvas.height = image.height * (canvas.width / image.width)
          cxt.drawImage(image, 0, 0)
          var base64 = canvas.toDataURL('image/jpg', 0.5)
          t.upload(base64)
        }
      } else {
        t.upload(t.option.img)
      }
    },
    uploadImg(e, num) {
      console.log(1)
      const t = this
      var file = e.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      var reader = new FileReader()
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        if (num === 1) {
          this.option.img = data
        } else if (num === 2) {
          this.example2.img = data
        }
        t.dialogVisible = true
      }
      reader.readAsDataURL(file)
    },
    finish(type) {
      var files = document.getElementById(this.id).files
      if (files.length == 0) return
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          this.upload(data)
        })
      } else {
        this.$refs.cropper.getCropData(data => {
          this.upload(data)
        })
      }
    },
    selectFile(e) {
      console.log(e)
      this.activeIndex = e
      document.getElementById(this.id).click()
    },
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }
      return (
        S4() +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        S4() +
        S4()
      )
    }
  }
}
</script>
<style scoped>
.button_hidden {
  display: none;
}
.tool {
  width: 260px;
  position: absolute;
  top: 0;
  right: 0;
  text-align: center;
}
.cropper {
  height: 400px;
  width: 100%;
  width: -webkit-calc(100% - 270px);
  width: -moz-calc(100% - 270px);
  width: calc(100% - 270px);
}
.ssss {
  display: inline-block;
  margin-top: 25px;
}
</style>
<style>
.el-dialog__body,
.el-dialog--center .el-dialog__body {
  padding: 0px 10px 20px 20px;
}
</style>
