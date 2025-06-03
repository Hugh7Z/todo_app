<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '../utils/auth';

// 路由实例
const router = useRouter();

// 表单数据
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const email = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

// 注册方法
const handleRegister = async () => {
  // 清除之前的错误信息
  errorMsg.value = '';
  
  // 表单验证
  if (!username.value.trim()) {
    errorMsg.value = '请输入用户名';
    return;
  }
  
  if (!password.value.trim()) {
    errorMsg.value = '请输入密码';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    errorMsg.value = '两次输入的密码不一致';
    return;
  }
  
  if (email.value && !validateEmail(email.value)) {
    errorMsg.value = '请输入有效的邮箱地址';
    return;
  }
  
  try {
    isLoading.value = true;
    
    // 调用注册函数
    const result = await register(username.value, password.value, email.value);
    
    if (result.success) {
      // 注册成功后跳转到登录页面
      alert('注册成功，请登录');
      router.push('/login');
    }
  } catch (error) {
    console.error('注册失败', error);
    errorMsg.value = error.message || '注册失败，请稍后再试';
  } finally {
    isLoading.value = false;
  }
};

// 验证邮箱格式
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <h2 class="title">注册</h2>
      
      <!-- 错误信息提示 -->
      <div v-if="errorMsg" class="error-message">
        {{ errorMsg }}
      </div>
      
      <!-- 注册表单 -->
      <form @submit.prevent="handleRegister" class="register-form">
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
          <label for="email">邮箱 (选填)</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="请输入邮箱"
            autocomplete="email"
          >
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="请输入密码"
            autocomplete="new-password"
          >
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input 
            id="confirmPassword" 
            v-model="confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            autocomplete="new-password"
          >
        </div>
        
        <button 
          type="submit" 
          class="register-btn" 
          :disabled="isLoading"
        >
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <!-- 登录链接 -->
      <div class="login-link">
        已有账号？ <a href="#" @click.prevent="goToLogin">立即登录</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, rgb(113,65,168), rgba(44,114,251,1));
}

.register-box {
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

.register-form {
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

.register-btn {
  background: linear-gradient(to right, rgb(113,65,168), rgba(44,114,251,1));
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.register-btn:hover {
  opacity: 0.9;
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: rgb(113,65,168);
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}
</style> 