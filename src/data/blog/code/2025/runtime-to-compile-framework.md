---
title: 从“运行时框架”转向“编译时框架”
pubDatetime: 2025-07-18T01:19:46.553Z
featured: true
tags:
  - react
  - solidjs
  - vue
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: 虚拟 DOM 是过去十年最聪明的折中方案，而 SolidJS 展示了下一代 UI 框架的可能性。
---

很早之前就听过 solidjs，说什么抛弃使用 Virtual DOM，编译时转为原生 DOM 操作（无虚拟 DOM），速度很快，但碍于生态不是很强，就一直没看。

最近看到消息，Vue 3.6 alpha 抛弃了虚拟 dom，我就又立马想到了 solidjs。

react一直都是虚拟dom。

那就先聊一下 react 为什么使用虚拟 dom。

google一下：

React 使用虚拟 DOM（Virtual DOM），**是为了实现声明式编程方式下对真实 DOM 的高效更新**。这并不是因为虚拟 DOM 本身更快，而是因为它更“可控”、更“方便”，能在性能和开发体验之间取得平衡。

下面我们从多个角度来解释：

---

## Table of contents

## 什么是虚拟 DOM？

虚拟 DOM 是用 JavaScript 对象描述真实 DOM 的一种抽象表示。例如：

```js
const vdom = {
  type: "div",
  props: {
    children: "Hello World",
  },
};
```

每次组件更新时，React 会重新生成一棵新的虚拟 DOM 树，然后与上一次的虚拟 DOM 做 **diff**，找出变更的最小集，最后再应用到真实 DOM 上。

---

## 尤雨溪的关于react虚拟dom的回答

> 作者：尤雨溪
> 链接：https://www.zhihu.com/question/31809713/answer/53544875

### 原生 DOM 操作 vs. 通过框架封装操作。

这是一个性能 vs. 可维护性的取舍。框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快，因为框架的 DOM 操作层需要应对任何上层 API 可能产生的操作，它的实现必须是普适的。针对任何一个 benchmark，我都可以写出比任何框架更快的手动优化，但是那有什么意义呢？在构建一个实际应用的时候，你难道为每一个地方都去做手动优化吗？出于可维护性的考虑，这显然不可能。框架给你的保证是，你在不需要手动优化的情况下，我依然可以给你提供过得去的性能。

### 对 React 的 Virtual DOM 的误解。

React 从来没有说过 “React 比原生操作 DOM 快”。React 的基本思维模式是每次有变动就整个重新渲染整个应用。如果没有 Virtual DOM，简单来想就是直接重置 innerHTML。很多人都没有意识到，在一个大型列表所有数据都变了的情况下，重置 innerHTML 其实是一个还算合理的操作... 真正的问题是在 “全部重新渲染” 的思维模式下，即使只有一行数据变了，它也需要重置整个 innerHTML，这时候显然就有大量的浪费。

我们可以比较一下 innerHTML vs. Virtual DOM 的重绘性能消耗：

- innerHTML: render html string O(template size) + 重新创建所有 DOM 元素 O(DOM size)

- Virtual DOM: render Virtual DOM + diff O(template size) + 必要的 DOM 更新 O(DOM change)

Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是！它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。可以看到，innerHTML 的总计算量不管是 js 计算还是 DOM 操作都是和整个界面的大小相关，但 Virtual DOM 的计算量里面，只有 js 计算和界面大小相关，DOM 操作是和数据的变动量相关的。前面说了，和 DOM 操作比起来，js 计算是极其便宜的。这才是为什么要有 Virtual DOM：它保证了

1. 不管你的数据变化多少，每次重绘的性能都可以接受；

2. 你依然可以用类似 innerHTML 的思路去写你的应用。

---

## React 的设计目标：声明式 UI

React 设计之初的目标是：

> **你只需要声明 UI 应该长什么样，React 会负责更新 UI**

这叫做“声明式编程”：

```jsx
// 声明式：React
<button disabled={isLoading}>Submit</button>;

// 命令式：原生 JS
if (isLoading) {
  button.setAttribute("disabled", true);
} else {
  button.removeAttribute("disabled");
}
```

为了实现这种开发模式，又能保证性能，React 引入了 **虚拟 DOM + diff 算法 + 批量更新机制**。

---

## 虚拟 DOM 的三大作用

| 功能          | 描述                                                          |
| ------------- | ------------------------------------------------------------- |
| ✅ 提供抽象层 | 把复杂 DOM 操作隐藏在底层，开发者只管数据和组件               |
| ✅ 高效更新   | 通过 diff 算法找出变化最小部分，避免整个页面重绘              |
| ✅ 跨平台渲染 | 可以把虚拟 DOM 渲染成 Web、原生、Canvas 等（如 React Native） |

---

## 更新流程简图

```txt
组件状态变化
     ↓
重新执行函数组件 → 生成新 Virtual DOM
     ↓
与旧 Virtual DOM 对比（Diff 算法）
     ↓
找出差异 → 更新真实 DOM（最小化 DOM 操作）
```

---

## 虚拟 DOM 不等于最快

