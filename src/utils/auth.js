
/**
 * 认证工具
 * 处理用户登录状态和token管理
 */

import axios from 'axios';
import { AUTH_API, API_CONFIG } from '../config/api';

// 本地存储键名
const TOKEN_KEY = 'todo_auth_token';
const USER_KEY = 'todo_user_data';

// 保存Token到本地存储
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// 从本地存储获取Token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// 删除本地存储的Token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// 保存用户信息到本地存储
export const saveUserData = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

// 从本地存储获取用户信息
export const getUserData = () => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

// 删除本地存储的用户信息
export const removeUserData = () => {
  localStorage.removeItem(USER_KEY);
};

// 检查用户是否已登录
export const isLoggedIn = () => {
  return !!getToken();
};

// 用户注册
export const register = async (username, password, email = '') => {
  try {
    console.log('注册请求参数:', { username, password, email });
    console.log('注册请求URL:', AUTH_API.REGISTER);
    
    const response = await axios.post(AUTH_API.REGISTER, {
      username,
      password,
      email
    }, {
      headers: API_CONFIG.HEADERS,
      timeout: API_CONFIG.TIMEOUT
    });
    
    console.log('注册API响应数据:', response.data);
    
    if (response.data.success) {
      return { success: true, message: '注册成功' };
    } else {
      throw new Error(response.data.message || '注册失败');
    }
  } catch (error) {
    console.error('注册请求出错:', error);
    if (error.response) {
      // 服务器响应了错误状态码
      console.error('错误状态码:', error.response.status);
      console.error('错误数据:', error.response.data);
      throw new Error(error.response.data.message || `注册失败 (${error.response.status})`);
    } else if (error.request) {
      // 请求发出但没有收到响应
      console.error('未收到响应:', error.request);
      throw new Error('服务器无响应，请检查网络连接');
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message);
      throw new Error('注册请求配置错误');
    }
  }
};

// 用户登录
export const login = async (username, password) => {
  try {
    console.log('登录请求参数:', { username, password });
    
    // 发送登录请求到后端API
    const response = await axios.post(AUTH_API.LOGIN, {
      username,
      password
    }, {
      headers: API_CONFIG.HEADERS
    });
    
    console.log('API响应数据:', response.data);
    
    // 检查登录是否成功
    if (response.data.success && response.data.code === 200) {
      // 从响应中提取必要的数据
      const { token, userID, userData } = response.data;
      
      // 保存登录状态
      saveToken(token);
      saveUserData(userData);
      
      return {
        success: true,
        token,
        userData,
        message: response.data.message || '登录成功'
      };
    } else {
      // 如果响应中有错误信息则直接抛出
      throw new Error(response.data.message || '登录失败');
    }
  } catch (error) {
    console.error('登录请求出错:', error);
    
    // 如果有服务器返回的错误信息，直接显示
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      const errorMessage = errorData.message || '服务器响应错误';
      throw new Error(errorMessage);
    }
    
    // 其他错误情况
    throw new Error(error.message || '登录失败，请检查网络连接');
  }
};

// 用户登出
export const logout = async () => {
  try {
    // 调用登出API
    await axios.post(AUTH_API.LOGOUT, {
      token: getToken()
    }, {
      headers: API_CONFIG.HEADERS
    });
  } catch (error) {
    console.error('API登出失败', error);
  } finally {
    // 无论API调用是否成功，都清除本地存储
    removeToken();
    removeUserData();
    return { success: true };
  }
};

// 获取当前用户信息
export const fetchUserInfo = async () => {
  if (!isLoggedIn()) {
    return null;
  }
  
  try {
    const response = await axios.get(AUTH_API.GET_USER_INFO, {
      headers: {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (response.data) {
      return response.data;
    } else {
      throw new Error('获取用户信息失败');
    }
  } catch (error) {
    console.error('获取用户信息失败', error);
    return getUserData();
  }
}; 