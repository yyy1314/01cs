<template>
  <el-scrollbar wrap-class="scrollbar-wrapper" class="sidebarWrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#1783C6"
      text-color="#fff"
      active-text-color="#fff"
      border-bottom-width="1px"
    >
      <div class="log">
        <img src="@/assets/Logo.jpg" class="logoImg">
        <div class="text">中旅联</div>
        <div class="text">{{name}}</div>
      </div>

      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';
import {getMyMenus} from '@/api/role.js';
import grant from '@/utils/grant.js';
const collect = require('collect.js');

export default {
  components: { SidebarItem },
  data: function () {
    return {
      routes: []
    }
  },
  created() {
    grant.isSuperUser = this.$store.getters.role_id === 0;
    grant.permissions = this.$store.getters.permissions;
    this.routes = Object.assign([],this.$router.options.routes);
    this.routes.forEach((route,index)=>{
        if(route.hidden == false && route.meta.permissions.length > 0 && !grant.hasAnyAccess(route.meta.permissions)){
          this.$set(route,'hidden',true);
        }else if(route.hidden == true){
          this.$set(route,'hidden',true);
        }else{
          this.$set(route,'hidden',false);
        }
        if(route.children){
          route.children.forEach((cRoute,cIndex)=>{
            if(cRoute.hidden == false && cRoute.meta.permissions.length > 0 && !grant.hasAnyAccess(cRoute.meta.permissions)){
              this.$set(cRoute,'hidden',true);
            }else if(cRoute.hidden == true){
              this.$set(cRoute,'hidden',true);
            }else{
              this.$set(cRoute,'hidden',false);
            }
          });
        }
    });
  },
  computed: {
    ...mapGetters([
      'sidebar','name'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss" >
  .sidebarWrapper .menu-wrapper{
    border-bottom:1px solid #3391CC;
  }
  .sidebarWrapper .menu-wrapper .el-submenu__title i{
    color:#fff
  }
  .sidebarWrapper {
      .log {
        .logoImg{
          display: block;
          width:80px;
          margin:10px auto;
        };
        .text{
          font-size: 14px;
          line-height: 22px;
          text-align: center;
          color:#fff;
        }
      }
  }
</style>
