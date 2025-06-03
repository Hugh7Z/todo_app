/**
 * API配置文件
 * 集中管理所有API地址和相关配置
 */

import { getToken } from '../utils/auth';

// API基础URL - 可根据环境配置修改
export const API_BASE_URL = 'http://localhost:3001';

// 创建包含授权令牌的请求头
export const createAuthHeaders = () => {
  const token = getToken();
  return {
    ...API_CONFIG.HEADERS,
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Todo相关API端点
export const TODO_API = {
  GET_LIST: `${API_BASE_URL}/get_list`,
  ADD_LIST: `${API_BASE_URL}/add_list`,
  UPDATE_LIST: `${API_BASE_URL}/update_list`,
  DELETE_LIST: `${API_BASE_URL}/del_list`
};

// 用户认证相关API端点
export const AUTH_API = {
  // 注册接口
  REGISTER: `${API_BASE_URL}/login`,
  
  // 登录接口
  LOGIN: `${API_BASE_URL}/sign`,
  
  // 登出接口 - 待配置
  LOGOUT: `${API_BASE_URL}/logout`,
  
  // 获取用户信息接口 - 待配置
  GET_USER_INFO: `${API_BASE_URL}/user_info`
};

// API请求配置
export const API_CONFIG = {
  // 请求超时时间(毫秒)
  TIMEOUT: 10000,
  
  // 默认请求头
  HEADERS: {
    'Content-Type': 'application/json'
  }
};

/**
 * 接口配置说明:
 * 
 * 1. 注册接口(/login):
 *    - 方法: POST
 *    - 参数: { username: string, password: string, email?: string }
 *    - 响应: { success: boolean, message?: string, userId?: string, token?: string }
 * 
 * 2. 登录接口(/sign):
 *    - 方法: POST
 *    - 参数: { username: string, password: string }
 *    - 响应成功: { 
 *        success: true, 
 *        code: 200,
 *        message: '登录成功',
 *        token: string,        // JWT令牌
 *        userID: string,       // 用户ID
 *        userData: {           // 用户数据对象
 *          id: string,         // 用户ID
 *          username: string    // 用户名
 *        }
 *      }
 *    - 响应失败: {
 *        success: false,
 *        code: number,        // 400-参数错误, 401-密码错误, 404-用户不存在, 500-服务器错误
 *        message: string      // 错误说明
 *      }
 * 
 * 3. 登出接口(/logout):
 *    - 方法: POST
 *    - 参数: { token: string }
 *    - 响应: { success: boolean }
 * 
 * 4. 获取用户信息(/user_info):
 *    - 方法: GET
 *    - 参数: 请求头中包含 Authorization: Bearer {token}
 *    - 响应: { userId: string, username: string, email?: string, ... }
 */ 