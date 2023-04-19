<template>
  <div class="h-100" style="overflow: auto;">
    <div class="d-flex flex-wrap" style="font-size: 16px;">
     <div class="w-50 p-2" style="">
        公司名称:{{detail.name}} <a :href="'https://www.tianyancha.com/search?key=' + detail.name" target="_blank">[天眼查]</a>
     </div>
     <div class="w-50 p-2" style="">
        手机号码:{{ isFollowUp ? detail.mobile : '******'}}
     </div>
     <div class="w-50 p-2" style="">
        所属省市区:{{ location }}
     </div>
     <div class="w-50 p-2" style="">
        业务范围: {{detail.business_scope}}
     </div>
     <div class="w-50 p-2" style="">
        企业官网:{{detail.website}}
     </div>
     <!-- <div class="w-50 p-2" style="">
        客户状态:{{options.name}}
     </div> -->
     <div class="w-50 p-2" style="">
        会员级别:{{detail.vip ? detail.vip.describe : ''}}
     </div>
     <div class="w-50 p-2" style="">
        邮箱地址:{{detail.email}}
     </div>
     <div class="w-50 p-2" style="">
        所属行业:{{detail.industry ? detail.industry.name : '未知'}}
     </div>

     <div class="w-50 p-2" style="">
        详细地址(原): {{detail.old_address}}
     </div>
     <div class="w-50 p-2" style="">
        行业分类(原): {{detail.old_industry}}
     </div>
     <div class="w-50 p-2" style="">
        行业门类（一级）(原): {{detail.old_industry_1}}
     </div>
     <div class="w-50 p-2" style="">
        产业链环节（二级）(原): {{detail.old_industry_2}}
     </div>
     <div class="w-50 p-2" style="">
        备注:{{detail.remarks}}
     </div>

     <div class="w-50 p-2" style="">
        备注:{{detail.remarks}}
     </div>
    <!-- <div class="w-50 p-2" style="">
        团队成员:{{options.name}}
     </div> -->
     <!-- <div class="w-50 p-2" style="">
        客户成交状态:{{options.name}}
     </div> -->
     <!-- <div class="w-50 p-2" style="">
        最近跟进时间:{{options.name}}
     </div> -->
   <!--  <div class="w-50 p-2" style="">
        渠道商:{{options.name}}
     </div> -->
     <!-- <div class="w-50 p-2" style="">
        渠道负责人:{{options.name}}
     </div> -->
     <!-- <div class="w-50 p-2" style="">
        首要联系人:{{options.name}}
     </div> -->
     <div class="w-50 p-2" style="">
        跟进人:{{detail.follow_up ? detail.follow_up.name : ''}}
     </div>
      <!-- <div class="w-50 p-2" style="">
        负责人部门:{{options.name}}
     </div> -->
      <div class="w-50 p-2" style="">
        创建人:{{detail.creator ? detail.creator.name : ''}}
     </div>
     <div class="w-50 p-2" style="">
        创建时间:{{detail.created_at}}
     </div>
     <div class="w-50 p-2" style="">
        更新时间:{{detail.updated_at}}
     </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default: function(){
        return {};
      },
    },
    isFollowUp: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {

    };
  },
  created() {

  },
  methods: {

  },
  computed: {
    location: function () {
      return (this.detail.province ? this.detail.province.name : '') + " " + (this.detail.city ? this.detail.city.name : '') + " " + (this.detail.area ? this.detail.area.name : '');
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