- 虚拟 DOM 的 diff 和重新构建本身也有性能开销
- 在更新频繁的小组件中，不如 “**编译时 + 响应式依赖追踪**”（如 SolidJS）

---

## 那么 solidjs 呢

> **React 使用虚拟 DOM 是为了在“声明式 UI 编程”与“真实 DOM 更新性能”之间找到一个高效的平衡点。**

**既然 SolidJS 没有虚拟 DOM，那它直接操作真实 DOM，会不会也面临 React 当初试图解决的那些问题？比如频繁 DOM 更新的性能问题，以及手动 DOM 操作带来的维护难题？**

Google了一下，答案是：

---

## SolidJS 没有这些问题，**因为它“自动、精准、响应式地”操作真实 DOM**

也就是说：

> **SolidJS 直接操作真实 DOM，但不是像 jQuery 那样“手动”操作，而是通过编译和响应式系统，做到自动 + 精准 + 可维护。**

---

## 问题 a. 频繁更新导致性能问题

### React 的问题：

React 的函数组件每次更新都会重新执行，生成一整棵新的虚拟 DOM，再 diff。虽然避免了直接频繁 DOM 操作，但仍然会带来一定的计算开销和不必要的子树更新。

### SolidJS 的解决方案：

**SolidJS 不重新执行整个组件，也不 diff 整个树**。

它依赖于“Signal”（响应式原子），当你调用 `count()` 时，SolidJS 追踪了这个依赖，并只在 `count` 改变时更新对应的 DOM：

```js
const [count, setCount] = createSignal(0);
<h1>{count()}</h1>;
```

👉 编译后是类似这样的原生 DOM 操作：

```js
const h1 = document.createElement("h1");
h1.textContent = count(); // 初始化

createEffect(() => {
  h1.textContent = count(); // 当 count 变化时才执行
});
```

✔ 所以 **只在真正需要更新的地方操作真实 DOM，避免了频繁无用更新**，比虚拟 DOM 更精准、更高效。

---

## 问题 b. 手动操作 DOM 维护困难，状态难同步

### React 的问题：

手动管理 DOM 难以保持 UI 与状态同步一致，所以 React 引入了虚拟 DOM + hooks +声明式 UI。

### SolidJS 的解决方案：

**SolidJS 用响应式系统替你“自动”管理 DOM 和状态的映射关系**：

- 状态变化 → 精准更新绑定的 DOM
- 所有副作用（如 createEffect）都追踪依赖，不需要你手动指定依赖项（React useEffect 的痛点）

```js
// SolidJS
const [name, setName] = createSignal("Jee");
createEffect(() => {
  console.log("Hello,", name()); // name 改变时才执行
});
```

✔ 所以 **Solid 依旧是声明式的，而不是 imperative（命令式）手动操作 DOM**。你只管声明 UI 应该长什么样，它帮你自动处理响应式绑定。

> SolidJS 虽然直接操作真实 DOM，但它靠响应式系统和编译优化，既避免了频繁无用的更新（性能问题），又实现了可维护、状态驱动的 UI（开发体验不差）。所以并没有落入 React 当初避免的那些“坑”。

## 这么一看，不是完爆虚拟 dom 吗

说得没错，**从性能角度来看，SolidJS 的细粒度响应式 + 编译时优化，确实在很多场景下「完爆虚拟 DOM」**。但如果我们从更全面的角度来看，还不能轻易下结论说「虚拟 DOM 已死」，原因如下：

---

## 一、为什么 SolidJS 性能更强？

确实，它解决了虚拟 DOM 的几个核心痛点：

| React (虚拟 DOM)                     | SolidJS (无虚拟 DOM)                  |
| ------------------------------------ | ------------------------------------- |
| 函数组件每次更新都会重新执行整个函数 | 函数只执行一次，依赖变化才局部更新    |
| Virtual DOM 要 diff 整棵树           | 自动追踪依赖，直接更新目标 DOM        |
| useEffect 手动列依赖，可能出错       | createEffect 自动追踪依赖，天然无 bug |
| 更新粒度是组件                       | 更新粒度是 signal 用到的具体 DOM      |

所以 SolidJS 更像 “**编译器 + 响应式运行时的结合体**”，是技术进步的代表。

---

## 二、那虚拟 DOM 还有啥用？react不是g了吗。

其实不然

### 1. 方便跨平台

- React 支持跨平台渲染（React Native、React Three Fiber 等）
- 虚拟 DOM 能适配不同渲染目标（Web、Canvas、Native）

---

### 2.得益于fiber

无虚拟dom不具备 React Concurrent Mode 中的调度能力、优先级中断、延迟渲染等特性。

也就是说react可能相对慢，但不太会卡。

---

### 3.只需等待,React Compiler

React Compiler 是 React 团队正在开发的一个革命性工具，目标是让 React 开发「更快、更自动、更易用」，它将彻底改变使用 useState、useEffect、useMemo 的方式。

React Compiler 让你写普通代码，React 自动“编译优化”成高性能代码，省去手动依赖管理。

---

> “虚拟 DOM 是过去十年最聪明的折中方案，而 SolidJS 展示了下一代 UI 框架的可能性。”

立个小计划，年末学习一下solidjs，开个小项目
