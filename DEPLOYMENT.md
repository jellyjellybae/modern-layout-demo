# 部署说明

## GitHub Pages 自动部署

这个项目已经配置了GitHub Actions自动部署到GitHub Pages。

### 设置步骤

1. **推送代码到GitHub仓库**
   ```bash
   git add .
   git commit -m "Update GitHub Actions deployment configuration"
   git push origin main
   ```

2. **启用GitHub Pages**
   - 进入你的GitHub仓库
   - 点击 Settings 标签
   - 在左侧菜单找到 Pages
   - 在 Source 下选择 "GitHub Actions"
   - 保存设置

3. **访问你的网站**
   - 部署完成后，你的网站将在以下地址可用：
   - `https://[你的用户名].github.io/modern-layout-demo/`

### 工作流程

- 每次推送到 `main` 或 `master` 分支时，GitHub Actions会自动：
  - 安装依赖 (pnpm)
  - 构建项目
  - 部署到GitHub Pages
- 也可以在Actions页面手动触发部署

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

### 故障排除

如果部署失败，请检查：

1. **仓库设置**
   - 确保在Settings > Pages中选择了"GitHub Actions"作为源
   - 确保仓库是公开的（或者你有GitHub Pro账户）

2. **权限问题**
   - GitHub Actions配置已包含必要的权限设置
   - 如果仍有问题，检查仓库的Actions权限设置

3. **构建错误**
   - 查看Actions页面的构建日志
   - 确保所有依赖都正确安装
   - 检查TypeScript类型错误

4. **路径配置**
   - 确保 `vite.config.ts` 中的 base 路径与仓库名称匹配
   - 当前配置为 `/modern-layout-demo/`

### 手动触发部署

你可以在GitHub仓库的Actions页面手动触发部署，无需推送代码。