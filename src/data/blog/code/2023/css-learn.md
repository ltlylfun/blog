---
title: css学习笔记
pubDatetime: 2023-09-13T01:19:46.553Z
featured: false
draft: true
tags:
  - css
  - notes
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: 样式学习笔记
---

## Table of contents

## CSS 单位

---

1.  常见绝对单位

- **px**：像素，常用单位，不随缩放变化。
- **cm**：厘米
- **mm**：毫米
- **in**：英寸（1in = 2.54cm = 96px）
- **pt**：点（1pt = 1/72in）
- **pc**：派卡（1pc = 12pt）

---

2.  常见相对单位

- **em**：相对当前元素字体大小（1em = 当前元素 font-size）
- **rem**：相对根元素（html）字体大小（1rem = html 的 font-size）
- **%**：相对父元素的百分比
- **vw**：视口宽度百分比（1vw = 1% 视口宽度）
- **vh**：视口高度百分比（1vh = 1% 视口高度）
- **vmin**：视口宽度和高度较小者的百分比
- **vmax**：视口宽度和高度较大者的百分比
- **ex**：相对小写字母 x 的高度
- **ch**：相对数字 0 的宽度

---

3.  其他单位

- **fr**：Grid 布局中的分数单位（如 1fr）
- **auto**：自动，根据内容或父元素适应

---

## CSS 盒模型

---

1.  什么是盒模型？

- 浏览器将所有元素看作一个盒子。
- 盒模型决定了元素的尺寸和间距。

---

2.  盒模型结构

**从内到外依次为：**

1. **Content（内容）**：元素的实际内容，如文字、图片。
2. **Padding（内边距）**：内容与边框之间的空白区域。
3. **Border（边框）**：包裹内容和内边距的边线。
4. **Margin（外边距）**：元素与外部其他元素的间距。

---

3.  两种盒模型类型

- **content-box**（标准盒模型，默认）：  
  width/height 只包含 content，不包含 padding 和 border。

- **border-box**（IE盒模型）：  
  width/height 包含 content、padding 和 border。

- 设置方式：  
  `box-sizing: content-box;`（默认）  
  `box-sizing: border-box;`

---

4.  盒子总宽高计算公式

- **content-box**：  
  元素总宽度 = content + padding + border  
  元素总高度 = content + padding + border

- **border-box**：  
  元素总宽度 = width（已包含 padding 和 border）  
  元素总高度 = height（已包含 padding 和 border）

---

## CSS 属性的1~4个值的意义

---

1 个值

- 四个方向都应用同一个值。
- 例：`margin: 10px;`  
  等同于：上 10px，右 10px，下 10px，左 10px

---

2 个值

- 第一个值：上、下
- 第二个值：左、右
- 例：`padding: 10px 20px;`  
  等同于：上 10px，右 20px，下 10px，左 20px

---

3 个值

- 第一个值：上
- 第二个值：左、右
- 第三个值：下
- 例：`border-width: 1px 2px 3px;`  
  等同于：上 1px，右 2px，下 3px，左 2px

---

4 个值

- 顺序是：上，右，下，左（顺时针）
- 例：`margin: 1px 2px 3px 4px;`  
  等同于：上 1px，右 2px，下 3px，左 4px

---

## CSS Position

---

1.  static  
    **默认值**

- 元素按照正常文档流排列。
- 不可使用 top, right, bottom, left 属性。

---

2.  relative  
    **相对定位**

- 相对于元素原本在文档流中的位置进行偏移。
- 元素仍占据原来的空间。
- 可使用 top, right, bottom, left 属性。

---

3.  absolute  
    **绝对定位**

- 相对于最近的定位祖先元素（非 static）进行定位。
- 如果没有定位祖先，则相对于 `<html>`。
- 元素脱离文档流，不占空间。
- 可使用 top, right, bottom, left 属性。

---

4.  fixed  
    **固定定位**

- 相对于浏览器窗口进行定位。
- 页面滚动时位置不变。
- 元素脱离文档流，不占空间。
- 可使用 top, right, bottom, left 属性。

---

5.  sticky  
    **粘性定位**

- 根据用户滚动位置在 relative 和 fixed 间切换。
- 当到达指定的偏移位置时变为 fixed。
- 必须设置 top、right、bottom 或 left 之一才会生效。
- 只在其父元素的可视区域内起作用。

---

## CSS Float

---

1.  float 属性

- 用于让元素在其父容器中向左或向右“浮动”。
- 常用于实现文字环绕图片、水平导航栏等布局。

---

2.  可选值

- **none**（默认）：不浮动，元素在正常文档流中。
- **left**：元素向父容器左侧浮动，后面的内容围绕在右侧。
- **right**：元素向父容器右侧浮动，后面的内容围绕在左侧。
- **inherit**：继承父元素的 float 属性。

---

3.  清除浮动（clear 属性）

- 用于阻止元素与前面的浮动元素相邻。
- 取值有：none（默认）、left、right、both。
- 常用 `.clearfix` 类来解决父元素高度塌陷的问题。

---

4.  注意事项

- 浮动元素会脱离文档流，但仍保留在父元素内。
- 浮动元素不会覆盖文字，文字会自动环绕。
- 父元素如果只包含浮动子元素，高度会塌陷（需 clearfix）。

---

## CSS Flex

---

1.  什么是 Flexbox？

- 一种一维布局模型，可以方便地在容器中排列、对齐和分配空间。

---

2.  主要属性（父容器：flex container）

- **display: flex**  
  设为弹性盒容器，所有子元素成为 flex 项。

- **flex-direction**  
  主轴方向：row（默认，横排）、row-reverse、column、column-reverse

- **flex-wrap**  
  是否换行：nowrap（默认，不换行）、wrap、wrap-reverse

- **justify-content**  
  主轴对齐：flex-start、flex-end、center、space-between、space-around、space-evenly

- **align-items**  
  交叉轴对齐：flex-start、flex-end、center、baseline、stretch

- **align-content**  
  多行时交叉轴对齐：flex-start、flex-end、center、space-between、space-around、stretch

---

3.  子元素属性（flex item）

- **flex-grow**  
  放大比例，默认 0

- **flex-shrink**  
  缩小比例，默认 1

- **flex-basis**  
  主轴初始尺寸，默认 auto

- **flex**  
  简写：flex-grow flex-shrink flex-basis，如 `flex: 1 0 100px;`

- **align-self**  
  覆盖单个 flex 项的 align-items 设置

---

## CSS Grid

---

1.  什么是 CSS Grid？

- 二维布局系统，既可以控制行（row）也可以控制列（column）。
- 适用于复杂的网页和应用界面布局。

---

2.  主要属性（父容器：grid container）

- **display: grid**  
  定义为网格容器。

- **grid-template-columns**  
  定义列的宽度，如 `100px 1fr 2fr`。

- **grid-template-rows**  
  定义行的高度，如 `60px auto 1fr`。

- **grid-gap / gap**  
  行和列之间的间距。

- **grid-template-areas**  
  通过名字给网格区域命名，便于布局。

- **justify-items**  
  水平方向排列方式：start, end, center, stretch

- **align-items**  
  垂直方向排列方式：start, end, center, stretch

- **justify-content**  
  网格整体的水平排列方式。

- **align-content**  
  网格整体的垂直排列方式。

---

3.  子元素属性（grid item）

- **grid-column / grid-row**  
  设置元素跨越的列/行范围，如 `grid-column: 1 / 3;`。

- **grid-area**  
  可配合 `grid-template-areas` 使用，直接指定区域。

- **justify-self**  
  水平对齐单元格内容。

- **align-self**  
  垂直对齐单元格内容。

---
