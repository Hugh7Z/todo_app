import { createRouter, createWebHistory } from 'vue-router';
import { isLoggedIn } from './utils/auth';

// 导入组件
const TodoApp = () => import('./components/TodoApp.vue');
const Login = () => import('./components/Login.vue');
const Register = () => import('./components/Register.vue');

// 路由配置
const routes = [
  {
    path: '/',
    component: TodoApp,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  // 重定向未匹配的路径到登录页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫，检查身份验证状态
router.beforeEach((to, from, next) => {
  // 检查路由是否需要身份验证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果需要身份验证且用户未登录，重定向到登录页面
    if (!isLoggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      // 用户已登录，允许访问
      next();
    }
  } else {
    // 路由不需要身份验证，允许访问
    next();
  }
});

export default router; 