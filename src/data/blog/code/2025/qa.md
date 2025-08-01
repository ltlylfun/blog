---
title: 前端面试qa
pubDatetime: 2025-03-03T01:19:46.553Z
featured: false
draft: true
tags:
  - qa
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: 如题，前端面试qa
---

## Table of contents

## try-catch一般捕获什么错误，什么错误捕获不到

---

1.  try-catch 一般捕获什么错误？

- **同步代码中的运行时错误**（Runtime Error）：
  代码执行过程中抛出的异常，比如访问不存在的变量、调用未定义的方法、类型错误、语法错误之外的运行错误等。
  例如：

  ```js
  try {
    let a = b + 1; // b未定义，会抛ReferenceError
  } catch (e) {
    console.log("捕获错误:", e);
  }
  ```

- **手动抛出的错误**（throw new Error）：
  可以捕获你用 `throw` 主动抛出的异常。

---

2.  什么错误捕获不到？

- **异步代码中的错误（Promise 异常未处理）**
  如果异步代码里面的异常没有用 `await` 或 `.catch()` 来捕获，try-catch 是捕获不到的。
  例如：

  ```js
  try {
    setTimeout(() => {
      throw new Error("异步错误");
    }, 0);
  } catch (e) {
    // 这里捕获不到异步错误
  }
  ```

- **语法错误（SyntaxError）**
  语法错误是在代码解析阶段抛出的异常，try-catch 只能捕获运行时异常，无法捕获语法错误。

- **浏览器环境下的某些资源加载错误**（如图片加载失败）
  这种错误不会抛异常，无法用 try-catch 捕获，需要通过事件监听如 `onerror` 处理。

---

3.  额外补充

- **如何捕获异步错误？**
  - 对 `async/await`，try-catch 能捕获 `await` 的异步错误。
  - 对纯 Promise，需要用 `.catch()` 链式捕获，或者顶层捕获全局 `unhandledrejection` 事件。

- **全局错误捕获**
  浏览器可以用 `window.onerror` 或 `window.addEventListener('error', ...)` 来捕获未捕获的错误。

---

> “try-catch 主要用来捕获同步代码执行过程中的运行时异常和手动抛出的错误，不能捕获语法错误，也捕获不到异步回调里的异常，异步错误一般要用 Promise 的 catch 或 async/await 结合 try-catch 来处理。对于资源加载失败等错误，也需要通过其他事件机制来捕获。”

---

## window.onerror 或 window.addEventListener('error', ...)

1.  `window.onerror`

`window.onerror` 是浏览器提供的一个全局错误捕获事件处理函数，可以捕获同步JavaScript运行时的错误。它能捕获未被try-catch捕获的错误，并提供错误信息、出错文件、行列号等。

```js
window.onerror = function (message, source, lineno, colno, error) {
  // 处理错误逻辑
  return true; // 返回true阻止默认错误处理
};
```

参数说明

- `message`：错误信息（如 "Uncaught ReferenceError: x is not defined"）
- `source`：出错的文件URL（脚本URL）
- `lineno`：出错的行号
- `colno`：出错的列号
- `error`：Error对象（有些浏览器支持，可能为undefined）

特点

- 只能捕获同步代码的错误，异步错误（如Promise未捕获的异常）需要用其他方式捕获。
- IE9及以下版本和部分旧浏览器只支持4个参数，Error对象参数是在现代浏览器才支持。
- 返回`true`可以阻止浏览器默认的错误弹窗。
- 不能捕获跨域脚本错误（除非跨域脚本响应头设置了`Access-Control-Allow-Origin`），这时只会得到“Script error.”这个通用错误信息。

```js
window.onerror = function (message, source, lineno, colno, error) {
  console.log("捕获错误:", message);
  console.log("文件:", source);
  console.log("行号:", lineno, "列号:", colno);
  console.log("错误对象:", error);
  return true; // 阻止浏览器默认错误处理
};
```

---

2.  `window.addEventListener('error', handler)`

概述

通过事件监听机制监听`error`事件，能够捕获到更多类型的错误，包括资源加载错误（图片、脚本、样式等）。

```js
window.addEventListener("error", function (event) {
  // event 是 ErrorEvent 或者 Event
});
```

事件对象 `event` 属性说明

- `event.message`：错误信息（仅当捕获JS错误时存在）
- `event.filename`：出错文件
- `event.lineno`：出错行号
- `event.colno`：出错列号
- `event.error`：Error对象（通常存在）
- `event.target`：错误发生的元素，尤其是资源加载错误时是对应DOM元素（img, script, link等）
- `event.type`：事件类型，通常是 `"error"`

