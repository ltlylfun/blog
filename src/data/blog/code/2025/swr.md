---
title: 用于数据请求的 React Hooks 库——SWR
pubDatetime: 2025-08-15T01:19:46.553Z
featured: false
draft: false
tags:
  - swr
  - 每月推荐GitHub库
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: “SWR” 这个名字来自于 stale-while-revalidate：一种由 HTTP RFC 5861(opens in a new tab) 推广的 HTTP 缓存失效策略。这种策略首先从缓存中返回数据（过期的），同时发送 fetch 请求（重新验证），最后得到最新数据。
---

[![SWR](https://assets.vercel.com/image/upload/v1572289618/swr/banner.png)](https://swr.vercel.app)

<div style="display:flex;justify-content:center;gap:8px;flex-wrap:wrap;">
  <a aria-label="Vercel logo" href="https://vercel.com">
    <img src="https://badgen.net/badge/icon/Made%20by%20Vercel?icon=zeit&label&color=black&labelColor=black">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/swr">
    <img alt="" src="https://badgen.net/npm/v/swr">
  </a>
  <a aria-label="Package size" href="https://bundlephobia.com/result?p=swr">
    <img alt="" src="https://badgen.net/bundlephobia/minzip/swr">
  </a>
  <a aria-label="License" href="https://github.com/vercel/swr/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/swr">
  </a>
</div>

---

## Table of contents

## SWR介绍

SWR 是一个用于数据获取的 React Hooks 库。

**SWR** 来自于 `stale-while-revalidate`，这是一种由 [HTTP RFC 5861](https://tools.ietf.org/html/rfc5861) 推广的缓存失效策略。  
**SWR** 会先返回缓存中的数据（stale，可能是旧数据），然后发送请求进行重新验证（revalidate），最后再返回最新的数据。

只需一个 Hook，就能显著简化你项目中的数据获取逻辑。它在**速度**、**正确性**和**稳定性**等各方面都做了覆盖，帮助你构建更好的用户体验：

- **快速**、**轻量**且**可复用**的数据获取
- 与传输方式和协议无关
- 内置**缓存**与请求去重
- **实时**体验
- 页面聚焦时自动重新验证
- 网络恢复时自动重新验证
- 支持轮询
- 分页与滚动位置恢复
- 支持 SSR 与 SSG
- 本地数据修改（乐观 UI）
- 内置智能错误重试
- TypeScript 支持
- React Suspense
- React Native 支持

...以及更多功能。

使用 SWR，组件将会**持续且自动地接收到数据更新流**，因此 UI 将始终保持**快速**且**响应及时**。

**查看完整文档和示例请访问 [swr.vercel.app](https://swr.vercel.app)。**

---

## 浏览器的缓存机制介绍

浏览器缓存是指浏览器在本地存储部分网络资源，以减少网络请求、加快页面加载速度、减轻服务器压力的一种机制。合理利用缓存可以大幅提升前端性能和用户体验。

### 1. 强缓存

- **原理**：浏览器判断资源是否可用，无需与服务器通信，直接使用本地缓存。
- **常用响应头**：
  - `Expires`：绝对过期时间（HTTP/1.0，已不推荐）。
  - `Cache-Control: max-age=xxx`：相对过期时间（HTTP/1.1，推荐）。
- **特点**：
  - 在有效期内，资源直接从本地获取，不会发送请求到服务器。
  - 优先级高于协商缓存。

### 2. 协商缓存

- **原理**：浏览器每次向服务器请求资源时，带上标识（如`If-Modified-Since`、`If-None-Match`），服务器判断资源是否有更新。
- **常用响应头**：
  - `Last-Modified` / `If-Modified-Since`
  - `ETag` / `If-None-Match`
- **特点**：
  - 如果资源未修改，服务器返回 `304 Not Modified`，浏览器使用本地缓存。
  - 如果资源已修改，服务器返回新资源及 `200 OK`。

---

### 流程图

<img width="2088" height="3840" alt="814" src="https://github.com/user-attachments/assets/ce111109-62c5-4771-bc11-e866802da437" />

## 两者并不冲突，互为补充

浏览器缓存机制的局限性：

1. **粒度较粗**：主要针对“资源”（如图片、脚本、接口响应），很难灵活管理单个 API 的数据缓存策略。
2. **控制权有限**：需要后端配合设置缓存头，前端无法细粒度控制缓存失效、刷新、同步等逻辑。
3. **不适合动态数据**：大部分 API 数据频繁变化，浏览器缓存机制默认不会缓存 POST 请求，GET 请求也常常因无合适缓存头而不缓存。
4. **缺乏数据同步**：多组件/多页面间的数据同步和共享能力较弱。
5. **无自动刷新和重验证**：无法实现数据“失效重验证”（stale-while-revalidate）、定时刷新、页面聚焦时自动刷新等业务需求。

---

- **浏览器缓存**适合“资源级别”的缓存，如静态文件、图片等，配置简单但控制粒度粗。
- **SWR 等应用层缓存**适合“数据级别”的缓存，灵活、强大、易于集成复杂业务场景。

可以“搭配使用”：静态资源用浏览器缓存，动态数据用 SWR 这类应用层缓存，充分发挥各自优势。

---
