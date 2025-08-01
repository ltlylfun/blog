---
title: react-router
pubDatetime: 2025-03-03T01:19:46.553Z
featured: false
draft: true
tags:
  - react
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: 如题
---

## Table of contents

## 为什么需要 React Router？

React 是用于构建 **SPA（单页应用）** 的框架。SPA 的特点是：

- 整个网站只加载一个 HTML 文件（通常是 `index.html`）
- 页面间的切换不再是「重新加载 HTML 页面」，而是「**替换组件**」
- 所以，我们不能靠 `a href` + `window.location.href`，那会刷新页面

这时候，**React Router 就是来“拦截 URL 变化”，然后动态渲染不同组件的工具**
没问题！我帮你把刚才的速记卡片稍微展开一点讲解，方便你直接记笔记。

---

## React Router 核心知识

### 1. 路由容器 `<BrowserRouter>`

- 作用：包裹整个 React 应用，开启路由监听功能。
- 它监听浏览器地址栏变化，管理历史记录，实现无刷新导航。
- **必须放在根组件的最外层。**

---

### 2. 路由匹配容器 `<Routes>`

- 它包含多个 `<Route>`，负责匹配当前地址对应的路由。
- 只渲染第一个匹配的 `<Route>`，提高渲染效率。
- React Router v6 推荐用法，替代了以前的 `<Switch>`。

---

### 3. 路由定义 `<Route>`

- 定义路径和对应组件。
- 语法示例：

  ```jsx
  <Route path="/about" element={<About />} />
  ```

- 路径可以是静态（如 `/about`），也可以包含动态参数（如 `/user/:id`）。

---

### 4. 导航链接 `<Link>`

- 替代传统的 `<a>` 标签，点击时不会刷新页面。
- 通过修改 URL，触发路由更新，实现组件切换。
- 示例：

  ```jsx
  <Link to="/contact">Contact</Link>
  ```

---

### 5. 相对路径与嵌套路由

- 子路由写成相对路径，不带 `/`，自动拼接父路由路径。
- 嵌套路由在 `<Route>` 里嵌套 `<Route>`，父组件用 `<Outlet />` 渲染子路由。
- 例：

  ```jsx
  <Route path="/dashboard" element={<Dashboard />}>
    <Route path="settings" element={<Settings />} />
  </Route>
  ```

- `<Outlet />` 是子路由显示位置。

---

### 6. 动态路径参数与 `useParams`

- 路径写成 `/user/:id`，其中 `:id` 是动态参数。
- 组件内用 `useParams()` 读取：

  ```jsx
  const { id } = useParams();
  ```

- 动态参数灵活支持用户详情、文章详情等需求。

---

### 7. 页面跳转两种方式

- **声明式**：用 `<Link to="..." />`，适合导航菜单。
- **编程式**：用 `useNavigate()` 返回的函数跳转，适合表单提交后跳转等场景。

  ```jsx
  const navigate = useNavigate();
  navigate("/home");
  ```

---

### 8. 404 页面

- 用 `<Route path="*" element={<NotFound />} />` 捕获所有未匹配路径。
- 提供用户友好的页面未找到提示。

---

### 9. 重定向 `<Navigate>`

- 通过 `<Navigate to="/login" replace />` 实现路由跳转和重定向。
- 常用于权限控制、页面跳转后更新 URL。

---

### 10. 登录保护路由

- 封装一个组件判断登录状态。
- 未登录时重定向到登录页。
- 示例：

  ```jsx
  function PrivateRoute({ isAuth, children }) {
    return isAuth ? children : <Navigate to="/login" replace />;
  }
  ```

---

### 11. 路由懒加载

- 利用 React 的 `lazy` 和 `Suspense` 按需加载路由组件。
- 优化应用加载速度，减小初始包体积。
- 示例：

  ```jsx
  const Dashboard = lazy(() => import("./Dashboard"));
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Suspense>;
  ```

---

### 12. 读取查询参数 `useSearchParams`

- 读取 URL 中 `?` 后面的参数。
- 示例：

  ```jsx
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  ```

---

### 13. 监听路径变化 `useLocation`

- 获取当前 URL 信息，用于页面副作用操作。
- 示例：

  ```jsx
  const location = useLocation();
  useEffect(() => {
    document.title = location.pathname;
  }, [location]);
  ```
