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
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="requestData.name" type="text" />
        </el-form-item>

        <el-form-item label="报名截止" required>
          <el-col :span="24">
            <el-form-item prop="deadlineData">
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

        <!-- <div class="primeArea">
                <el-form-item label="发布活动" prop="name">
                  <el-input v-model="requestData.name" type="text" />
                </el-form-item>

                <el-form-item label="报名截止" required>
                  <el-col :span="11">
                    <el-form-item prop="deadlineData">
                      <el-date-picker
                        v-model="requestData.deadlineData"
                        type="date"
                        placeholder="选择日期"
                        style="width: 100%;"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" class="line middleLine">-</el-col>
                  <el-col :span="11">
                    <el-form-item prop="deadlineTime">
                      <el-time-picker
                        v-model="requestData.deadlineTime"
                        placeholder="选择时间"
                        style="width: 100%;"
                      />
                    </el-form-item>
                  </el-col>
        </el-form-item>-->

        <el-form-item label="活动日期" prop="timeInterval">
          <el-date-picker
            v-model="requestData.timeInterval "
            :picker-options="startDatePicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item label="举办地点" prop="location">
          <el-cascader
            :options="options"
            v-model="requestData.location"
            :separator="' '"
            style="width:100%"
          />
        </el-form-item>

        <el-form-item label="详细地址" prop="address">
          <el-input placeholder="必填,不含城市部分" v-model="requestData.address" type="text" />
        </el-form-item>

        <el-form-item label="活动分类" prop="type">
          <el-select v-model="requestData.type" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in classification"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="可报名人数" prop="max_join_num">
          <el-input-number v-model="requestData.max_join_num" :min="1" />
        </el-form-item>

        <el-form-item label="咨询电话" prop="tel">
          <el-input v-model="requestData.tel" type="text" />
        </el-form-item>
      </div>
      <el-form-item label="价格设置" prop="prices">
        <template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column label="套餐名" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" type="text" placeholder="请输入套餐名,2-5字"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="价格" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" type="text" placeholder="请输入数字"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="会员价格" width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.vip_price" type="text" placeholder="请输入数字"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="说明" width="480">
              <template slot-scope="scope">
                <el-input v-model="scope.row.explain" type="text" placeholder="请输入活动说明,2-25字"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="addRow(scope.$index, scope.row)">添加</el-button>
                <el-button size="mini" type="danger" @click="deleteRow(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-form-item>
      <el-form-item label="活动图片" prop="image">
        <!-- <el-upload
                          :on-preview="handlePictureCardPreview"
                          :on-remove="handleRemove"
                          :headers = "headers"
                          :on-error="handleError"
                          :on-success="handleSuccess"
                          :action="uploadUrl"
                          :file-list="requestData.image"
                          list-type="picture-card">
                          <i class="el-icon-plus"/>
        </el-upload>-->
        <Upload-img-more
          :values.sync="image"
          :img-width="150"
          :img-height="150"
          :auto-crop-width="244"
          :auto-crop-height="152"
        />
      </el-form-item>

     <div class="quillEditorBox" style="display:flex">
        <div class="title">资讯介绍</div>
        <div class="quillEditor">
          <editor
            :apiKey="tinymceApiKey"
            :init="initTinymceEditor"
            v-model="requestData.intro"
          />
        </div>
      </div>

      <el-form-item >
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
import {
  activityCreate,
  getActivityCategory,
  activityDetails
} from "@/api/activity";
import { getVipList } from "@/api/vip";
import options from "@/utils/country-level2-data.js";
import { validatPhone, validatFixedTelePhone } from "@/utils/validate.js";
import { Message } from "element-ui";
import { timeConversion } from "@/utils/filters.js";
import { getToken } from "@/utils/auth";
import UploadImgMore from "@/components/UploadImg/More";
import tinymceEditor from '@/mixins/tinymceEditor.js';
import Editor from '@tinymce/tinymce-vue';
export default {
  mixins:[tinymceEditor],
  components: { UploadImgMore, Editor },
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

    return {
      startDatePicker: this.beginDate(),
      options: options, // 存放城市数据
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      dialogImageUrl: "",
      dialogVisible: false,
      image: [],
      requestData: {
        name: "",
        deadline: new Date(),
        timeInterval: "",
        deadlineData: "",
        deadlineTime: "",
        start_at: "",
        end_at: "",
        location: [],
        address: "",
        max_join_num: "",
        tel: "",
        image: [],
        type: "",
        // intro: "",
        intro:""
      },
      rules: {
        name: [{ required: true, trigger: "blur", message: "活动名称为必填" }],
        timeInterval: [
          { required: true, trigger: "change", message: "请选择时间区间" }
        ],
        location: [
          { required: true, trigger: "change", message: "请选择举办城市" }
        ],
        address: [
          { required: true, trigger: "change", message: "请填写详细地址" }
        ],
        max_join_num: [
          { required: true, trigger: "change", message: "请选择报名人数" }
        ],
        tel: [{ required: true, validator: checkPhone, trigger: "change" }],
        type: [
          { required: true, trigger: "change", message: "请选择活动分类" }
        ],
        image: [
          { required: true, trigger: "change", message: "请至少上传一张图片" }
        ]
      },
      vipDataList: [],
      classification: [],
      editId: "",
      editDetails: {},
      tableData: [
        {
          name: "",
          price: "",
          vip_price: "",
          explain: ""
        }
      ],
      vip_price_ratio: ""
    };
  },
  computed: {
    uploadUrl() {
      return this.$store.state.uploadUrl;
    }
  },
  mounted() {
    // 获取活动分类列表
    getActivityCategory({}).then(response => {
      console.log(response);
      this.classification = response.res;
    });

    // 获取会员列表
    getVipList({}).then(vipListRes => {
      if (this.$route.query.editId) {
        activityDetails({ activity_id: this.$route.query.editId }).then(
          e => {
            this.editId = this.$route.query.editId;
            this.editDetails = e.res;

            this.requestData.name = this.editDetails.name;
            this.requestData.deadline = timeConversion(
              this.editDetails.deadline,
              "Y-M-D"
            );
            this.requestData.timeInterval = [
              timeConversion(this.editDetails.start_at, "Y-M-D"),
              timeConversion(this.editDetails.end_at, "Y-M-D")
            ];
            this.requestData.location = this.editDetails.location.split(" ");
            this.requestData.address = this.editDetails.address;
            this.requestData.type = this.editDetails.type;
            this.requestData.max_join_num = this.editDetails.max_join_num;
            this.requestData.tel = this.editDetails.tel;
            this.requestData.intro = e.res.intro
            // this.requestData.intro = this.editDetails.intro;
            this.requestData.image = this.editDetails.activity_imgs.map(e => {
              return { url: e };
            });
            this.image = this.editDetails.activity_imgs.map((e, i) => {
              return { url: e, value: i + 1 };
            });

            // 匹配会员列表
            if (JSON.stringify(this.editDetails.price) != "[]") {
              this.tableData = this.editDetails.prices;
            }
            // this.vip_price_ratio = this.editDetails.vip_price_ratio
          },
          err => {}
        );

        this.$route.meta.title = "编辑活动";
      } else {
        vipListRes.res.filter(e => {
          e.prices = 0;
          e.radio = 1;
        });
        this.vipDataList = vipListRes.res;
      }
    });
    // }
  },
  methods: {
    deleteRow(index, rows) {
      if (this.tableData.length !== 1) {
        this.tableData.splice(index, 1);
      } else {
        this.$message({
          message: "至少需要一个套餐信息",
          type: "warning",
          offset: 200
        });
      }
    },
    addRow(index, rows) {
      if (this.tableData.length <= 5) {
        this.tableData.push({
          name: "",
          price: "",
          explain: ""
        });
      } else {
        this.$message({
          message: "最多只能添加五个套餐信息",
          type: "warning",
          offset: 200
        });
      }
    },
    // 发布活动
    submitForm(formName) {
      const that = this;
      this.requestData.image = this.image;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!')
          // 发送请求
          const requestData = {
            name: this.requestData.name,
            deadline: parseInt(
              new Date(this.requestData.deadline).getTime() / 1000
            ),
            start_at: parseInt(
              new Date(this.requestData.timeInterval[0]).getTime() / 1000
            ),
            end_at: parseInt(
              new Date(this.requestData.timeInterval[1]).getTime() / 1000
            ),
            location:
              this.requestData.location[0] + " " + this.requestData.location[1],
            address: this.requestData.address,
            max_join_num: this.requestData.max_join_num,
            tel: this.requestData.tel,
            image: this.image.map(e => e.url),
            // intro: this.requestData.intro,
            type: this.requestData.type,
            vip_price_ratio: this.vip_price_ratio,
            prices: this.tableData,
            intro: this.requestData.intro,
          };
          if (this.editId) {
            requestData.activity_id = this.editId;
          }
          activityCreate(requestData).then(response => {
            if(response.code === 200){
              Message({
                message: `${this.editId ? "编辑" : "发布"}成功`,
                type: "success",
                duration: 5 * 1000
              });
              setTimeout(e => {
                that.$router.go(-1);
              }, 500);
            }else{
              that.$message({
                type: "warning",
                message: response.msg
              });
            }
          });
        } else {
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
      this.requestData.image = this.requestData.image.filter(
        e => e.url !== file.url
      );
    },
    // 图片放大
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传图片失败
    handleError(e) {},
    // 上传图片成功
    handleSuccess(e) {
      this.requestData.image.push({ url: e.res.image });
    },
    // 最小时间
    beginDate() {
      return {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 8.64e7;
        }
      };
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
  .quillEditorBox{
        display: flex;
        margin-bottom: 50px;
        .title{
            width: 100px;
            padding-right: 12px;
            text-align: right;
            font-size: 14px;
            color: #606266;
            font-weight: 700;
            line-height: 40px;
        };
        .quillEditor{
            flex:1;

        }
    }
</style>
