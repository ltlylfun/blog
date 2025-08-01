---
title: react memo
pubDatetime: 2025-04-27T01:19:46.553Z
featured: false
tags:
  - react
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: React 的 diff 是“你写好文章后，编辑器比对前后差别，决定哪些句子要重写”，而 React.memo 是“看你用的资料有没有变，没变就直接复用上次写好的文章，连写都不写了”。
---

> React.memo 是用在「组件级别」的优化，避免组件不必要的重新渲染。

> useMemo 是用在「函数组件内部」的优化，避免某些计算在每次渲染时都重新执行，调用函数并缓存结果。

> useCallback 是用在「函数组件内部」的优化，避免每次渲染都重新创建函数引用，缓存函数本身。

> 如果你已经熟悉了 useMemo，你可能发现将 useCallback 视为以下内容会很有帮助：
>
> ```
> // 在 React 内部的简化实现
> function useCallback(fn, dependencies) {
>  return useMemo(() => fn, dependencies);
> }
> ```

## Table of contents

## react memo 优化了什么，react 不是有 diff 算法吗

确实，React 有强大的 **diff 算法（即 Virtual DOM 的比较和更新机制）**，但这并不意味着每次更新时都能做到“只更新真正需要的组件”。而 `React.memo` 就是在 **diff 之前** 提供了更早的“优化机会”。

---

> `React.memo` 是一个高阶组件，用来 **跳过函数组件的重新渲染**，**前提是 props 没有变化**。

---

## 那 React 的 diff 算法做了什么？

React 的 diff 算法会：

- 在更新阶段，构建新的 Virtual DOM；
- 将新旧 Virtual DOM 对比；
- 找出变化的部分，并最小化 DOM 操作。

但是：

> 如果父组件重新渲染，**子组件默认也会跟着重新执行函数组件体**，即使 props 没变。

这就是性能浪费的来源，特别是：

- 子组件计算过程复杂；
- 渲染量大；
- 渲染结果完全一样。

---

## React.memo 优化了什么？

它优化的是\*\*“是否要重新执行函数组件”\*\*这个问题。

- 没有 `React.memo`：
  - 父组件更新 → 子组件函数重新执行（哪怕 props 没变）

- 使用了 `React.memo`：
  - 父组件更新 → 检查 props 是否变化
    - 没变化 → 跳过函数执行，**直接复用上次渲染的结果**
    - 有变化 → 正常重新渲染

所以 `React.memo` 是**组件级别的浅比较缓存机制**。

---

## 举个例子：

```jsx
const Child = React.memo(({ name }) => {
  console.log("Child render");
  return <div>Hello {name}</div>;
});

function Parent() {
  const [count, setCount] = React.useState(0);
  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <Child name="Jee" />
    </>
  );
}
```

每次点击按钮时，**父组件重新渲染了**，但 `Child` 的 props 没变：

- 没用 `React.memo` → 会看到 `Child render` 打印
- 用了 `React.memo` → 控制台不会打印（跳过了函数执行）

---

## 补充疑问

## 父组件更新 → 子组件函数重新执行，不是会有 diff 决定复用吗，怎么还需要 memo

你的疑问非常关键，咱们来拆解这个过程，澄清误区 👇

## React 的 diff 确实会决定 DOM 是否复用

**React 的 diff 算法只在 Virtual DOM 层**判断：

> “这个 DOM 节点要不要更新？”

所以：

- React 会“重新执行函数组件”，生成新的 Virtual DOM；
- 然后把新旧 Virtual DOM 对比；
- 决定是不是要操作真实 DOM。

这意味着：

```tsx
function Child({ name }) {
  console.log("Child render");
  return <div>{name}</div>;
}
```

如果你没用 `React.memo`，只要父组件更新，**`Child` 函数就会重新执行一遍**，哪怕 `name` 没变，最后 Virtual DOM 是一样的，**React 仍然花了时间构造它并 diff 一次** —— 这就是性能浪费。

---

## ❗`React.memo` 的作用就是：连函数都别跑，直接复用旧结果

来看两种流程对比：

### 普通组件（没有 `memo`）

1. 父组件更新；
2. 子组件函数重新执行，生成新的 Virtual DOM；
3. React 比较旧的 Virtual DOM 和新的；
4. 发现一样，不更新 DOM —— 但函数已经跑了！

### 使用 `React.memo`

1. 父组件更新；
2. React 比较 `Child` 的 **props 是否有变化**（浅比较）；
3. 如果 props 没变，**跳过组件函数执行**，也不生成新的 Virtual DOM，也不触发 diff。

---

## 一个形象比喻：

> React 的 diff 是“你写好文章后，编辑器比对前后差别，决定哪些句子要重写”；
>
> 而 `React.memo` 是“看你用的资料有没有变，没变就直接复用上次写好的文章，连写都不写了”。

---

## 什么时候该用 `React.memo`

适合这些情况：

- 子组件渲染函数成本较高（比如有复杂计算）；
- props 很少变（或基本不会变）；
- 父组件频繁更新，但不希望影响子组件；
- 性能瓶颈场景，如列表、表格、图表等。

---

## 注意：不是越多用 `React.memo` 越好

- `memo` 有开销（会做浅比较）；
- props 变化频繁时，`memo` 反而多此一举；
- 比较对象类型（比如传了新的对象、函数），仍然会触发更新。
