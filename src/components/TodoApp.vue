<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { getUserData, logout, getToken } from '../utils/auth';
import { TODO_API, createAuthHeaders } from '../config/api';

// 获取路由实例
const router = useRouter();

// 用户数据
const userData = ref(getUserData() || {});
const value = ref('');
const list = ref([]);
const errorMessage = ref('');

// 页面加载时获取待办事项
onMounted(() => {
  if (userData.value && userData.value.id) {
    getList();
  } else {
    errorMessage.value = '用户信息不完整，请重新登录';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }
});

// 获取待办事项列表
async function getList() {
  try {
    const res = await axios({
      url: TODO_API.GET_LIST,
      method: "GET",
      headers: createAuthHeaders(),
      params: {
        userId: userData.value.id // 添加用户ID作为查询参数
      }
    });

    list.value = res.data.list || [];
  } catch (error) {
    console.error('获取待办事项失败:', error);
    errorMessage.value = '获取待办事项失败，请稍后再试';
  }
}

// 添加待办事项
async function add() {
  if (!value.value.trim()) {
    errorMessage.value = '待办事项内容不能为空';
    return;
  }
  
  try {
    await axios({
      url: TODO_API.ADD_LIST,
      method: "POST",
      headers: createAuthHeaders(),
      data: {
        value: value.value,
        isComplete: false,
        userId: userData.value.id // 添加用户ID
      }
    });

    getList();
    value.value = '';
    errorMessage.value = '';
  } catch (error) {
    console.error('添加待办事项失败:', error);
    errorMessage.value = '添加待办事项失败，请稍后再试';
  }
}

// 更新待办事项状态
async function update(id) {
  try {
    const todo = list.value.find(item => item._id === id);
    if (!todo) {
      errorMessage.value = '待办事项不存在';
      return;
    }

    await axios({
      url: TODO_API.UPDATE_LIST,
      method: "POST",
      headers: createAuthHeaders(),
      data: {
        id: id,
        isComplete: !todo.isComplete,
        userId: userData.value.id
      }
    });
    
    getList();
    errorMessage.value = '';
  } catch (error) {
    console.error('更新待办事项状态失败:', error);
    errorMessage.value = '更新待办事项状态失败，请稍后再试';
  }
}

// 删除待办事项
async function del(id) {
  try {
    await axios({
      url: TODO_API.DELETE_LIST,
      method: "POST",
      headers: createAuthHeaders(),
      data: {
        id: id,
        userId: userData.value.id // 添加用户ID
      }
    });

    getList();
    errorMessage.value = '';
  } catch (error) {
    console.error('删除待办事项失败:', error);
    errorMessage.value = '删除待办事项失败，请稍后再试';
  }
}

// 处理用户登出
async function handleLogout() {
  try {
    await logout();
    // 使用路由跳转到登录页面
    router.push('/login');
  } catch (error) {
    console.error('登出失败:', error);
  }
}
</script>

<template>
  <div class="todo">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="title">My Todo</div>
      <div class="user-info">
        <span v-if="userData.username" class="username">{{ userData.username }}</span>
        <button @click="handleLogout" class="logout-btn">登出</button>
      </div>
    </div>
    
    <!-- 错误信息显示 -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    
    <!-- 添加待办事项 -->
    <div class="todo-from">
      <input 
        v-model="value" 
        type="text" 
        class="input" 
        placeholder="添加新的待办事项"
        @keyup.enter="add"
      >
      <button @click="add" class="add-btn">添加</button>
    </div>
    
    <!-- 待办事项列表 -->
    <div class="box">
      <div v-if="list.length === 0" class="empty-list">
        暂无待办事项，快来添加吧！
      </div>
      <div 
        v-for="item in list" 
        :key="item._id"
        :class="[item.isComplete ? 'item completed' : 'item']"
      >
        <div>
          <input 
            @click="update(item._id)" 
            v-model="item.isComplete" 
            type="checkbox"
          >
          <span class="name">{{ item.value }}</span>
        </div>
        <div @click="del(item._id)" class="del">Del</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-weight: 500;
  color: #333;
}

.logout-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.logout-btn:hover {
  background:rgb(249, 247, 247);
  color: #333;
}

.error-message {
  background-color: #faf7f8;
  color: #d32f2f;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  text-align: center;
}

.empty-list {
  text-align: center;
  padding: 20px;
  color: #777;
  font-style: italic;
}

/* 添加这些样式确保长文本自动换行 */
.name {
  word-break: break-all; /* 允许在任意字符间断行 */
  overflow-wrap: break-word; /* 确保长词会被打断 */
  max-width: 100%; /* 确保不会超出父容器 */
}

.item {
  word-break: break-all;
  overflow-wrap: break-word;
}

.box {
  width: 100%;
  overflow-wrap: break-word;
}

.todo-from {
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  align-items: center;
}

.input {
  flex: 1;
  height: 55px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 30px 0 0 30px;
  outline: none;
  font-size: 16px;
  box-sizing: border-box;
  margin: 0;
  vertical-align: middle;
}

.add-btn {
  height: 55px;
  padding: 0 20px;
  background: linear-gradient(to right, rgb(113,65,168), rgba(44,114,251,1));
  color: white;
  border: none;
  border-radius: 0 30px 30px 0;
  cursor: pointer;
  font-size: 16px;
  transition: opacity 0.3s;
  white-space: nowrap;
  margin: 0;
  vertical-align: middle;
}

.add-btn:hover {
  opacity: 0.9;
}
</style> 