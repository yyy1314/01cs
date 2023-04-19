import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout';

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {
    path: '/login', component: () => import('@/views/login/index'),
    hidden: true,
    name: 'login',
    meta: { title: '登陆', icon: 'icon_bangzhuwendang',permissions: [] }
  },
  { path: '*', redirect: '/404', hidden: true, meta: { title: '404',permissions: [] }},
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true,
    name: '404',
    meta: { title: '404', icon: 'icon_bangzhuwendang',permissions: [] }
  },
  {
    component: Layout, // ok
    redirect: '/index',
    path: '',
    hidden: false,
    meta: { id: 1 , title: '首页', icon: 'tree' ,permissions: []},
    children: [{
      path: 'index',
      name: 'index',
      meta: { title: '首页', icon: 'tree',permissions: [] },
      component: () => import('@/views/index/index'),
      hidden: false,
    }]
  },
  {
    path: '/enterprise',
    component: Layout,
    hidden: false,
    redirect: '/enterprise/index',
    meta: { title: '客户管理', icon: 'enterprise', id: 2 , permissions: ['member_unit_enterprise.index','member_unit_government.index']},
    children: [
      {
        path: '/enterprise/index',
        name: 'enterprise',
        component: () => import('@/views/enterprise/index'),
        hidden: false,
        meta: { title: '企业列表', icon: 'enterprise', permissions: ['member_unit_enterprise.index']}
      },
      {
        path: '/enterprise/publish',
        name: 'enterprisePublish',
        component: () => import('@/views/enterprise/publish'),
        hidden: false,
        meta: { title: '政府列表', icon: 'enterprise', permissions: ['member_unit_government.index']}
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: false,
    redirect: '/user/userCenter',
    meta: { title: '会员管理', icon: 'userManagement' ,permissions: ['user.index','vip_apply.index','vip.index','industry.index']},
    children: [
      {
        path: '/user/userCenter',
        name: 'userCenter',
        component: () => import('@/views/user/userCenter'),
        hidden: false,
        meta: { title: '会员中心', icon: 'userManagement',permissions: ['user.index'] }
      },
      {
        path: '/user/userDetails',
        name: 'userDetails',
        hidden: true,
        component: () => import('@/views/user/userDetails'),
        meta: { title: '用户详情',permissions: [] }
      },
      {
        path: '/user/userApply',
        name: 'userApply',
        component: () => import('@/views/user/userApply'),
        hidden: false,
        meta: { title: '会员申请', icon: 'tree',permissions: ['vip_apply.index'] }
      },
      {
        path: '/user/vip',
        name: 'vip',
        component: () => import('@/views/user/vip'),
        hidden: false,
        meta: { title: '会员等级', icon: 'memberGrade',permissions: ['vip.index'] }
      },
      {
        path: '/user/userIndustry',
        name: 'userIndustry',
        component: () => import('@/views/user/userIndustry'),
        hidden: false,
        meta: { title: '行业分类', icon: 'memberGrade',permissions: ['industry.index'] }
      }
    ]
  },
  {
    path: '/Information',
    component: Layout,
    hidden: false,
    redirect: '/Information/index',
    meta: { title: '资讯管理', icon: 'information',permissions: ['information.index','information_category.index'] },
    children: [
      {
        path: '/Information/index',
        name: 'InformationIndex',
        hidden: false,
        component: () => import('@/views/Information/index'),
        meta: { title: '资讯列表', icon: 'information',permissions: ['information.index'] }
      },
      {
        path: '/Information/details',
        name: 'InformationDetails',
        hidden: true,
        component: () => import('@/views/Information/details'),
        meta: { title: '资讯详情', icon: 'information',permissions: [] }
      },
      {
        path: '/Information/publish',
        name: 'InformationPublish',
        hidden: true,
        component: () => import('@/views/Information/publish'),
        meta: { title: '发布资讯', viceTitle: '编辑资讯',permissions: [] }
      },
      {
        path: '/Information/category',
        name: 'InformationCategory',
        hidden: false,
        component: () => import('@/views/Information/category'),
        meta: { title: '资讯分类', icon: 'classify',permissions: ['information_category.index'] }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    hidden: false,
    redirect: '/activity/index',
    meta: { title: '活动管理', icon: 'activity' ,permissions: ['activity.index','activity_join.index','activity_category.index']},
    children: [
      {
        path: '/activity/index',
        name: 'activityIndex',
        hidden: false,
        component: () => import('@/views/activity/index'),
        meta: { title: '活动列表', icon: 'activity' ,permissions: ['activity.index']}
      },
      {
        path: '/activity/order',
        name: 'activityOrder',
        hidden: false,
        component: () => import('@/views/activity/order'),
        meta: { title: '活动订单', icon: 'activity',permissions: ['activity_join.index'] }
      },
      {
        path: '/activity/publish',
        name: 'activityPublish',
        hidden: true,
        component: () => import('@/views/activity/publish'),
        meta: { title: '发布活动', viceTitle: '编辑活动',permissions: [] }
      },
      {
        path: '/activity/details',
        name: 'activityDetails',
        hidden: true,
        component: () => import('@/views/activity/details'),
        meta: { title: '活动详情' ,permissions: []}
      },
      {
        path: '/activity/orderDetails',
        name: 'activityOrderDetails',
        hidden: true,
        component: () => import('@/views/activity/orderDetails'),
        meta: { title: '订单详情',permissions: [] }
      },

      {
        path: '/activity/category',
        name: 'activityCategory',
        hidden: false,
        component: () => import('@/views/activity/category'),
        meta: { title: '活动分类', icon: 'classify',permissions: ['activity_category.index'] }
      }

    ]
  },
  // 资源 resource
  {
    path: '/resource',
    component: Layout,
    hidden: false,
    redirect: '/resource/index',
    meta: { title: '项目管理', icon: 'resource' ,permissions: ['resource.index','resource_join.index','resource_category.index']},
    children: [
      {
        path: '/resource/index',
        name: 'resourceIndex',
        hidden: false,
        component: () => import('@/views/resource/index'),
        meta: { title: '项目列表', icon: 'resource' ,permissions: ['resource.index']}
      },
      {
        path: '/resource/order',
        name: 'resourceOrder',
        component: () => import('@/views/resource/order'),
        hidden: false,
        meta: { title: '项目订单', icon: 'resource' ,permissions: ['resource_join.index']}
      },
      {
        path: '/resource/category',
        name: 'resourceCategory',
        component: () => import('@/views/resource/category'),
        hidden: false,
        meta: { title: '项目分类', icon: 'classify' ,permissions: ['resource_category.index']}
      },
      {
        path: '/resource/details',
        name: 'resourceDetails',
        hidden: true,
        component: () => import('@/views/resource/details'),
        meta: { title: '项目详情', icon: 'classify' ,permissions: []}
      },
      {
        path: '/resource/publish',
        name: 'resourcePublish',
        hidden: true,
        component: () => import('@/views/resource/publish'),
        meta: { title: '项目发布', viceTitle: '编辑资源' ,permissions: []}
      }
    ]
  },
  // 商城管理
  {
    path: '/goods',
    component: Layout,
    hidden: false,
    redirect: '/goods/index',
    meta: { title: '商城管理', icon: 'goods' ,permissions: ['goods.index','goods_order.index','goods_category.index']},
    children: [
      {
        path: '/goods/index',
        name: 'goodsIndex',
        hidden: false,
        component: () => import('@/views/goods/index'),
        meta: { title: '商品列表', icon: 'goods' ,permissions: ['goods.index']}
      },
      {
        path: '/goodsOrder/index',
        name: 'goodsOrderIndex',
        hidden: false,
        component: () => import('@/views/goodsOrder/index'),
        meta: { title: '商品订单', icon: 'goods' ,permissions: ['goods_order.index']}
      },
      {
        path: '/goods/details',
        name: 'goodsDetails',
        hidden: true,
        component: () => import('@/views/goods/details'),
        meta: { title: '商品详情', icon: 'goods' ,permissions: []}
      },
      {
        path: '/goods/publish',
        name: 'goodsPublish',
        hidden: true,
        component: () => import('@/views/goods/publish'),
        meta: { title: '商品发布', viceTitle: '编辑商品' ,permissions: []}
      },
      {
        path: '/goodsOrder/details',
        name: 'goodsOrder',
        hidden: true,
        component: () => import('@/views/goodsOrder/details'),
        meta: { title: '商品订单详情' ,permissions: []}
      },
      {
        path: '/goods/category',
        name: 'goodsCategory',
        hidden: false,
        component: () => import('@/views/goods/category'),
        meta: { title: '商品分类', icon: 'goods' ,permissions: ['goods_category.index']}
      }
    ]
  },
  {
    path: '/dynamic',
    component: Layout,
    hidden: false,
    redirect: '/dynamic/index',
    meta: { title: '动态管理', icon: 'goods' ,permissions: ['dynamic.index']},
    children: [
      {
        path: '/dynamic/index',
        name: 'dynamicIndex',
        hidden: false,
        component: () => import('@/views/dynamic/index'),
        meta: { title: '动态列表', icon: 'goods' ,permissions: ['dynamic.index']}
      }

    ]
  },
  {
    path: '/banner',
    component: Layout,
    hidden: false,
    redirect: '/banner/index',
    meta: { title: '内容管理', icon: 'banner' ,permissions: ['banner.index','banner.delete','register_serve_agreement','vip_explain']},
    children: [
      {
        path: '/banner/index',
        name: 'bannerIndex',
        hidden: false,
        component: () => import('@/views/banner/index'),
        meta: { title: '轮播图', icon: 'banner' ,permissions: ['banner.index','banner.delete']}
      },
      {
        path: '/other/registerServeAgreement',
        name: 'registerAgreement',
        hidden: false,
        component: () => import('@/views/other/registerServeAgreement'),
        meta: { title: '注册协议', icon: 'link' ,permissions: ['register_serve_agreement']}
      },
      {
        path: '/other/vipAgreement',
        name: 'vipAgreement',
        hidden: false,
        component: () => import('@/views/other/vipAgreement'),
        meta: { title: '入会须知', icon: 'link' ,permissions: ['vip_explain']}
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    hidden: false,
    redirect: '/statistics/userLogs',
    meta: { title: '统计分析', icon: 'link' ,permissions: []},
    children: [
      {
        path: 'userLogs',
        name: 'userLogs',
        hidden: false,
        component: () => import('@/views/statistics/UserLogs'),
        meta: { title: '访客日志', icon: 'link' ,permissions: []}
      },
    ]
  },
  {
    path: '/admin',
    component: Layout,
    hidden: false,
    redirect: '/admin/index',
    meta: { title: '管理员', icon: 'admin' ,permissions: ['admin.index','admin_log.index','role.index','role.edit']},
    children: [
      {
        path: '/roleManagement/index',
        name: 'roleManagementIndex',
        hidden: false,
        component: () => import('@/views/roleManagement/index'),
        meta: { title: '角色管理', icon: 'role' ,permissions: ['role.index','role.edit']}
      },
      {
        path: '/roleManagement/details',
        name: 'roleManagementDetails',
        hidden: true,
        component: () => import('@/views/roleManagement/details'),
        meta: { title: '新增角色', viceTitle: '编辑角色' ,permissions: []}
      },
      {
        path: 'index',
        name: 'adminIndex',
        hidden: false,
        component: () => import('@/views/admin/index'),
        meta: { title: '管理员', icon: 'admin' ,permissions: ['admin.index']}
      },
      {
        path: 'adminLog',
        name: 'adminLog',
        hidden: false,
        component: () => import('@/views/admin/adminLog'),
        meta: { title: '操作日志', icon: 'admin' ,permissions: ['admin_log.index']}
      }
    ]
  },

  // 系统管理
  {
    path: '/other',
    component: Layout,
    hidden: false,
    redirect: '/other/index',
    meta: { title: '系统管理', icon: 'role' ,permissions: ['sms_template.index','custom_field.index']},
    children: [
      {
        path: 'smsTemplateIndex',
        name: 'smsTemplateIndex',
        hidden: false,
        component: () => import('@/views/smsTemplate/index'),
        meta: { title: '短信模板', icon: 'link' ,permissions: ['sms_template.index']}
      },
      {
        path: 'customFieldIndex',
        name: 'customFieldIndex',
        hidden: false,
        component: () => import('@/views/CustomField/index'),
        meta: { title: '自定义字段', icon: 'link' ,permissions: ['custom_field.index']}
      }
    ]
  },

  {
    path: '/help',
    component: Layout,
    hidden: false,
    redirect: '/help/index/index',
    meta: { title: '帮助', icon: 'icon_bangzhuwendang' ,permissions: []},
    children: [
      {
        path: 'index',
        hidden: false,
        redirect: '/help/index/index',
        component: () => import('@/views/help/layout'),
        meta: { title: '帮助', icon: 'icon_bangzhuwendang' ,permissions: []},
        children:[
          {
            path: 'index',
            name: 'helpIndex',
            hidden: true,
            component: () => import('@/views/help/index'),
            meta: { title: '帮助首页', icon: 'icon_bangzhuwendang' ,permissions: []},
          },
          {
            path: 'enterprise',
            name: 'helpEnterprise',
            hidden: true,
            component: () => import('@/views/help/enterprise'),
            meta: { title: '企业管理', icon: 'icon_bangzhuwendang' ,permissions: []},
          },
          {
            path: 'government',
            name: 'helpGovernment',
            hidden: true,
            component: () => import('@/views/help/government'),
            meta: { title: '政府管理', icon: 'icon_bangzhuwendang' ,permissions: []},
          },
          {
            path: 'activity',
            name: 'helpActivity',
            hidden: true,
            component: () => import('@/views/help/activity'),
            meta: { title: '活动管理', icon: 'icon_bangzhuwendang' ,permissions: []},
          },
          {
            path: 'information',
            name: 'helpInformation',
            hidden: true,
            component: () => import('@/views/help/information'),
            meta: { title: '资讯管理', icon: 'icon_bangzhuwendang' ,permissions: []},
          },
          {
            path: 'userLogs',
            name: 'helpUserLogs',
            hidden: true,
            component: () => import('@/views/help/userLogs'),
            meta: { title: '访客日志', icon: 'icon_bangzhuwendang' ,permissions: []},
          },
          {
            path: 'role',
            name: 'helpRole',
            hidden: true,
            component: () => import('@/views/help/role'),
            meta: { title: '角色', icon: 'icon_bangzhuwendang' ,permissions: []},
          },
          {
            path: 'smsTemplate',
            name: 'helpSmsTemplate',
            hidden: true,
            component: () => import('@/views/help/smsTemplate'),
            meta: { title: '短信模板', icon: 'icon_bangzhuwendang' ,permissions: []},
          },
          {
            path: 'customField',
            name: 'helpCustomField',
            hidden: true,
            component: () => import('@/views/help/customField'),
            meta: { title: '自定义字段', icon: 'icon_bangzhuwendang' ,permissions: []},
          },
          {
            path: 'admin',
            name: 'helpAdmin',
            hidden: true,
            component: () => import('@/views/help/admin'),
            meta: { title: '管理员', icon: 'icon_bangzhuwendang' ,permissions: []},
          },
          {
            path: 'faq',
            name: 'helpFaq',
            hidden: true,
            component: () => import('@/views/help/faq'),
            meta: { title: '常见问题', icon: 'icon_bangzhuwendang' ,permissions: []},
          }
        ]
      }

    ]
  },

]



export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
