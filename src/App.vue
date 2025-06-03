<script setup>
// App.vue现在只是一个路由容器
</script>

<template>
  <div class="app-container">
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<style>
/* 全局样式 */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
    "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background: linear-gradient(to right, rgb(113,65,168), rgba(44,114,251,1));
  overflow-x: hidden;
  width: 100%;
}

* {
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Todo样式 */
.todo {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 20px;
  background-color: white;
  border-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 100vh;
  overflow-x: hidden;
}

.todo-from {
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  align-items: stretch;
}

.input {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  outline: none;
  font-size: 16px;
  box-sizing: border-box;
  margin: 0;
}

.add-btn {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  background: linear-gradient(to right, rgb(113,65,168), rgba(44,114,251,1));
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
  transition: opacity 0.3s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.add-btn:hover {
  opacity: 0.9;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #4caf50;
}

.item.completed {
  background-color: #e8f5e9;
  border-left-color: #1b5e20;
}

.item.completed .name {
  text-decoration: line-through;
  color: #777;
}

.item div {
  display: flex;
  align-items: center;
}

.item input {
  margin-right: 10px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.del {
  color: #e53935;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all 0.2s;
  white-space: nowrap;
  min-width: 40px;
  text-align: center;
  flex-shrink: 0;
}

.del:hover {
  background-color: #ffebee;
}
</style>