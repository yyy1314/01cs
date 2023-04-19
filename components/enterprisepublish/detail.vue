<template>
  <div>
    <el-drawer title="" :visible.sync="drawerVisible" :with-header="false" size="70%" :before-close="handleClose" @closed="onClosed" destroy-on-close>

      <div class="p-2" style="width: 100%;height: 100%;">
        <!-- 头部 -->
        <div class="d-flex a-center j-sb " style="font-weight: 600;">
          <div class="">{{ detail.name }}</div>
          <div class="d-flex a-center">
            <el-button type="primary" size="small" @click="exchangeGovernment">编辑</el-button>
            <el-button type="primary" size="small" @click="deleteGovernment">删除</el-button>
            <!-- <div class="el-icon-circle-close pl-2" style="font-size: 30px;" @click="handleClose">
           </div> -->
          </div>
        </div>
        <div class="d-flex pt-1" style="font-size: 14px;">
          <div class="">创建时间:{{ detail.created_at }}</div>
          <!-- <div class="pl-5">
            最新跟进时间:{{drawerArr.followTime}}
          </div> -->
        </div>
        <div class="d-flex pt-1" style="font-size: 14px;">
          <div class="">跟进人:{{ detail.follow_up ? detail.follow_up.name : ''}}</div>
        </div>
        <div class="pt-2">
          <el-tabs v-model="activeName" @tab-click="handleClick" :before-leave="beforeLeave">
            <el-tab-pane label="沟通记录" name="first"><communication :id="detail.id" :items="detail.communicates" :contacts="detail.contacts" type="government" @communicationed="onCommunicationed"></communication></el-tab-pane>
            <el-tab-pane label="详细信息" name="second"><informatization :detail="detail" :isFollowUp="isFollowUp"></informatization></el-tab-pane>
            <el-tab-pane label="联系人" name="third"><contact :id="detail.id" :items="detail.contacts" @contactUpdated="onContactUpdated" :isFollowUp="isFollowUp"></contact></el-tab-pane>
            <el-tab-pane label="附件" name="fourth"><accessory :id="detail.id" :items="detail.attachments" @attachmentUploaded="onAttachmentUploaded" type="government"></accessory></el-tab-pane>
            <el-tab-pane label="操作记录" name="five"><record :items="detail.logs"></record></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-drawer>
    <addGovernment v-if="editDisplay" :form="editForm" @close="addEnterpriseClose" type="2"></addGovernment>
  </div>
</template>

<script>
  import { opportunityDetails , deleteGovernment } from '@/api/enterprisepublish.js';
  import communication from '@/components/memberUnit/communication.vue';
  import informatization from '@/components/enterprisepublish/informatization.vue';
  import contact from '@/components/enterprisepublish/contact.vue';
  import accessory from '@/components/memberUnit/accessory.vue';
  import record from '@/components/memberUnit/record.vue';
  import addGovernment from '@/components/enterprisepublish/addGovernment.vue';

  export default {
    components: {
      communication,
      informatization,
      contact,
      accessory,
      record,
      addGovernment
    },
    props:{
      id:{
        type:Number,
        required:true
      },

    },
    data:function() {
      return {
        drawerVisible:true,
        editDisplay:false,
        detail:{},
        activeName: 'second',
        editForm:{

        },

      };
    },
    computed: {
      // 是跟进人
      isFollowUp: function () {
        let isSupperAdmin = this.$store.getters.role_id === 0;
        if(this.detail.follow_up){
          return this.$store.getters.id == this.detail.follow_up.id || isSupperAdmin;
        }else{
          return isSupperAdmin;
        }
      }
    },
    created(){
      this.init();
    },
    methods:{
      init(){
        opportunityDetails({
          id: this.id,
        }).then(res => {
          if(res.code == 200){
             this.detail = res.res;
          }else{
            this.drawerVisible = false;
            this.$emit('detailClosed');
            this.$message({
              showClose: true,
              message: res.msg
            });
          }
        });
      },
      exchangeGovernment(){
        if(!this.isFollowUp){
          this.$message({
            showClose: true,
            message: "只有跟进人才能编辑"
          });
          return;
        }

        this.editForm = {
          id:this.detail.id,
          name:this.detail.name,
          mobile:this.detail.mobile,
          phone:this.detail.phone,
          email:this.detail.email,
          province_code:this.detail.province ? this.detail.province.code : '',
          city_code:this.detail.city ? this.detail.city.code : '',
          area_code:this.detail.area ? this.detail.area.code : '',
          address :this.detail.address,
          follow_up_id: this.detail.follow_up.id,
          old_address :this.detail.old_address,
          old_info_source :this.detail.old_info_source,
          old_type :this.detail.old_type,
          remarks:this.detail.remarks,
        };
        this.editDisplay = true;
      },
      deleteGovernment(){
        if(!this.isFollowUp){
          this.$message({
            showClose: true,
            message: "只有跟进人才能删除"
          });
          return;
        }
        
         deleteGovernment({
            id:this.detail.id,
         }).then(res=>{
            if (res.code == 200) {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
              this.$emit('detailDeleted');
            } else {
              this.$message({
                showClose: true,
                message: res.msg
              });
            }
         });
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      beforeLeave(activeName, oldActiveName){
        if(!this.isFollowUp && (activeName == "first" || activeName == "five")){
          this.$message({
            showClose: true,
            message: "只有跟进人才查看"
          });
          return false;
        }
        return true;
      },
      handleClose(done) {
        done();
      },
      onClosed:function() {
        this.$emit('detailClosed')
      },
      onAttachmentUploaded(){
        this.init();
      },
      onCommunicationed(){
        this.init();
      },
      onContactUpdated(){
        this.init();
      },
      addEnterpriseClose(){
        this.editDisplay = false;
        this.init();
      },
    }
  }
</script>

<style>
</style>
