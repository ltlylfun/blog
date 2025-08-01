---
title: js数组方法
pubDatetime: 2023-10-22T01:19:46.553Z
featured: false
draft: true
tags:
  - js
  - notes
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: 按“是否改变原数组”分类，含常用方法和代码示例
---

## Table of contents

## 一、不改变原数组的方法

### 1. `map()`

对数组每一项执行函数，返回新数组。

```js
const arr = [1, 2, 3];
const doubled = arr.map(x => x * 2); // [2, 4, 6]
```

### 2. `filter()`

过滤符合条件的元素，返回新数组。

```js
const arr = [1, 2, 3, 4];
const even = arr.filter(x => x % 2 === 0); // [2, 4]
```

### 3. `reduce()`

累加/计算数组，返回单一值。

```js
const arr = [1, 2, 3];
const sum = arr.reduce((acc, cur) => acc + cur, 0); // 6
```

### 4. `concat()`

连接两个或多个数组，返回新数组。

```js
const arr1 = [1, 2];
const arr2 = [3, 4];
const result = arr1.concat(arr2); // [1, 2, 3, 4]
```

### 5. `slice()`

截取数组的一部分，返回新数组。

```js
const arr = [1, 2, 3, 4];
const part = arr.slice(1, 3); // [2, 3]
```

### 6. `includes()`

判断数组是否包含某元素，返回布尔值。

```js
const arr = [1, 2, 3];
arr.includes(2); // true
```

### 7. `find()`

返回第一个符合条件的元素。

```js
const arr = [1, 2, 3, 4];
const found = arr.find(x => x > 2); // 3
```

### 8. `findIndex()`

返回第一个符合条件的元素索引。

```js
const arr = [1, 2, 3, 4];
const idx = arr.findIndex(x => x > 2); // 2
```

### 9. `join()`

将数组元素合并为字符串。

```js
const arr = ["a", "b", "c"];
const str = arr.join("-"); // "a-b-c"
```

### 10. `every()`

所有元素都满足条件时返回 true。

```js
const arr = [2, 4, 6];
arr.every(x => x % 2 === 0); // true
```

### 11. `some()`

有任一元素满足条件时返回 true。

```js
const arr = [1, 3, 4];
arr.some(x => x % 2 === 0); // true
```

---

## 二、改变原数组的方法

### 1. `push()`

在数组末尾添加元素，返回新长度。

```js
const arr = [1, 2];
arr.push(3); // arr: [1, 2, 3]
```

### 2. `pop()`

移除数组末尾元素，返回被移除的元素。

```js
const arr = [1, 2, 3];
arr.pop(); // 3, arr: [1, 2]
```

### 3. `shift()`

移除数组头部元素，返回被移除的元素。

```js
const arr = [1, 2, 3];
arr.shift(); // 1, arr: [2, 3]
```

### 4. `unshift()`

在数组头部添加元素，返回新长度。

```js
const arr = [2, 3];
arr.unshift(1); // 3, arr: [1, 2, 3]
```

### 5. `splice()`

可增删改数组内容，返回被删除的元素数组。

```js
const arr = [1, 2, 3, 4];
// 删除
arr.splice(1, 2); // [2, 3], arr: [1, 4]
// 插入
arr.splice(1, 0, 5, 6); // [], arr: [1, 5, 6, 4]
```

### 6. `reverse()`

反转数组元素顺序。

```js
const arr = [1, 2, 3];
arr.reverse(); // [3, 2, 1]
```

### 7. `sort()`

对数组进行排序。

```js
const arr = [3, 1, 2];
arr.sort(); // [1, 2, 3]
```

### 8. `fill()`

用固定值填充数组。

```js
const arr = [1, 2, 3];
arr.fill(0); // [0, 0, 0]
```

### 9. `copyWithin()`

数组内元素复制到指定位置。

```js
const arr = [1, 2, 3, 4];
arr.copyWithin(1, 2); // [1, 3, 4, 4]
```

---

## 三、其他/特殊方法

### 1. `flat()`

拉平成一维新数组（不改变原数组）。

```js
const arr = [1, [2, [3]]];
arr.flat(2); // [1, 2, 3]
```

### 2. `at()`

返回指定索引的元素（负索引支持）。

```js
const arr = [1, 2, 3];
arr.at(-1); // 3
```

---
