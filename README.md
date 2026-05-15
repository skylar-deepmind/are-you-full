# 撑了么

「撑了么」是一个移动端优先的 WebApp，用来记录每天每顿饭的饱腹程度。它强调本地隐私、轻量记录和温和的视觉体验，适合直接加到 iPhone 主屏幕当作小工具使用。

欢迎使用：https://areufull.netlify.app/

## 技术栈

- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- DaisyUI
- Pinia
- Vue Router
- vite-plugin-pwa
- localStorage（通过 repository 封装）

## 功能列表

- 今日餐次记录
- 历史记录按日期分组查看
- 统计页范围切换与趋势图
- 本地 JSON 导出
- 本地 JSON 导入
- 清空全部数据并二次确认
- PWA 安装与离线缓存

## 本地开发

```sh
pnpm install
pnpm dev
```

## 构建

```sh
pnpm build
```

## PWA 说明

- 已接入 `vite-plugin-pwa`
- 支持安装到主屏幕
- 支持静态资源离线缓存
- manifest 已配置为 `standalone`

## 数据隐私

- 所有记录默认只保存在本机浏览器
- 不需要账号
- 不会主动上传饮食数据
- 导入导出均为本地文件操作

## 目录结构

```txt
src/
├── assets/styles/   # 全局样式与主题变量
├── components/      # 可复用组件
├── constants/       # 常量定义
├── repositories/    # localStorage 数据持久化
├── stores/          # Pinia 全局状态
├── types/           # TypeScript 类型
├── utils/           # 纯函数工具
└── views/           # 页面组装
```

## 后续计划

- 增强图表与统计表达
- 补充更细的导入导出提示
- 优化触感反馈与交互细节（有趣的ui）
- 继续完善 PWA 安装体验,(app图标)
- 增加更多数据备份与恢复辅助能力
- 增加反馈途径？
