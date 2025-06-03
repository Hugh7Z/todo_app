<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { login } from '../utils/auth';

// 路由实例
const router = useRouter();
const route = useRoute();

// 表单数据
const username = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);
const loginStatus = ref('');

// 登录方法
const handleLogin = async () => {
  // 清除之前的错误信息
  errorMsg.value = '';
  loginStatus.value = '';
  
  // 表单验证
  if (!username.value.trim()) {
    errorMsg.value = '请输入用户名';
    return;
  }
  
  if (!password.value.trim()) {
    errorMsg.value = '请输入密码';
    return;
  }
  
  try {
    isLoading.value = true;
    loginStatus.value = '正在登录...';
    console.log('开始登录请求，用户名:', username.value);
    
    // 调用登录函数
    const result = await login(username.value, password.value);
    console.log('登录结果:', result);
    
    if (result.success) {
      loginStatus.value = '登录成功，正在跳转...';
      console.log('登录成功，即将跳转到首页');
      // 登录成功后重定向到首页或指定的重定向页面
      const redirectPath = route.query.redirect || '/';
      router.push(redirectPath);
    }
  } catch (error) {
    console.error('登录失败', error);
    // 直接显示错误信息
    errorMsg.value = error.message || '登录失败，请稍后再试';
    loginStatus.value = '';
    alert(errorMsg.value); // 直接弹出错误信息
  } finally {
    isLoading.value = false;
  }
};

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register');
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">登录</h2>
      
      <!-- 错误信息提示 -->
      <div v-if="errorMsg" class="error-message">
        {{ errorMsg }}
      </div>
      
      <!-- 状态信息提示 -->
      <div v-if="loginStatus" class="status-message">
        {{ loginStatus }}
      </div>
      
      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            placeholder="请输入用户名"
            autocomplete="username"
          >
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="请输入密码"
            autocomplete="current-password"
          >
        </div>
        
        <button 
          type="submit" 
          class="login-btn" 
          :disabled="isLoading"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <!-- 注册链接 -->
      <div class="register-link">
        还没有账号？ <a href="#" @click.prevent="goToRegister">立即注册</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, rgb(113,65,168), rgba(44,114,251,1));
}

.login-box {
  width: 400px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.error-message {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

.status-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: 500;
  color: #666;
}

.form-group input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: rgb(113,65,168);
}

.login-btn {
  background: linear-gradient(to right, rgb(113,65,168), rgba(44,114,251,1));
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.login-btn:hover {
  opacity: 0.9;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-link a {
  color: rgb(113,65,168);
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}
</style> 