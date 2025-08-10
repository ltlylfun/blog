---
title: 基于预取和预渲染的mpa网站优化
pubDatetime: 2025-05-24T01:19:46.553Z
featured: true
tags:
  - 优化
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: 这周实习学习了mpa网站优化经验，今天整理一下笔记。对于老旧网站，又觉得没必要大升级的，用这个方法很好，记录一下。
---

## Table of contents

## 前置知识

### intersection-observer-api

Intersection Observer API提供了一种异步检测目标元素与祖先元素或顶级文档的视口相交情况变化的方法。

具体用法：[MDN：Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)

### mpa

MPA 即“多页应用”。每次用户操作或跳转页面时，都会向服务器请求一个新的 HTML 页面，整个页面会刷新。

而SPA则是 是“单页应用”的缩写。其核心思想是整个网站/应用只有一个 HTML 页面，所有内容的切换和数据交互都通过 JavaScript 完成，页面不会整体刷新，而是通过局部渲染实现交互体验。

### prefetch

是指在后台推测性地获取用户未来可能访问的文档或子资源。如果用户选择导航到预取的页面，这可以显著减少加载时间。例如，预取可以用于取“下一页”按钮链接的页面或其子资源，或用户悬停的链接弹出窗口，或者是搜索结果。

prefetch 的“空闲时”是指 网络空闲（network idle）时，并不关心 JS 是否空闲。

### Speculation Rules API

Speculation Rules API是为了提升未来网页导航的速度而设计的。它主要针对网页的 URL，而不是特定的资源文件，所以更适合多页面应用（MPA），而不是单页面应用（SPA）。

### requestIdleCallback

浏览器提供的 API，用于在主线程空闲时执行低优先级任务。它允许开发者把一些不影响用户体验的操作推迟到浏览器空闲时进行，从而提升网页的性能和响应速度。

## 实现思路

```
用户访问页面
    ↓
等待浏览器空闲 (requestIdleCallback)，初始化脚本
    ↓
扫描页面所有 <a> 标签
    ↓
过滤链接
    ↓
为符合条件的链接创建 IntersectionObserver
    ↓
链接进入视口? ──No──→ 继续监听
    ↓ Yes
延迟等待（如果设置了 delay 参数）
    ↓
检查链接是否仍在视口内？──No──→ 停止处理该链接
    ↓
然后有两种优化方式:
    ├─ 预渲染（新的api，浏览器适配不好，不推荐）
    │   ↓
    │   检查 prerender 数量是否达到上限? ──Yes──→ 跳过
    │   ↓ No
    │   检查该 URL 是否已添加预渲染规则? ──Yes──→ 跳过
    │   ↓
    │   内部检查浏览器是否支持 Speculation Rules? ──No──→ 回退到 prefetch
    │   ↓ Yes
    │   生成 Speculation Rules JSON 配置
    │   ↓
    │   创建 <script type="speculationrules"> 元素
    │   ↓
    │   注入到 document.head
    │   ↓
    │   浏览器开始预渲染页面（完整渲染）
    │
    └─  预取
        ↓
        检查 prefetch 数量是否达到上限? ──Yes──→ 跳过
        ↓ No
        检查该 URL 是否已预抓取? ──Yes──→ 跳过
        ↓ No
        document.head.appendChild(link)，停止监控DOM元素
        ↓
        执行预抓取，缓存资源到浏览器



用户点击链接时:
├─ 预渲染成功的链接 → 瞬间显示 (极快)
├─ 预抓取成功的链接 → 快速加载 (快)
└─ 未处理的链接 → 正常加载 (慢)
```

## 实战检测

优化前
![prefetch-2](https://github.com/user-attachments/assets/98142862-5f9e-40bf-a171-12fac7fa1c67)

---

优化后
![prefetch-1](https://github.com/user-attachments/assets/79c15793-b47b-40df-b9c0-433a6af1763d)

可以看到，提升还是很明显的。
