<template>
  <el-dialog
    :title="'修改密码'"
    :visible.sync="dialogEditVisible"
    :close-on-click-modal="false"
    width="500px"
    center
  >
    <el-form
      ref="dataForm"
      :rules="loginRules"
      :model="form"
      label-position="right"
      label-width="80px"
    >
      <el-form-item label="旧密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入旧密码"/>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input v-model="form.new_password" type="password" placeholder="请输入新密码"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmed_password">
        <el-input v-model="form.confirmed_password" type="password" placeholder="请输入确认新密码"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogEditVisible = false">关闭</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { md5 } from '@/utils/md5'
import { changePassword } from '@/api/User'
export default {
  components: {},
  data() {
    // const validatePassword = (rule, value, callback) => {
    //   if (value != this.form.password) {
    //     callback(new Error('密码不相同'))
    //   } else {
    //     callback()
    //   }
    // }
    const reg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/)
    const validatePass = (rule, value, callback) => {
      // if (!value) {
      //   callback(new Error('密码不能 为空'))
      // } else if (value.length < 6 || value.length > 10 || !reg.test(value)) {
      //   callback(new Error('密码必须包含数字和字母且长度为6到20位'))
      // } else {
      //   callback()
      // }
      callback()
    }
    const validateNew_password = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能 为空'))
      } else if (value.length < 6 || value.length > 10 || !reg.test(value)) {
        callback(new Error('密码必须包含数字和字母且长度为6到20位'))
      } else if (value == this.form.password) {
        callback(new Error('新密码不能和旧密码相同'))
      } else {
        callback()
      }
    }
    const validateConfirmed_password = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能 为空'))
      } else if (value.length < 6 || value.length > 10 || !reg.test(value)) {
        callback(new Error('密码必须包含数字和字母且长度为6到20位'))
      } else if (value != this.form.new_password) {
        callback(new Error('确认密码必须要和新密码一致'))
      } else {
        callback()
      }
    }
    return {
      dialogEditVisible: false,
      form: {
        password: null,
        new_password: null,
        confirmed_password: null
      },
      loginRules: {
        password: [
          { required: true, trigger: 'blur', validator: validatePass }
        ],
        new_password: [
          { required: true, trigger: 'blur', validator: validateNew_password }
        ],
        confirmed_password: [
          { required: true, trigger: 'blur', validator: validateConfirmed_password }
        ]
      }
    }
  },
  methods: {
    showDialog() {
      this.dialogEditVisible = true
      this.form = {}
    },
    handleSave() {
      const t = this
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          const form = {
            password: t.form.password,
            new_password: t.form.new_password,
            new_password_confirmation: t.form.confirmed_password
          }
          changePassword(form).then(response => {
            t.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            t.dialogEditVisible = false
          })
        }
      })
    }
  }
}
</script>