资源加载错误与JS运行错误区别

- **JS运行错误**：事件的`event.message`、`event.filename`、`event.lineno`等信息存在，`event.target`通常是`window`。
- **资源加载错误**：`event.message`为`undefined`，`event.target`是失败的资源元素（比如 `<img>`），且事件是捕获阶段（capture phase）触发的。

捕获资源加载错误的示例

```js
window.addEventListener(
  "error",
  function (event) {
    if (event.target && (event.target.src || event.target.href)) {
      console.log(
        "资源加载错误:",
        event.target.tagName,
        event.target.src || event.target.href
      );
    } else {
      console.log("JS错误:", event.message, "文件:", event.filename);
    }
  },
  true
); // 第三个参数true表示捕获阶段，必须这样才能捕获资源错误
```

- 对于资源加载错误，必须在捕获阶段（`useCapture = true`）监听，否则监听不到。
- 对比`window.onerror`，`addEventListener('error')`可以捕获资源加载失败，而`window.onerror`不会捕获资源加载错误。

---

3.  异步错误捕获

需要注意，以上两种方式都不能捕获Promise异步错误（比如未处理的Promise异常），异步错误需要监听`unhandledrejection`事件：

```js
window.addEventListener("unhandledrejection", function (event) {
  console.log("未捕获的Promise异常:", event.reason);
});
```

---

4.  总结对比

| 方式                                                 | 捕获同步JS错误 | 捕获资源加载错误 | 捕获异步Promise错误 | 是否阻止默认错误处理 |
| ---------------------------------------------------- | -------------- | ---------------- | ------------------- | -------------------- |
| `window.onerror`                                     | 是             | 否               | 否                  | 是（返回true）       |
| `window.addEventListener('error', ...)`              | 是             | 是（捕获阶段）   | 否                  | 是                   |
| `window.addEventListener('unhandledrejection', ...)` | 否             | 否               | 是                  | 是                   |

---

5.  示例整合

```js
window.onerror = function (message, source, lineno, colno, error) {
  console.log("window.onerror 捕获：", message, source, lineno, colno, error);
  return true;
};

window.addEventListener(
  "error",
  function (event) {
    if (event.target && (event.target.src || event.target.href)) {
      console.log(
        "资源加载错误：",
        event.target.tagName,
        event.target.src || event.target.href
      );
    } else {
      console.log(
        "JS错误事件捕获：",
        event.message,
        event.filename,
        event.lineno,
        event.colno
      );
    }
  },
  true
);

window.addEventListener("unhandledrejection", function (event) {
  console.log("Promise未处理错误:", event.reason);
});
```

## react key的作用 用index会产生什么影响

---

React 中的 `key` 是用于 **高效更新虚拟 DOM 的标识符**，它的作用和是否用 `index` 作为 `key` 有很大关系，下面为你详细解释。

---

`key` 的作用

在 React 渲染列表时，如：

```jsx
{
  items.map(item => <div key={item.id}>{item.text}</div>);
}
```

React 需要通过 `key` 来识别每一个组件的“身份”，以便：

- **判断哪些元素新增、删除或重新排序**
- **避免不必要的 DOM 操作，提高性能**
- **保持状态不被错误复用（如表单内容、动画状态等）**

---

用 `index` 作为 `key` 会产生的问题

虽然你可以写：

```jsx
{
  items.map((item, index) => <div key={index}>{item.text}</div>);
}
```

但这会导致如下问题：

1.  **组件状态错乱**

当你对列表进行 **插入、删除、排序** 时，`index` 是变化的，React 会错误地复用 DOM 元素。

```jsx
[
  { id: 1, name: "A" },
  { id: 2, name: "B" },
];
```

假设你删除了第一个元素：

```jsx
[{ id: 2, name: "B" }];
```

如果用 `index` 做 key，React 会把原来 index 为 1 的 DOM（B）当作新的 index 0 的 DOM（但其实是原来 A 的位置），**导致组件状态错乱**。

---

2.  **动画或输入框内容出错**

例如：

```jsx
{
  list.map((item, index) => <input key={index} defaultValue={item.name} />);
}
```

如果你中间插入或删除了某一项，React 会复用 DOM 节点，但 `defaultValue` 不会重新渲染，导致输入框显示错误的内容。

---

正确做法

- **使用唯一的、稳定的 ID 作为 key：**

```jsx
{
  items.map(item => <div key={item.id}>{item.text}</div>);
}
```
