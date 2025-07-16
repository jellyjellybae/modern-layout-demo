# 部署说明

## GitHub Pages 自动部署

这个项目已经配置了GitHub Actions自动部署到GitHub Pages。

### 设置步骤

1. **推送代码到GitHub仓库**
   ```bash
   git add .
   git commit -m "Add GitHub Actions deployment"
   git push origin main
   ```

2. **启用GitHub Pages**
   - 进入你的GitHub仓库
   - 点击 Settings 标签
   - 在左侧菜单找到 Pages
   - 在 Source 下选择 "Deploy from a branch"
   - 选择 `gh-pages` 分支和 `/ (root)` 文件夹
   - 点击 Save

3. **访问你的网站**
   - 部署完成后，你的网站将在以下地址可用：
   - `https://[你的用户名].github.io/vue-layout-builder/`

### 工作流程

- 每次推送到 `main` 分支时，GitHub Actions会自动：
  - 安装依赖 (pnpm)
  - 进行类型检查
  - 运行代码检查 (lint)
  - 构建项目
  - 部署到GitHub Pages

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run dev

# 构建生产版本
pnpm run build

# 预览构建结果
pnpm run preview
```

### 注意事项

- 确保仓库名称与 `vite.config.ts` 中的 base 路径匹配
- 如果仓库名称不是 `vue-layout-builder`，请更新 `vite.config.ts` 中的 base 配置