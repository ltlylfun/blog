---
title: css中的新星，ai的宠儿——tailwind
pubDatetime: 2025-05-03T01:19:46.553Z
featured: true
draft: true
tags:
  - tailwind
  - css
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: Tailwind 是一种实用主义的原子 CSS 框架，它通过“类即样式”的方式提升开发效率，并避免样式冲突。
---

## Table of contents

## 首先讲讲样式冲突

样式冲突不是 React 独有的问题，而是 **所有使用 CSS 的前端框架或原生开发都会遇到的通用问题**。

---

这是因为 —— CSS 本身的特点：

- 是全局语言（默认作用于整个页面）
- 基于选择器匹配元素
- 有继承、优先级、层叠顺序
- 没有作用域（不像 JS 有块级作用域）

---

所以说：

- 样式冲突是 **CSS 的原生缺陷**
- React/Vue/Svelte 等框架只是在 **用不同的方式规避这个问题**

> 样式冲突是所有 Web 项目的通病，React 并不是引发样式冲突的原因，只是因为它自由度高，需要你更主动地去避免样式冲突。
