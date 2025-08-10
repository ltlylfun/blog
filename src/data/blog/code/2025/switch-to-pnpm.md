---
title: 聊聊pnpm
pubDatetime: 2025-08-10T01:19:46.553Z
featured: false
draft: false
tags:
  - npm
  - pnpm
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: 今天刷到pnpm更新的帖子，顺便把项目的包管理工具从 npm 切换到了 pnpm。
---

pnpm 代表 performant（高性能的） npm。

## Table of contents

## pnpm官网对pnpm的描述是：

1. 快速 pnpm：比 npm 快 2 倍

2. 高效：node_modules 内的文件是从单个内容可寻址存储克隆或硬链接的

3. 支持 monorepos：pnpm 内置了对存储库中多个包的支持

4. 严格：pnpm 默认创建了一个非平铺的 node_modules，因此代码无法访问任意包

## 在最新10.14 版本新增对 JavaScript 运行时安装的支持

你可以在 package.json 里的 devEngines.runtime 字段声明 Node.js、Deno 或 Bun，pnpm 会自动下载并锁定对应版本。

用法示例：

```json
{
  "devEngines": {
    "runtime": {
      "name": "node",
      "version": "^24.4.0",
      "onFail": "download" // 目前仅支持 "download" 这个值
    }
  }
}
```

工作原理：

1. pnpm install 会根据你指定的版本范围，解析出符合条件的最新运行时版本。

1. 确切的版本号和校验和会保存到锁文件中。

1. 运行脚本时会使用本地安装的运行时，确保环境一致性。

这样做的优势：

1. 新设置支持 Node.js、Deno 和 Bun，区别于之前仅支持 Node 的 useNodeVersion 和 executionEnv.nodeVersion。

1. 支持版本范围，而不仅仅是固定版本号。

1. 解析得到的具体版本及完整性校验存储在 pnpm 锁文件中，确保将来能验证 Node.js 内容的有效性。

1. 该设置可以在任何工作区项目中使用（类似 executionEnv.nodeVersion），允许工作区内不同项目使用不同的运行时。

1. 目前 devEngines.runtime 会将运行时安装在本地，后续版本 pnpm 会改进为使用电脑上的共享位置。

## 迁移到 pnpm 的步骤指南

首先，全局安装 pnpm

你可以通过运行以下命令来全局安装 pnpm：

```bash
npm install -g pnpm
```

---

### 迁移步骤

1.  清理项目

删除 `node_modules` 目录和 `package-lock.json` 文件。这一步很重要，可以确保不会有 npm 遗留的文件影响 pnpm 的使用。

```bash
rm -rf node_modules package-lock.json
```

2.  初始化 pnpm

在你的项目目录下运行以下命令初始化 pnpm：

```bash
pnpm install
```

该命令会创建一个 `pnpm-lock.yaml` 文件，并安装 `package.json` 中列出的所有依赖。

3.  验证依赖安装情况

通过运行：

```bash
pnpm list
```

检查所有依赖是否正确安装。该命令会列出所有已安装的依赖及其版本，确保没有缺失或过期的包。

---

### 更新脚本

1.  更新 npm 脚本

在你的 `package.json` 中，将任何涉及 npm 的脚本替换为 pnpm。

2.  更新 CI/CD 流水线

如果你的项目使用 CI/CD（如 GitHub Actions），确保构建脚本及安装命令都改为使用 pnpm。

---

这也是我第一次项目使用pnpm，不出意外以后就有p选p了:)
