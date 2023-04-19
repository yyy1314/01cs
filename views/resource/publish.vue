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
        <el-form-item label="项目标题" prop="title">
          <el-input v-model="requestData.title" type="text" />
        </el-form-item>

        <el-form-item label="招商类型" prop="category">
          <el-select
            v-model="requestData.category"
            placeholder="请选择"
            style="width:100%"
            @change="selChange"
          >
            <el-option
              v-for="item in classCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型" prop="type">
          <el-select v-model="requestData.type" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in classification"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="截止时间" required>
          <el-col :span="24">
            <el-form-item prop="deadline">
              <el-date-picker
                v-model="requestData.deadline"
                :picker-options="startDatePicker"
                :clearable="false"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="规模" prop="scale">
          <div style="display:flex">
            <el-input v-model="requestData.scale" type="Number" />
            <span style="padding:0 10px">亿</span>
          </div>
        </el-form-item>

        <el-form-item label="项目标签" prop="bg_info">
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="(item,index) in tags" :key="index" :label="item.name"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="背景介绍" prop="bg_info">
          <el-input v-model="requestData.bg_info" :rows="5" type="textarea" />
        </el-form-item>

        <el-form-item label="建设类容" prop="content">
          <el-input v-model="requestData.content" :rows="5" type="textarea" />
        </el-form-item>

        <el-form-item label="效益分析" prop="benefit">
          <el-input v-model="requestData.benefit" :rows="5" type="textarea" />
        </el-form-item>

        <el-form-item label="合作方式" prop="cooperation">
          <el-select v-model="requestData.cooperation" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in cooperationCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="举办地点" prop="region">
          <location-select v-model="requestData.region" :level="3" placeholder="必填,请选择"></location-select>
        </el-form-item>

        <el-form-item label="咨询电话" prop="tel">
          <el-input v-model="requestData.tel" type="text" />
        </el-form-item>

        <custom-field category="resource" :customFields="editDetails.custom_fields" @change="onCustomFiledChange"></custom-field>

      </div>

      <el-form-item label="项目图片" prop="imgs">
        <Upload-img-more
          :values.sync="imgs"
          :img-width="150"
          :img-height="150"
          :auto-crop-width="244"
          :auto-crop-height="152"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('requestData')">保存</el-button>
        <el-button @click="$router.go(-1)">返回</el-button>
      </el-form-item>



    </el-form>

    <!-- 弹窗 -->
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt />
    </el-dialog>
  </div>
</template>

<script>
import UploadImgMore from "@/components/UploadImg/More";
import CustomField from "@/components/CustomField/form.vue";
import { validatPhone, validatFixedTelePhone } from "@/utils/validate.js";
import { Message } from "element-ui";
import { timeConversion } from "@/utils/filters.js";
import { getToken } from "@/utils/auth";
import LocationSelect from '@/components/LocationSelect.vue';

import {
  resourceCategory,
  resourceCreate,
  resourceDetails,
  resourceList,
  gitTags
} from "@/api/resource";

