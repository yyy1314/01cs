<template>
  <div>
    <!-- 新增弹窗 -->
    <el-dialog :title="type == 1 ? '添加企业' : '修改企业'" :visible.sync="dialogEditVisible" :close-on-click-modal="false" :modal="false" width="40%" top="20px" @close="$emit('close',{})">
      <div class="p-1 d-flex flex-wrap a-center j-sb">
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">企业名称:</div>
            <div class="pt-1"><el-input v-model="form.name" placeholder="必填,请输入公司全称" size="small"></el-input></div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">会员级别:</div>
            <div class="pt-1">
              <el-select v-model="form.vip_id" placeholder="请选择,必填" size="small" style="width: 100%;">
                <el-option v-for="item in options" :key="item.value" :label="item.describe" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">过期时间:</div>
            <div class="pt-1"><el-date-picker v-model="form.vip_expire_at" type="date" placeholder="不是注册会员时必填" width="100%" size="small"></el-date-picker></div>
          </div>
        </div>

        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">手机号码:</div>
            <div class="pt-1"><el-input v-model="form.mobile" placeholder="选填" size="small"></el-input></div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">所属行业:</div>
            <div class="pt-1">
              <el-select v-model="form.industry_id" placeholder="请选择,必填" size="small" style="width: 100%;">
                <el-option v-for="item in options1" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">公司官网:</div>
            <div class="pt-1"><el-input v-model="form.website" placeholder="选填,请输入网址 http://www.ctdu.com.cn/" size="small"></el-input></div>
          </div>
        </div>

        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">邮箱:</div>
            <div class="pt-1"><el-input v-model="form.email" placeholder="选填" size="small"></el-input></div>
          </div>
        </div>

        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">省市区:</div>
            <div class="pt-1">
               <location-select v-model="region" :level="3" placeholder="必填,请选择"></location-select>
            </div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">详细地址:</div>
            <div class="pt-1"><el-input v-model="form.address" placeholder="必填" size="small"></el-input></div>
          </div>
        </div>

        <div class="p-1" style="width: 100%;">
          <div class="d-flex flex-column">
            <div class="">业务范围:</div>
            <div class="pt-1 w-100"><el-input type="textarea" :rows="5" v-model="form.business_scope" placeholder="必填,2-255字" size="small"></el-input></div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">跟进人:</div>
            <div class="pt-1">
              <el-select v-model="form.follow_up_id" placeholder="必填,请选择" size="small" style="width: 100%;">
                <el-option v-for="item in options5" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">详细地址(原):</div>
            <div class="pt-1"><el-input placeholder="选填,60字以内" v-model="form.old_address"></el-input></div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">行业分类(原):</div>
            <div class="pt-1"><el-input placeholder="选填,30字以内" v-model="form.old_industry"></el-input></div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">行业门类（一级）(原):</div>
            <div class="pt-1"><el-input placeholder="选填,30字以内" v-model="form.old_industry_1"></el-input></div>
          </div>
        </div>
        <div class="p-1" style="width: 48%;">
          <div class="d-flex flex-column">
            <div class="">产业链环节（二级）(原):</div>
            <div class="pt-1"><el-input placeholder="选填,30字以内" v-model="form.old_industry_2"></el-input></div>
          </div>
        </div>

        <div class="p-1" style="width: 100%;">
          <div class="d-flex flex-column">
            <div class="">备注:</div>
            <div class="pt-1 w-100"><el-input type="textarea" :rows="2" placeholder="选填,200字以内" v-model="form.remarks"></el-input></div>
          </div>
        </div>
      </div>
      <div class="d-flex j-end"><el-button class="filter-item" type="primary" @click="ReviewApplication()">确认</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import { industry } from '../../api/industry.js';
import { getAdminList } from '../../api/admin.js';
import { getopportunityList1, opportunityDetails, establish, exportExcel,exchangeEnterprise } from '@/api/enterprise';
import { getVipList } from '../../api/vip.js';
import LocationSelect from '@/components/LocationSelect.vue';
export default {
  components:{LocationSelect},
  props: {
    type: {
      default: null,
    },
    form: {
      type: Object,
      required: false,
      default: function(){
        return {
          id:null,
          name: '',
          mobile: '',
          industry_id: '',
          email: '',
          website: '',
          vip_id: '',
          province_code: '',
          city_code: '',
          area_code: '',
          address: '',
          follow_up_id: '',
          business_scope: '',
          old_address: '',
          old_industry: '',
          old_industry_1: '',
          old_industry_2: '',
          remarks: '',
          vip_expire_at: null
        };
      },

    }
  },
  data() {
    return {
      dialogEditVisible:true,
      region: [],  //
      options: [],
      options1: [],
      options5: []
    };
  },
  created() {
    getVipList().then(res => {
      this.options = res.res;
    });
    industry().then(res => {
      this.options1 = res.res;
    });
    getAdminList().then(res => {
      this.options5 = res.res.items;
    });
    if(this.type == 2){
      this.region = [this.form.province_code,this.form.city_code,this.form.area_code];
      console.log(this.region);
    }
  },
  mounted() {},
  watch: {
    region: function (newRegion, oldRegion) {
      Object.assign(this.form,{
        province_code:newRegion[0],
        city_code:newRegion[1],
        area_code:newRegion[2],
      });
    }
  },
  methods: {
    ReviewApplication: function() {
      if(this.type == 1){
        establish({
          ...this.form
        }).then(res => {
          if (res.code == 200) {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            });
            this.$emit('close',res.res);
          } else {
            this.$message({
              showClose: true,
              message: res.msg
            });
          }
        });
      }else{
        exchangeEnterprise({
          ...this.form
        }).then(res => {
          if (res.code == 200) {
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            });
            this.$emit('close',res.res);
          } else {
            this.$message({
              showClose: true,
              message: res.msg
            });
          }
        });

      }

    },

  }
};
</script>

<style></style>
