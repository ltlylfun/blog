---
title: 前端优化——主要是集中在response，idle与loading，js计算与dom绘制
pubDatetime: 2025-08-31T01:19:46.553Z
featured: true
tags:
  - 优化
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: 回顾了一下做过的项目，三句话简单总结一下，记录一下优化心得。
---

在网络传输、js执行和dom渲染上，降低耗时、减少阻塞，让页面快而流畅。

## Table of contents

## 三句话总结

- Response => 减少请求、压缩与传输优化、缓存优化。=>目标：缩短资源获取时间，尽快进入渲染阶段。

- Idle & Loading => 懒加载、预加载、任务调度。=>目标：合理平衡空闲时间（Idle）和加载时间（Loading），保证关键交互流畅。不要空闲时无事，加载时集中加载造成阻塞。

- JS 计算 & DOM 绘制=> js计算减少dom绘制，异步、web woker减少阻塞。=>目标：js计算相比dom绘制是廉价的，通过js减少渲染开销，让页面流畅不卡顿。其次异步js，降低 JS 对线程的阻塞。
