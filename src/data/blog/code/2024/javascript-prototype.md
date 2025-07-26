---
title: js原型链
pubDatetime: 2024-12-15T01:19:46.553Z
featured: false
tags:
  - js
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: 原型链是一个对象通过 __proto__（或 [[Prototype]]）指向其构造函数的 prototype 对象，从而形成的一条对象查找链，用于属性和方法的继承。
---

## Table of contents

## 原型链基础

当我们访问一个对象的属性或方法时，JavaScript 引擎会先在对象本身查找，如果找不到，就会沿着原型链向上查找，直到找到为止或者到达原型链的顶端（null）。这种查找机制就是原型链的工作原理。

```javascript
// 构造函数
function Person(name) {
  this.name = name;
}

// 在原型上添加方法
Person.prototype.sayHello = function () {
  return `Hello, I'm ${this.name}`;
};

const person = new Person("Alice");
console.log(person.sayHello()); // "Hello, I'm Alice"

// 原型链查找
console.log(person.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
```

在上面的例子中，当我们调用 `person.sayHello()` 时，JavaScript 引擎首先在 `person` 对象本身查找 `sayHello` 方法，没找到后就会在 `Person.prototype` 中查找并找到了这个方法。

需要注意的是，`__proto__` 是一个非标准属性（虽然被广泛支持），实际应该使用 `Object.getPrototypeOf()` 来获取对象的原型。

> `__proto__` 是 [[Prototype]] 的因历史原因而留下来的 getter/setter
> 初学者常犯一个普遍的错误，就是不知道 `__proto__` 和 [[Prototype]] 的区别。
>
> 请注意，`__proto__` 与内部的 [[Prototype]] 不一样。`__proto__` 是 [[Prototype]] 的 getter/setter。
>
> `__proto__` 属性有点过时了。它的存在是出于历史的原因，现代编程语言建议我们应该使用函数 Object.getPrototypeOf/Object.>setPrototypeOf 来取代 `__proto__` 去 get/set 原型。稍后我们将介绍这些函数。
>
> 根据规范，`__proto__` 必须仅受浏览器环境的支持。但实际上，包括服务端在内的所有环境都支持它，因此我们使用它是非常安全的。
>
> 由于 `__proto__` 标记在观感上更加明显，所以我们在后面的示例中将使用它。
>
> 摘自 javascript.info

## 深入理解原型

在深入学习继承之前，我们需要更详细地理解原型的概念和工作机制。

### 什么是原型？

在 JavaScript 中，原型（prototype）是一个对象，它包含了可以被其他对象共享的属性和方法。每个函数都有一个 `prototype` 属性，指向一个对象，这个对象就是通过该构造函数创建的实例的原型。

```javascript
function Person(name) {
  this.name = name;
}

// Person.prototype 是一个对象
console.log(typeof Person.prototype); // "object"
console.log(Person.prototype); // { constructor: Person }

// 为原型添加方法
Person.prototype.sayHello = function () {
  return `Hello, I'm ${this.name}`;
};

Person.prototype.age = 0; // 添加属性

const person1 = new Person("Alice");
const person2 = new Person("Bob");

// 两个实例共享相同的原型
console.log(person1.__proto__ === person2.__proto__); // true
console.log(person1.__proto__ === Person.prototype); // true
```

### 原型的三个关键概念

理解 `prototype`、`__proto__` 和 `constructor` 之间的关系是掌握 JavaScript 原型链的关键。让我们通过图表和代码来深入理解：

```
          +------------------+
          |                  |
          |   (Function)     |
          |       Foo        |<----------------
          |                  |                 |
          +------------------+                 |
                  |                            |
                  | .prototype                 |
                  V                            |
          +------------------+                 |
          |                  |                 |
          |  Foo.prototype   | --.constructor---
          |   (Object)       |
          |                  |
          +------------------+
                  ^
                  | .__proto__
                  |
+-----------------+-----------------+
|                                   |
|         (Object) f1               |
| (instance of Foo)                 |
|                                   |
|   f1 = new Foo()                  |
|                                   |
+-----------------------------------+
```

#### 1. prototype 属性

- **只有函数才有** `prototype` 属性
- 指向一个对象，这个对象会成为通过该构造函数创建的实例的原型
- 可以在这个对象上添加共享的方法和属性

#### 2. `__proto__` 属性（内部原型）

- **每个对象都有** `__proto__` 属性（非标准，但广泛支持）
- 指向创建该对象的构造函数的 `prototype`
- 是原型链查找的实际路径

#### 3. constructor 属性

- **每个原型对象都有** `constructor` 属性
- 指向创建该原型的构造函数
- 用于标识对象的构造函数
