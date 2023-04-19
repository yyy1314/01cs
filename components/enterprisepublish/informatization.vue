<template>
  <div class="h-100" style="overflow: auto;">
    <div class="d-flex flex-wrap" style="font-size: 16px;">
     <div class="w-50 p-2" style="">
        单位名称:{{detail.name}} <a :href="'https://www.baidu.com/s?wd=' + detail.name" target="_blank">[百度]</a>
     </div>
     <div class="w-50 p-2" style="">
        单位手机:{{isFollowUp ? detail.mobile : '******'}}
     </div>
     <div class="w-50 p-2" style="">
        单位座机:{{isFollowUp ? detail.phone : '******'}}
     </div>
     <div class="w-50 p-2" style="">
        所属省市区:{{ location }}
     </div>
     <!-- <div class="w-50 p-2" style="">
        客户来源:{{options.name}}
     </div> -->

     <!-- <div class="w-50 p-2" style="">
        客户状态:{{options.name}}
     </div> -->
     <!-- <div class="w-50 p-2" style="">
        客户级别:{{options.vip.describe}}
     </div> -->
     <div class="w-50 p-2" style="">
        邮箱地址:{{isFollowUp ? detail.email : '******'}}
     </div>

     <div class="w-50 p-2" style="">
        详细地址(原): {{detail.old_address}}
     </div>
     <div class="w-50 p-2" style="">
        信息来源(原): {{detail.old_info_source}}
     </div>
     <div class="w-50 p-2" style="">
        类别(原): {{detail.old_type}}
     </div>

     <!-- <div class="w-50 p-2" style="">
        客户行业:{{options.industry.name}}
     </div> -->
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
        跟进人:{{ detail.follow_up ? detail.follow_up.name : '' }}
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

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
