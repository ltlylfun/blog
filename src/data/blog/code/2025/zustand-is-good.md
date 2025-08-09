---
title: zustand-别因为它可爱就忽视它，它有爪子！
pubDatetime: 2025-05-01T01:19:46.553Z
featured: true
draft: true
tags:
  - react
  - zustand
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: 如果页面中有 3 个组件都要访问和更新同一份数据，你会怎么做？Zustand 就是为了解决这种「跨组件共享状态」的需求，而且比 Redux 更轻、写法更自然。别因为它可爱就忽视它，它有爪子！
---

![bear](https://github.com/user-attachments/assets/fca84985-e547-4a1e-b47b-b82226b29f49)
[![Star History Chart](https://api.star-history.com/svg?repos=pmndrs/zustand&type=Date)](https://www.star-history.com/#pmndrs/zustand&Date)

Zustand 是一个轻量级、无样板代码的状态管理库，用函数创建 store，不需要 context provider。

最大特点：

1. 状态写法像原生 JS，维护成本低
2. 不需要 Redux 的 Provider
3. 可组合中间件，比如持久化、调试工具
4. 精细组件订阅，性能好
5. 支持异步、可拆分模块

---

## Table of contents

## Zustand 的基础用法

我们先手写一个最最最简单的 Zustand 用法对比 `useState`。

---

### 创建一个 store

```js
// store/counter.js
import { create } from "zustand";

const useCounterStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}));
```

- `useCounterStore()` 是一个 hook。
- 里面有一个 `count`，还有一个更新用的 `increment()` 方法。
- 类似 `useState` + `setCount`，但作用域是全局的！

---

### 在任意组件中使用

```jsx
import useCounterStore from "./store/counter";

function Counter() {
  const count = useCounterStore(state => state.count);
  const increment = useCounterStore(state => state.increment);

  return <button onClick={increment}>Count: {count}</button>;
}
```

Zustand 会追踪你用了哪些字段（这里是 `count`），**只在这些字段变化时重新渲染组件**。

---

1. Zustand 是通过 `create()` 创建 store。
2. 返回的 store 是一个 hook（如 `useCounterStore`）。
3. 在组件中通过 `useStore((state) => state.xxx)` 读取和订阅状态。
4. 不用再手动写 `Context Provider` 了。

---

## Selector 优化技巧

```tsx
// 好的方式（避免不必要重渲染）
const count = useStore(state => state.count);
const increment = useStore(state => state.increment);
```

> Zustand 是按订阅字段粒度更新的，不是整个 store 改了就重渲。**只要你 selector 精准，就不会重渲。**

但这里还可以进一步优化！

---

## `useShallow` 提高对象选择的性能

当你从 store 中一次性读取多个字段，并用对象包裹返回时，每次 render selector 都会返回一个新对象（引用变了），哪怕字段值没变，React 也会重新渲染组件。

```ts
const { count, name } = useStore(state => ({
  count: state.count,
  name: state.name,
}));
```

上面这个 selector 每次返回的新对象 { count, name } 都是新引用。React 会认为你选的值变了，从而导致组件更新。

解决方案：

```ts
import { useShallow } from "zustand/react/shallow";

const { count, increment } = useStore(
  useShallow(state => ({
    count: state.count,
    increment: state.increment,
  }))
);
```

> useShallow(fn) 就是 useStore(fn, shallow) 的简洁写法，主要用于提升组件性能，避免 selector 返回新对象导致多余渲染。

---

## 中间件

Zustand 它「极简但可扩展」。

常用中间件：

1. **devtools**：开发者工具调试
2. **persist**：持久化存储到 localStorage
3. **subscribeWithSelector**：优化监听某些字段
4. **immer**：用 immer 管理不可变更新

示例：

```ts
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const useStore = create(
  devtools(
    persist(
      set => ({
        count: 0,
        increment: () => set(state => ({ count: state.count + 1 })),
      }),
      { name: "my-zustand-store" }
    )
  )
);
```

## Zustand 本质是一个「状态容器」+「订阅系统」

Zustand 的核心实现可以分为两个层次：

---

## 【A】store 本体（脱离 React 的状态管理）

Zustand 内部的 `createStore()` 返回一个完整的状态容器，具备以下核心 API：

```ts
type StoreApi<T> = {
  setState: (
    partial: Partial<T> | ((state: T) => Partial<T>),
    replace?: boolean
  ) => void;
  getState: () => T;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
};
```

### 核心函数分析：

#### `setState`

状态更新的函数，支持直接赋值或函数式更新：

```ts
store.setState({ count: 1 });
store.setState(state => ({ count: state.count + 1 }));
```

Zustand 在内部用 `Object.assign()` 合并状态，如果传入了 `replace: true`，就会替换整个对象。

---

#### `getState`

就是直接返回当前状态对象：

```ts
const state = store.getState();
```

---

#### `subscribe`

订阅状态变化的监听器，当 `setState` 被调用时，会遍历所有监听器并执行：

```ts
const unsubscribe = store.subscribe((newState, prevState) => {
  console.log("状态变了！", newState);
});
```

这个机制**类似 Redux 的 `store.subscribe()`**，但更轻量。

---

### 状态变更时发生了什么？

1. `setState` 被调用
2. 状态合并 / 替换
3. 所有 `subscribe()` 注册的回调被触发
4. 每个回调检查 selector 是否变更，若变了就触发 React 更新

---

## 【B】React 层绑定（useStore）

Zustand 提供 `create()` 返回一个“带 React hook 的 store”：

```ts
const useStore = create((set, get) => ({
  count: 0,
  increase: () => set(s => ({ count: s.count + 1 })),
}));
```

这个 `useStore` 是一个自定义 React Hook，它的底层实现用了：

```ts
useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

这是 React 18 推荐的官方方式，能确保：

- 状态更新时只通知“用到这部分状态”的组件
- 并发渲染下保证一致性（Concurrent Mode 安全）

---

## useStore 的完整执行流程：

```txt
组件中调用 useStore(selector)
↓
useSyncExternalStore 订阅 store 的变化（store.subscribe）
↓
Zustand 内部记录上一次 selector 的值
↓
当状态变化时，调用 selector 再次获取值
↓
做 shallowEqual 比较，值有变化就触发组件更新
```

---

## 中间件实现原理

Zustand 的中间件是函数式嵌套结构：

```ts
export const useStore = create(
  devtools(
    persist(
      immer(set => ({
        count: 0,
        inc: () => set(s => ({ count: s.count + 1 })),
      }))
    )
  )
);
```

每个中间件都包裹了原始 `createStore(set, get)`，可以劫持、增强 `set`, `get`, `subscribe`。

### 比如 persist 做了什么？

- 劫持 `setState`，将新状态保存到 localStorage
- 初始化时尝试从 storage 中读取数据，恢复状态
- 订阅状态变化，每次变化自动存入 storage

---
