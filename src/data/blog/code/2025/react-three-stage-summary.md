---
title: react渲染的三个阶段总结
pubDatetime: 2025-07-25T01:19:46.553Z
featured: false
tags:
  - react
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: 简单总结一下react的调度器，协调器，渲染器。
---

Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入 Reconciler

Reconciler（协调器）—— 负责找出变化的组件

Renderer（渲染器）—— 负责将变化的组件渲染到页面上

## Table of contents

## 调度阶段（Scheduling Phase）

### 由谁负责？

**Scheduler（调度器）**

### 做什么？

- **决定哪些更新要执行、什么时候执行、用什么优先级执行**
- 允许打断长任务（时间切片）
- 支持任务并发、延迟渲染等高级特性

### 举个例子：

- 用户点击按钮 → 触发 `setState` → 交给调度器调度
- 如果用户正在输入，调度器可能 **先渲染输入内容**，**稍后再渲染大型图表**

---

## **渲染阶段 / 协调阶段（Render / Reconciliation Phase）**

### 由谁负责？

**Reconciler（协调器）**

### 做什么？

- 构建当前组件的 **Fiber Tree**
- **比较新旧 Fiber Tree**（Diff）
- 找出哪些地方需要更新
- 为这些更新 **打上标记（flag）**：插入、更新、删除
- 收集成一个 **effect list（副作用列表）**

### 举个例子：

- `<h1>Hello</h1>` 改成 `<h1>Hi</h1>`
- 协调器发现 `<h1>` 类型一样，只内容变了 → 加 `Update` flag

### 特点：

- **不会实际操作 DOM**
- 支持中断（支持并发模式）
- 构建新的一棵工作 Fiber Tree

---

## **提交阶段（Commit Phase）**

### 由谁负责？

**Renderer（渲染器）**

### 做什么？

- 遍历 **effect list**
- 对每个标记执行真实的 UI 更新：
  - 插入节点（Placement）
  - 更新属性或内容（Update）
  - 移除节点（Deletion）
  - 执行 `useEffect`（PassiveEffect）

### 特点：

- **这一步不可中断**
- 真正操作 DOM、原生控件或 WebGL（取决于平台）
- 会触发副作用（如 `useEffect`）

---

## 总结对比表

| 阶段              | 由谁执行   | 作用                         | 是否可中断  | 是否操作 DOM   |
| ----------------- | ---------- | ---------------------------- | ----------- | -------------- |
| **调度阶段**      | Scheduler  | 安排任务优先级与执行顺序     | ✅ 支持     | ❌ 不操作      |
| **渲染/协调阶段** | Reconciler | 构建 Fiber 树 + 计算更新差异 | ✅ 支持     | ❌ 不操作      |
| **提交阶段**      | Renderer   | 应用变更（DOM/原生）和副作用 | ❌ 不可中断 | ✅ 真正操作 UI |

---

## 举个完整流程的例子：

```jsx
function App() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Click {count}</button>;
}
```

- 点击按钮 → `setCount()` → **进入调度阶段**
- 调度器说：“高优先级任务，马上执行” → **进入协调阶段**
- 构建新的 Fiber 树，发现 `count` 改变 → 标记 `Update`
- 收集成 effect list → 进入 **提交阶段**
- 真实 DOM `<button>` 内容改为 `Click 1`

---

## 补充 diff 算法

## 为什么需要 Diff 算法？

直接比较两棵 DOM 树的差异，时间复杂度是 `O(n^3)`，非常昂贵。React 通过**做出一些假设**，把这个问题从 O(n^3) 降低到 O(n)，极大提升性能。

---

## 核心思想：三个假设优化

React 的 Diff 算法不是通用的 tree diff，而是基于以下 **三条策略性假设**：

1. **同层比较**：只比较同一层级的节点，不跨层比较。
2. **不同类型节点，直接替换**：如果两个元素类型不同（如 `<div>` 和 `<span>`），直接销毁旧节点，创建新节点。
3. **通过 key 优化列表对比**：列表结构中使用 `key` 属性优化重排、插入、删除等操作。

---

## Diff 算法的三个部分

### 一、节点类型的比较（元素层级）

```jsx
<div>123</div>
↓
<span>123</span>
```

- 类型不同：直接删除旧节点，挂载新节点。

### 二、同类型节点的属性变化（属性层级）

```jsx
<div className="a" />
↓
<div className="b" />
```

- 类型相同：保留 DOM 节点，仅修改属性。

### 三、子节点的比较（子树层级）

这是最复杂也最关键的部分，尤其是**列表 diff**。

---

## 子节点 diff 的两种情况

### 1. 子节点是普通元素（如 `div`, `p`）

按顺序逐个对比（浅层遍历）：

```jsx
<ul>
  <li>1</li>
  <li>2</li>
</ul>
↓
<ul>
  <li>1</li>
  <li>3</li>
</ul>
```

React 会逐个对比 `<li>` 节点，并发现第 2 个有变化。

---

### 2. 子节点是列表（多个同级元素）

为了优化列表重排，React 要求列表元素提供 `key`：

```jsx
[
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" },
].map(item => <li key={item.id}>{item.name}</li>);
```

#### 如果没有 `key`：

React 默认按索引比较，会引发 **重渲染** 和 **状态错乱**。

#### 如果有 `key`：

React 使用 key 建立旧节点的映射表（Map），找到复用目标。

👇 例子：

```jsx
// 旧列表
<li key="A">A</li>
<li key="B">B</li>
<li key="C">C</li>

// 新列表
<li key="B">B</li>
<li key="A">A</li>
<li key="D">D</li>
```

React 处理步骤：

1. `B` 找到复用 → 保留
2. `A` 找到复用 → 保留
3. `D` 没有旧节点 → 创建
4. `C` 不在新列表中 → 删除

---

## 总结流程图

```
                旧虚拟DOM树
                        ↓
                与新虚拟DOM树比较
                        ↓
        ┌─────────类型不同─────────┐
        ↓                         ↓
    直接替换                类型相同 → 属性对比
                                    ↓
                          子节点 diff（key优化）
                                    ↓
                        生成 effect list（最小更新集）
                                    ↓
                         提交阶段：更新真实 DOM
```

---

## 小结一句话：

> React 的 Diff 算法通过“只比较同层级节点”、“不同类型直接替换”、“使用 key 提升列表对比效率”，将 DOM diff 的性能复杂度从 O(n^3) 降低为 O(n)，实现了高效的 UI 更新。
