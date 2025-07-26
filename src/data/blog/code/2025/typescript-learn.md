---
title: ts类型学习小记
pubDatetime: 2025-04-26T01:19:46.553Z
featured: false
tags:
  - ts
  - notes
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: ts是type + JavaScript，但是好像不只是+type这么简单
---

## Table of contents

## 什么是ts，为什么要使用ts

> TypeScript = type + JavaScript，是js的超集

我的理解是使用ts可以带来提示与约束，有些错误js只有运行时才报错，而ts编辑时就有提示。不过即使存在编译错误，在默认的情况下，TypeScript 也会尽可能的被编译为 JavaScript 代码。因此，我们可以将JavaScript代码逐步迁移至 TypeScript。

## ts类型

ts是类型后置语法，类型和js大差不差。

ts的类型可以是显式的，也可以是隐式的。

```typescript
let a = 1; //隐式
let a: number = 1; //显式
```

---

## ts特殊类型

1.  any 与 unknown 的区别

| 类型      | 描述                                                      | 赋值限制                   | 使用限制                           |
| --------- | --------------------------------------------------------- | -------------------------- | ---------------------------------- |
| `any`     | 任意类型，**关闭类型检查**，可赋值给任何类型              | 可赋值给任何类型           | 可进行任意操作，不安全             |
| `unknown` | 任意类型，**开启类型检查**，只能赋值给 `any` 和 `unknown` | 只能赋值给 `any`/`unknown` | 使用前需类型断言或类型缩窄，较安全 |

```typescript
let a: any = 123;
let u: unknown = 456;

let b: number = a; // OK
let c: number = u; // Error，需要类型断言
if (typeof u === "number") {
  let d: number = u; // OK
}
```

---

2.  void 与 never 的区别

| 类型    | 描述                                                 | 使用场景              |
| ------- | ---------------------------------------------------- | --------------------- |
| `void`  | 表示没有返回值（即函数返回`undefined`或没有返回值）  | 用于无返回值的函数    |
| `never` | 表示**永不返回**（函数抛异常或无限循环，永远不结束） | 用于抛错/死循环的函数 |

```typescript
function fnVoid(): void {
  // 没有返回值
}

function fnNever(): never {
  throw new Error("出错了"); // 或 while(true) {}
}
```

## ts类型运算符

1. keyof
   获取某类型的所有属性名（以联合类型形式返回）

```typescript
type User = { name: string; age: number };
type UserKeys = keyof User;
// "name" | "age"
```

2. typeof  
   获取变量、对象、函数的类型

```typescript
const user = { name: "Alice", age: 18 };
type UserType = typeof user;
// { name: string; age: number }
```

> 1.  TypeScript 类型运算符 `typeof`
>
> - **位置：类型定义里（如 type、interface）**
> - **作用：获取变量/对象/函数的静态类型**
> - **结果：得到 TypeScript 类型**
>
> ```typescript
> const user = { name: "Alice", age: 18 };
> type UserType = typeof user; // { name: string; age: number }
> ```
>
> 2.  JavaScript 原生运算符 `typeof`
>
> - **位置：运行时表达式（如赋值、判断、打印等）**
> - **作用：获取变量值的 JS 类型字符串**
> - **结果：返回 "string"、"number"、"object" 等字符串**
>
> ```typescript
> const age = 18;
> console.log(typeof age); // "number"
> ```

3. in  
   用于映射类型中，遍历属性名

```typescript
type User = { name: string; age: number };
type PartialUser = { [K in keyof User]?: User[K] };
// { name?: string; age?: number }
```

4. extends
   用于泛型约束或条件类型，表示“继承”或“分支判断”

```typescript
type IsString<T> = T extends string ? true : false;
type A = IsString<"hello">; // true
type B = IsString<123>; // false
```

5. typeof + keyof 联合用法  
   可用于获取对象的所有键类型

```typescript
const obj = { a: 1, b: 2 };
type Keys = keyof typeof obj;
// "a" | "b"
```

6. as（属性重映射）
   TypeScript 4.1+，在映射类型中重命名属性

```typescript
type Prefix<T> = {
  [K in keyof T as `prefix_${string & K}`]: T[K];
};
// { prefix_name: string; prefix_age: number }
```

---

## ts枚举

枚举（`enum`）是 TypeScript 提供的一种数据类型，用于定义**一组命名常量**。可以让代码更易读、易维护。ps：**支持合并**。

1. 数字枚举（默认）

```typescript
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}
```

- 默认从 0 开始，依次递增。
- 可以手动赋值：

2.  字符串枚举

```typescript
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}
```

- 枚举成员必须赋值为字符串。

3.  异构枚举（数字 + 字符串混用）

```typescript
enum Mixed {
  No = 0,
  Yes = "YES",
}
```

---

枚举成员类型

- **常量成员**：编译时已知的值（如 `Up = 0`）。
- **计算成员**：值为表达式（如 `B = A + 2`）。

---

枚举的反向映射（仅数字枚举）

```typescript
enum Direction {
  Up,
  Down,
}
Direction.Up; // 0
Direction[0]; // "Up"
```

---

const 枚举（编译优化）

```typescript
const enum Size {
  Small,
  Medium,
  Large,
}
let s = Size.Small; // 会被编译为数字常量
```

---

## ts函数类型

---

1.  基本函数类型写法

```typescript
// 声明一个函数类型：参数和返回值的类型
let fn: (a: number, b: number) => number;

// 使用
fn = function (x, y) {
  return x + y;
};
```

