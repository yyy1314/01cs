<template>
  <div>
    <!-- 编辑窗口 -->
    <el-dialog title="编辑用户" :visible.sync="compileShow" :close-on-click-modal="false" width="40%" top="20px" @close="close(null)">
      <div class="p-1 d-flex flex-wrap a-center j-sb">
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">姓名:</div>
            <div class="pt-1"><el-input v-model="tableData.name" placeholder="请输入内容" size="small"></el-input></div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">性別:</div>
            <div class="pt-1">
              <el-select v-model="tableData.sex" placeholder="请选择" size="small" style="width: 100%;">
                <el-option v-for="item in options1" :key="item.name" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">联系方式:</div>
            <div class="pt-1"><el-input v-model="tableData.mobile" placeholder="请输入内容" size="small"></el-input></div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">邮箱:</div>
            <div class="pt-1"><el-input v-model="tableData.email" placeholder="请输入内容" size="small"></el-input></div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">公司类别:</div>
            <div class="pt-1">
              <el-select v-model="tableData.unit_category" placeholder="请选择" size="small" style="width: 100%;">
                <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">关联公司:</div>
            <div class="d-flex j-sb">
              <div class="pt-1">
                <el-select
                  v-model="tableData.member_unit_id"
                  size="small"
                  filterable
                  remote
                  reserve-keyword
                  :no-match-text="tableData.member_unit ? tableData.member_unit.name : '' "
                  placeholder=""
                  :remote-method="remoteMethod"
                  :loading="loading"
                >
                  <el-option v-for="item in options4" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </div>
              <div class="pt-1"><el-button type="primary" size="small" @click="addUnit">新增</el-button></div>
            </div>
          </div>
        </div>

        <div class="p-1" style="width: 48%;" v-if="tableData.member_unit_id == null">
          <div class="d-flex flex-column">
            <div class="">单位名称:</div>
            <div class="pt-1"><el-input v-model="tableData.unit" placeholder="请输入内容" size="small"></el-input></div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;" v-if="tableData.member_unit_id == null && tableData.unit_category == 1">
          <div class="d-flex flex-column">
            <div class="">行业方向:</div>
            <div class="pt-1">
              <el-select v-model="tableData.industry.id" placeholder="请选择" size="small" style="width: 100%;">
                <el-option v-for="item in options3" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">职位:</div>
            <div class="pt-1"><el-input v-model="tableData.position" placeholder="请输入内容" size="small"></el-input></div>
          </div>
        </div>
      </div>

      <div class="p-1" style="width: 100%;">
        <div class="d-flex flex-column">
          <div class="">备注:</div>
          <div class="pt-1 w-100"><el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="tableData.remarks"></el-input></div>
        </div>
      </div>
      <div class="d-flex j-end"><el-button class="filter-item" type="primary" @click="submit()">确认</el-button></div>
    </el-dialog>
    <addEnterprise v-if="addEnterpriseVisible"  @close="addEnterpriseClose" type="1"></addEnterprise>
    <addGovernment v-if="addGovernmentVisible"  @close="addEnterpriseClose" type="1"></addGovernment>
  </div>
</template>

<script>
import { getIndustryList, changeUserMsg , getuserDetail} from '../../api/User.js';
import { getopportunityList } from '../../api/enterprisepublish.js';
import { getopportunityList1 } from '../../api/enterprise.js';
import addEnterprise from '../../components/enterpriseindex/addEnterprise.vue';
import addGovernment from '../../components/enterprisepublish/addGovernment.vue';
export default {
  components: {
    addEnterprise,
    addGovernment
  },
  props: {
    id: {
      default: null,
      type: Number
    }
  },
  data() {
    return {
      compileShow:true,
      tableData:{},
      options: [{ name: '企业', id: 1 }, { name: '政府', id: 2 }],
      options1: [{ name: '男', id: 1 }, { name: '女', id: 2 }],
      options3: [],
      options4: [],
      list: [],
      loading: false,
      addEnterpriseVisible: false,
      addGovernmentVisible: false,
    };
  },
  created() {
      getuserDetail({
        id: this.id
      }).then(res => {
        if (res.code == 200) {
          this.tableData = res.res;
        }
      });
  },
  mounted() {
    if (this.tableData.member_unit) {
      this.options4.push(this.tableData.member_unit);
    }
    this.getClass();
  },
  methods: {
    //获取行业方方向
    getClass() {
      getIndustryList().then(res => {
        if (res.code == 200) {
          this.options3 = res.res;
        }
      });
    },
    remoteMethod(query) {
      let that = this;
      if (query !== '') {
        that.loading = true;
        setTimeout(() => {
          that.loading = false;
          if (that.tableData.unit_category == 1) {
            getopportunityList1({
              keyword: query
            }).then(res => {
              if (res.code == 200) {
                that.options4 = res.res.items;
              }
            });
          } else {
            getopportunityList({
              keyword: query
            }).then(res => {
              if (res.code == 200) {
                that.options4 = res.res.items;
              }
            });
          }
        }, 200);
      } else {
        that.options4 = [];
      }
    },
    submit() {
      changeUserMsg({
        id: this.tableData.id,
        member_unit_id: this.tableData.member_unit_id,
        unit_category: this.tableData.unit_category,
        name: this.tableData.name,
        sex: this.tableData.sex,
        position: this.tableData.position,
        mobile: this.tableData.mobile,
        email: this.tableData.email,
        remarks: this.tableData.remarks,
        unit: this.tableData.unit,
        industry_id: this.tableData.industry ? this.tableData.industry.id : ''
      }).then(res => {
        if(res.code == 200) {
          this.close(res.res);
        } else {
          this.$message(res.msg);
        }
      });
    },
    close(memberUnit){
      this.$emit('close',memberUnit);
      this.compileShow = false;
    },
    addUnit() {
      if(this.tableData.unit_category == 1){
         this.addEnterpriseVisible = true;
      }else{
         this.addGovernmentVisible = true;
      }
    },
    addEnterpriseClose() {
      if(this.tableData.unit_category == 1){
         this.addEnterpriseVisible = false;
      }else{
         this.addGovernmentVisible = false;
      }
    }
  }
};
</script>

<style></style>
