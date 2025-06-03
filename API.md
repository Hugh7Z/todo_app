# Todo应用接口文档

## 基础信息
- 服务器地址：`http://8.141.0.186`
- 所有请求都需要在header中携带 `Content-Type: application/json`
- 需要认证的接口需要在header中携带 `Authorization: Bearer {token}`

## 认证相关接口

### 1. 用户注册
- 请求地址：`/login`
- 请求方法：POST
- 请求参数：
  ```json
  {
    "username": "用户名",
    "password": "密码",
    "email": "邮箱（可选）"
  }
  ```
- 响应示例：
  ```json
  {
    "success": true,
    "message": "注册成功"
  }
  ```

### 2. 用户登录
- 请求地址：`/sign`
- 请求方法：POST
- 请求参数：
  ```json
  {
    "username": "用户名",
    "password": "密码"
  }
  ```
- 响应示例：
  ```json
  {
    "success": true,
    "code": 200,
    "token": "JWT令牌",
    "userData": {
      "id": "用户ID",
      "username": "用户名"
    }
  }
  ```

### 3. 用户登出
- 请求地址：`/logout`
- 请求方法：POST
- 请求头：需要携带token
- 响应示例：
  ```json
  {
    "success": true,
    "message": "登出成功"
  }
  ```

## Todo相关接口

### 1. 获取待办事项列表
- 请求地址：`/get_list`
- 请求方法：GET
- 请求头：需要携带token
- 请求参数：
  ```
  userId: 用户ID
  ```
- 响应示例：
  ```json
  {
    "list": [
      {
        "id": "待办事项ID",
        "value": "待办事项内容",
        "isComplete": false,
        "userId": "用户ID"
      }
    ]
  }
  ```

### 2. 添加待办事项
- 请求地址：`/add_list`
- 请求方法：POST
- 请求头：需要携带token
- 请求参数：
  ```json
  {
    "value": "待办事项内容",
    "isComplete": false,
    "userId": "用户ID"
  }
  ```
- 响应示例：
  ```json
  {
    "success": true,
    "message": "添加成功"
  }
  ```

### 3. 更新待办事项状态
- 请求地址：`/update_list`
- 请求方法：POST
- 请求头：需要携带token
- 请求参数：
  ```json
  {
    "id": "待办事项ID",
    "isComplete": true,
    "userId": "用户ID"
  }
  ```
- 响应示例：
  ```json
  {
    "success": true,
    "message": "更新成功"
  }
  ```

### 4. 删除待办事项
- 请求地址：`/del_list`
- 请求方法：POST
- 请求头：需要携带token
- 请求参数：
  ```json
  {
    "id": "待办事项ID",
    "userId": "用户ID"
  }
  ```
- 响应示例：
  ```json
  {
    "success": true,
    "message": "删除成功"
  }
  ``` 