- `(a: number, b: number) => number` 表示：两个参数都是 number，返回值也是 number。

---

2.  用 type/接口定义函数类型

```typescript
type Add = (x: number, y: number) => number;

interface Subtract {
  (x: number, y: number): number;
}
```

---

3.  可选参数和默认值

```typescript
function greet(name: string, age?: number) { ... } // age 可选
function hello(name: string = "guest") { ... }     // name 有默认值
```

---

4.  剩余参数

```typescript
function sum(...nums: number[]): number {
  return nums.reduce((s, n) => s + n, 0);
}
```

---

5.  void 和 never 返回类型

```typescript
function log(msg: string): void { ... }      // 无返回值
function error(): never { throw 'Error'; }   // 永不返回
```

---

6.  函数重载

```typescript
function info(x: number): string;
function info(x: string): string;
function info(x: number | string): string {
  return x.toString();
}
```

---

7. this 参数类型

```typescript
function show(this: HTMLDivElement, msg: string) {
  this.innerText = msg;
}
```

---

## ts接口类型

1. 定义接口

```typescript
interface Person {
  name: string;
  age: number;
}
```

2. 可选属性

```typescript
interface Person {
  name: string;
  age?: number; // 可选属性
}
```

3. 只读属性

```typescript
interface Person {
  readonly id: string;
  name: string;
}
```

4. 方法定义

```typescript
interface Person {
  greet(): void;
}
```

5. 索引签名

```typescript
interface StringArray {
  [index: number]: string;
}
```

6. 扩展接口

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}
```

7. 混合类型

```typescript
interface Counter {
  (start: number): number;
  reset(): void;
}
```

8. 接口与类型别名区别

- 接口可继承、合并声明
- 类型别名可用于联合类型、元组等

---

## ts泛型

1. 泛型基础语法

```typescript
function identity<T>(arg: T): T {
  return arg;
}
```

- `<T>` 是类型变量，调用时可指定类型：`identity<number>(123)`

2. 泛型接口

```typescript
interface Box<T> {
  value: T;
}
```

- 用法：`const box: Box<string> = { value: "hello" }`

3. 泛型类

```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
```

- 用法：`let myNum = new GenericNumber<number>()`

4. 泛型约束

```typescript
function loggingIdentity<T extends { length: number }>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

- 限制 T 必须有 `length` 属性

5. 泛型类型别名

```typescript
type Pair<T, U> = [T, U];
```

- 用法：`const p: Pair<number, string> = [1, "one"]`

6. 默认类型参数

```typescript
function fn<T = string>(value: T): T {
  return value;
}
```

- T 默认是 `string`

7. 泛型实用工具类型

- `Partial<T>`：把 T 所有属性变为可选
- `Readonly<T>`：把 T 所有属性变为只读
- `Record<K, T>`：K 的所有属性值都是 T 类型

```typescript
type Obj = Partial<{ a: number; b: string }>;
```

8. 泛型在函数类型中

```typescript
type Mapper<T> = (x: T) => T;
```

- 用法：`const numMapper: Mapper<number> = x => x * 2;`

---

## ts常用工具类型

1. Partial<Type>
   将 Type 的所有属性变为可选

```typescript
type User = { name: string; age: number };
type PartialUser = Partial<User>;
// { name?: string; age?: number }
```

2. Required<Type>  
   将 Type 的所有属性变为必选

```typescript
type User = { name?: string; age?: number };
type RequiredUser = Required<User>;
// { name: string; age: number }
```

3. Readonly<Type>  
   将 Type 的所有属性变为只读

```typescript
type User = { name: string; age: number };
type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number }
```

4. Pick<Type, Keys>  
   从 Type 中选取部分属性组成新类型

```typescript
type User = { name: string; age: number; gender: string };
type NameAge = Pick<User, "name" | "age">;
// { name: string; age: number }
```

5. Record<Keys, Type>
   构造一个对象类型，键为 Keys，值为 Type

```typescript
type UserRecord = Record<"a" | "b", number>;
// { a: number; b: number }
```

6. Exclude<Type, ExcludedUnion>
   从 Type 联合类型中排除 ExcludedUnion

```typescript
type T = Exclude<"a" | "b" | "c", "a" | "c">;
// "b"
```

7. Extract<Type, Union>  
   从 Type 联合类型中提取与 Union 交集的类型

```typescript
type T = Extract<"a" | "b" | "c", "a" | "c">;
// "a" | "c"
```

8. Omit<Type, Keys>  
   从 Type 中排除部分属性组成新类型

```typescript
type User = { name: string; age: number; gender: string };
type NoGender = Omit<User, "gender">;
// { name: string; age: number }
```

9. ReturnType<Type>
   获取函数类型 Type 的返回值类型

```typescript
function fn(): string {
  return "hi";
}
type R = ReturnType<typeof fn>;
// string
```

10. InstanceType<Type>
    获取构造函数类型 Type 的实例类型

```typescript
class User {
  name = "";
}
type U = InstanceType<typeof User>;
// User
```

11. Parameters<Type>  
    获取函数类型 Type 的参数组成的元组类型

```typescript
function fn(name: string, age: number): void {}
type P = Parameters<typeof fn>;
// [string, number]
```

12. ConstructorParameters<Type>
    获取构造函数类型 Type 的参数组成的元组类型

```typescript
type CP = ConstructorParameters<typeof Error>;
// [string?]
```

13. NonNullable<Type>
    去除 Type 中的 null 和 undefined

```typescript
type T = NonNullable<string | undefined | null>;
// string
```

---
