
<template>
  <div class="publish">

    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" status-icon label-width="100px" class="demo-ruleForm">

      <div class="primeArea">
        <el-form-item label="发布标题" prop="pass">
          <el-input v-model="ruleForm.pass" type="text" />
        </el-form-item>

        <el-form-item label="发布类型" prop="genre">
          <el-select v-model="ruleForm.region" placeholder="请选择发布类型">
            <el-option label="类型一" value="shanghai"/>
            <el-option label="类型二" value="beijing"/>
          </el-select>
        </el-form-item>

        <el-form-item label="截止时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="line middleLine">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker v-model="ruleForm.date2" placeholder="选择时间" style="width: 100%;"/>
            </el-form-item>
          </el-col>
        </el-form-item>
      </div>

      <el-form-item label="发布图片" prop="pass">
        <el-upload
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card">
          <i class="el-icon-plus"/>
        </el-upload>
      </el-form-item>
      <div class="primeArea">
        <el-form-item label="项目名称" prop="pass">
          <el-input v-model="ruleForm.pass" type="text" />
        </el-form-item>

        <el-form-item label="所在地" prop="pass">
          <el-input v-model="ruleForm.pass" type="text" />
        </el-form-item>
        <el-form-item label="投资规模" prop="pass">
          <el-input v-model="ruleForm.pass" type="text" />
        </el-form-item>

      </div>

      <el-form-item label="项目背景" prop="desc">
        <el-input v-model="ruleForm.pass" :rows="5" type="textarea"/>
      </el-form-item>
      <el-form-item label="建设类容" prop="desc">
        <el-input v-model="ruleForm.pass" :rows="5" type="textarea"/>
      </el-form-item>
      <el-form-item label="效益分析" prop="desc">
        <el-input v-model="ruleForm.pass" :rows="5" type="textarea"/>
      </el-form-item>

      <el-form-item label="合作方式" prop="genre">
        <el-select v-model="ruleForm.region" placeholder="请选择合作方式">
          <el-option label="方式一" value="shanghai"/>
          <el-option label="方式二" value="beijing"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
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
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      ruleForm: {
        pass: '',
        checkPass: '',
        data1: '',
        data2: '',
        deadline: '',
        age: ''
      },
      rules: {
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        genre: [
          { required: true, trigger: 'change', message: '请选择发布类型' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        age: [
          { required: true, validator: checkAge, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .primeArea{
        width:500px;
        .middleLine{
            text-align: center;
        }
    }
</style>

