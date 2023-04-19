<template>
  <div style="height: calc(100vh - 180px)">
    <el-row :gutter="20" class="h-100">
      <el-col :span="4" class="h-100" style="overflow-y: scroll;">
        <el-menu default-active="/help/index/index" class="el-menu-vertical-demo" :router="true">
          <el-menu-item index="/help/index/index">
            <span slot="title">系统概述</span>
          </el-menu-item>
          <el-submenu index="/help/index/enterprise">
            <template slot="title">
              <span>客户管理</span>
            </template>
            <el-menu-item index="/help/index/enterprise">
              <span slot="title">企业管理</span>
            </el-menu-item>
            <el-menu-item index="/help/index/government">
              <span slot="title">政府管理</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/help/index/activity">
            <span slot="title">活动管理</span>
          </el-menu-item>
          <el-menu-item index="/help/index/information">
            <span slot="title">资讯管理</span>
          </el-menu-item>
          <el-menu-item index="/help/index/userLogs">
            <span slot="title">访客日志</span>
          </el-menu-item>
          <el-submenu index="/help/index/smsTemplate">
            <template slot="title">
              <span>系统管理</span>
            </template>
            <el-menu-item index="/help/index/smsTemplate">
              <span slot="title">短信模板</span>
            </el-menu-item>
            <el-menu-item index="/help/index/customField">
              <span slot="title">自定义字段</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="/help/index/admin">
            <template slot="title">
              <span>管理员</span>
            </template>
            <el-menu-item index="/help/index/admin">
              <span slot="title">管理员</span>
            </el-menu-item>
            <el-menu-item index="/help/index/role">
              <span slot="title">角色</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/help/index/faq">
            <span slot="title">常见问题</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20" class="h-100" style="overflow-y: scroll;">
        <router-view />
      </el-col>
    </el-row>
  </div>
</template>

<script>
</script>

<style>
</style>
