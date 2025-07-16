<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #6366f1;
  --primary-light: #818cf8;
  --primary-dark: #4f46e5;
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
  --danger-color: #ef4444;
  
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --bg-dark: #0f172a;
  
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --text-inverse: #ffffff;
  
  --border-color: #e2e8f0;
  --border-light: #f1f5f9;
  --border-dark: #cbd5e1;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  --transition-fast: 0.15s ease-out;
  --transition-normal: 0.25s ease-out;
  --transition-slow: 0.35s ease-out;
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-secondary);
  color: var(--text-primary);
  line-height: 1.6;
}

body {
  margin: 0;
  height: 100vh;
  font-feature-settings: 'cv11', 'ss01';
  font-variant-numeric: tabular-nums;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}

::-webkit-scrollbar-thumb {
  background: var(--border-dark);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* Element Plus 变量覆盖 */
.el-button {
  border-radius: var(--radius-md) !important;
  font-weight: 500 !important;
  transition: var(--transition-fast) !important;
}

.el-button--primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.el-button--primary:hover {
  background-color: var(--primary-light) !important;
  border-color: var(--primary-light) !important;
}

.el-card {
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--shadow-sm) !important;
  border-color: var(--border-color) !important;
}

.el-input__wrapper {
  border-radius: var(--radius-md) !important;
  box-shadow: var(--shadow-sm) !important;
  transition: var(--transition-fast) !important;
}

.el-collapse {
  border: none !important;
}

.el-collapse-item__header {
  background: var(--bg-primary) !important;
  border-radius: var(--radius-md) !important;
  margin-bottom: 8px !important;
  padding: 0 16px !important;
  font-weight: 500 !important;
  color: var(--text-primary) !important;
}

.el-collapse-item__content {
  padding: 0 !important;
  background: transparent !important;
}
</style>