export default {

  components: { UploadImgMore , LocationSelect , CustomField},
  data() {
    var checkPhone = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("号码不能为空"));
      } else {
        if (!validatPhone(value) && !validatFixedTelePhone(value)) {
          return callback(new Error("手机号码或者固话不合法"));
        }
      }
      callback();
    };
    var maxScale = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("号码不能为空"));
      } else {
        if (value > 1000) {
          return callback(new Error("最大值不能超过1000亿"));
        }
      }
      callback();
    };
    return {
      startDatePicker: this.beginDate(),

      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      imgs: [],
      dialogImageUrl: "",
      dialogVisible: false,
      requestData: {
        title: "",
        type: null,
        deadline: new Date(),
        imgs: [],
        region: [],
        scale: "",
        bg_info: "",
        content: "",
        benefit: "",
        cooperation: "",
        tel: "",
        category: 1,
        custom_fields:[],
      },
      cooperationCategory: [
        {
          name: "独资",
          id: 1
        },
        {
          name: "合资",
          id: 2
        },
        {
          name: "独资、合资",
          id: 3
        },
        {
          name: "租赁",
          id: 4
        },
        {
          name: "独资、合资、租赁",
          id: 5
        },
        {
          name: "合作",
          id: 6
        },
        {
          name: "独资、合资、合作",
          id: 7
        },
        {
          name: "独资、合作",
          id: 8
        },
        {
          name: "合资、合作",
          id: 9
        }
      ],
      classCategory: [
        {
          name: "企业",
          id: 1
        },
        {
          name: "政府",
          id: 2
        }
      ],
      checkList:[],
      rules: {
        title: [{ required: true, trigger: "blur", message: "资源标题为必填" }],
        type: [
          { required: true, trigger: "change", message: "请选择资源分类" }
        ],
        category: [
          { required: true, trigger: "blur", message: "请选择招商类型" }
        ],
        scale: [{ required: true, trigger: "blur", validator: maxScale }],
        bg_info: [
          { required: true, trigger: "blur", message: "背景介绍为必填" }
        ],
        content: [
          { required: true, trigger: "blur", message: "建设内容为必填" }
        ],
        benefit: [
          { required: true, trigger: "blur", message: "效益分析为必填" }
        ],
        cooperation: [
          { required: true, trigger: "blur", message: "合作方式为必填" }
        ],
        region: [
          { required: true, trigger: "change", message: "请选择举办地点" }
        ],
        tel: [{ required: true, validator: checkPhone, trigger: "change" }],
        imgs: [
          { required: true, trigger: "click", message: "请至少上传一张图片" }
        ]
      },
      vipDataList: [],
      classification: [],
      editId: "",
      editDetails: {
        custom_fields:[],
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      tags:[],

    };
  },
  computed: {
    uploadUrl() {
      return this.$store.state.uploadUrl;
    }
  },
  created() {
    gitTags().then(res=>{
      if(res.code == 200){
        this.tags = res.res;
      }
    });
    // 获取项目分类列表
    resourceList({ type: "enterprise" }).then(res => {
      this.classification = res.res;
    });

    // 获取会员列表
    if (this.$route.query.editId) {
      resourceDetails({ resource_id: this.$route.query.editId }).then(
        e => {
          this.editId = this.$route.query.editId;
          this.editDetails = e.res;
          this.requestData.title = this.editDetails.title;
          this.requestData.type = this.editDetails.type;
          this.requestData.deadline = timeConversion(
            this.editDetails.deadline,
            "Y-M-D"
          );
          this.requestData.region = this.editDetails.region;
          this.requestData.scale = this.editDetails.scale;
          this.requestData.tel = this.editDetails.tel;
          this.requestData.bg_info = this.editDetails.bg_info;
          this.editDetails.tag == null ? [] : this.editDetails.tag;
          this.requestData.content = this.editDetails.content;
          this.requestData.benefit = this.editDetails.benefit;
          this.requestData.cooperation = parseInt(this.editDetails.cooperation);
          this.requestData.category = this.editDetails.category;

          if (this.requestData.category == 2) {
            resourceCategory({}).then(response => {
              this.classification = response.res;
            });
          }
          this.requestData.imgs = this.editDetails.imgs.map((e, i) => {
            return { url: e, value: i + 1 };
          });
          this.imgs = this.requestData.imgs;
          this.checkList = this.editDetails.tag ? this.editDetails.tag : [];
        },
        err => {
          console.log(err);
        }
      );

      this.$route.meta.title = "编辑资源";
    }

    // }
  },
  methods: {

    // 发布活动
    submitForm(formName) {
      this.requestData.imgs = this.imgs;
      console.log(this.$refs.location);
      const that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          const requestData = {
            title: this.requestData.title,
            type: this.requestData.type,
            deadline: parseInt(
              new Date(this.requestData.deadline).getTime() / 1000
            ),
            imgs: this.requestData.imgs.map(e => e.url),
            region: this.requestData.region,
            scale: this.requestData.scale,
            bg_info: this.requestData.bg_info,
            content: this.requestData.content,
            benefit: this.requestData.benefit,
            cooperation: this.requestData.cooperation,
            tel: this.requestData.tel,
            category: this.requestData.category,
            tag: this.checkList,
            custom_fields: this.requestData.custom_fields
          };
          if (this.editId) {
            requestData.resource_id = this.editId;
          }
          console.log(requestData);
          resourceCreate(requestData).then(response => {
            if(response.code !== 200){
              this.$message({
                message: response.msg,
                type: "warning",
              });
              return;
            }
            Message({
              message: `${this.editId ? "编辑" : "发布"}成功`,
              type: "success",
              duration: 5 * 1000
            });
            setTimeout(e => {
              that.$router.go(-1);
            }, 500);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 预览
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 删除图片
    handleRemove(file, fileList) {
      console.log(file);
      console.log(fileList);
      console.log(this.requestData.imgs);
      this.requestData.imgs = this.requestData.imgs.filter(
        e => e.url !== file.url
      );
      console.log(this.requestData.image);
    },
    // 图片放大
    handlePictureCardPreview(file) {
      console.log(123456);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传图片失败
    handleError(e) {
      console.log(e);
    },
    // 上传图片成功
    handleSuccess(e) {
      console.log(e);
      this.requestData.imgs.push({ url: e.res.image });
    },
    // 最小时间
    beginDate() {
      return {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 8.64e7;
        }
      };
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
        console.log(this.dynamicTags);
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //改变分类获取不同列表
    selChange(e) {
      if (e == 1) {
        resourceList({ type: "enterprise" }).then(res => {
          this.classification = res.res;
        });
      } else if(e == 2) {
        resourceCategory({}).then(response => {
          this.classification = response.res;
        });
      }
    },
    onCustomFiledChange(value){
      this.requestData.custom_fields = value;
    }
  }
};
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-checkbox{
  margin-left: 30px;
}
</style>
