<template>
  <div class="publish">
    <el-form
      ref="requestData"
      :model="requestData"
      :rules="rules"
      status-icon
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="primeArea">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="requestData.name" type="text" />
        </el-form-item>
        <el-form-item label="商品分类" prop="type">
          <el-select v-model="requestData.type" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in classification"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <div style="display:flex">
            <el-input v-model="requestData.price" type="Number" />
          </div>
        </el-form-item>
        <el-form-item label="会员价格" prop="price">
          <div style="display:flex">
            <el-input v-model="requestData.vipPrice" type="Number" />
          </div>
        </el-form-item>

        <el-form-item label="库存" prop="stock">
          <div style="display:flex">
            <el-input v-model="requestData.stock" type="Number" />
          </div>
        </el-form-item>
      </div>

      <el-form-item label="商品图片" prop="image">
        <Upload-img-more
          :values.sync="image"
          :img-width="150"
          :img-height="150"
          :auto-crop-width="532"
          :auto-crop-height="400"
        />
      </el-form-item>

      <div class="quillEditorBox" style="display:flex">
        <div class="title" prop="intro">商品详情</div>
        <div class="quillEditor">
          <editor
            :apiKey="tinymceApiKey"
            :init="initTinymceEditor"
            v-model="requestData.intro"
          />
        </div>
      </div>

      <el-form-item>
        <el-button type="primary" @click="submitForm('requestData')">保存</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt >
    </el-dialog>
  </div>
</template>

<script>
import UploadImgMore from '@/components/UploadImg/More'
import { Message } from 'element-ui'
import { timeConversion } from '@/utils/filters.js'
import { getToken } from '@/utils/auth'
import { goodsCategory, goodsCreate, goodsDetails } from '@/api/goods';
import tinymceEditor from '@/mixins/tinymceEditor.js';
import Editor from '@tinymce/tinymce-vue';

export default {
  mixins:[tinymceEditor],
  components: { Editor, UploadImgMore },
  data() {
    return {
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      dialogImageUrl: '',
      dialogVisible: false,
      image: [],
      requestData: {
        name: '',
        stock: '',
        price: '',
        image: [],
        type: '',
        intro: '',
        vipPrice:''
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '商品名称为必填' }],
        price: [{ required: true, trigger: 'change', message: '商品价格必填' }],
        type: [
          { required: true, trigger: 'change', message: '请选择商品分类' }
        ],
        stock: [{ required: true, trigger: 'change', message: '商品库存必填' }],
        intro: [{ required: true, trigger: 'change', message: '商品详情必填' }],
        image: [
          { required: true, trigger: 'change', message: '请至少上传一张图片' }
        ]
      },
      classification: [],
      editId: '',
      editDetails: {},

    }
  },
  computed: {
    uploadUrl() {
      return this.$store.state.uploadUrl

    }
  },
  mounted() {
    // 获取商品分类列表
    goodsCategory({}).then(response => {
      console.log(response)
      this.classification = response.res
    })
    // 获取商品详情
    if (this.$route.query.editId) {
      goodsDetails({ goods_id: this.$route.query.editId }).then(
        e => {
          this.editId = this.$route.query.editId
          this.editDetails = e.res
          this.requestData.name = this.editDetails.name
          this.requestData.type = this.editDetails.type
          this.requestData.price = this.editDetails.price
          this.requestData.stock = this.editDetails.stock
          this.requestData.intro = this.editDetails.intro
          this.requestData.vipPrice = this.editDetails.vip_price

          this.requestData.image = this.editDetails.img.map(e => {
            return { url: e }
          })
          this.image = this.editDetails.img.map((e, i) => {
            return { url: e, value: i + 1 }
          })
        },
        err => {
          console.log(err)
        }
      )
      this.$route.meta.title = '编辑活动'
    }
  },
  methods: {
    // 发布活动
    submitForm(formName) {
      const that = this
      this.requestData.image = this.image
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          // 发送请求
          const requestData = {
            name: this.requestData.name,
            price: this.requestData.price,
            stock: this.requestData.stock,
            image: this.image.map(e => e.url),
            intro: this.requestData.intro,
            type: this.requestData.type,
            vip_price:this.requestData.vipPrice
          }
          if (this.editId) {
            requestData.goods_id = this.editId
          }
          goodsCreate(requestData).then(response => {
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
      this.requestData.image = this.requestData.image.filter(
        e => e.url !== file.url
      )
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
      console.log('我执行了')
      console.log(e)
      this.requestData.image.push({ url: e.res.image })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.primeArea {
  width: 500px;
  .middleLine {
    text-align: center;
  }
}
.selectList {
  padding-bottom: 16px;
  .typeName {
    padding-right: 20px;
    min-width: 80px;
    display: inline-block;
    text-align-last: justify;
  }
  .typeMoney {
    padding-left: 20px;
    width: 170px;
  }
}
.quillEditorBox {
  display: flex;
  margin-bottom: 50px;
  .title {
    width: 100px;
    padding-right: 12px;
    text-align: right;
    font-size: 14px;
    color: #606266;
    font-weight: 700;
    line-height: 40px;
  }
  .quillEditor {
    flex: 1;
  }
}
</style>
