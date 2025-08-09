---
title: git常用命令
pubDatetime: 2022-12-20T01:19:46.553Z
featured: false
draft: true
tags:
  - git
  - notes
# ogImage: ../../assets/images/example.png # src/assets/images/example.png
description: git常用命令的笔记
---

## Table of contents

# Git 常用命令记忆卡片

## 1. 基本操作

| 命令                   | 作用                 |
| ---------------------- | -------------------- |
| `git init`             | 初始化本地仓库       |
| `git clone <repo_url>` | 克隆远程仓库         |
| `git status`           | 查看当前状态         |
| `git add <file>`       | 添加文件到暂存区     |
| `git add .`            | 添加全部改动到暂存区 |
| `git commit -m "信息"` | 提交暂存区到本地仓库 |
| `git log`              | 查看提交历史         |
| `git diff`             | 查看文件改动内容     |

## 2. 分支管理

| 命令                            | 作用           |
| ------------------------------- | -------------- |
| `git branch`                    | 查看本地分支   |
| `git branch <branch_name>`      | 新建分支       |
| `git checkout <branch_name>`    | 切换分支       |
| `git checkout -b <branch_name>` | 新建并切换分支 |
| `git merge <branch_name>`       | 合并分支       |
| `git branch -d <branch_name>`   | 删除本地分支   |

## 3. 远程操作

| 命令                          | 作用               |
| ----------------------------- | ------------------ |
| `git remote -v`               | 查看远程仓库地址   |
| `git remote add origin <url>` | 添加远程仓库       |
| `git push origin <branch>`    | 推送分支到远程仓库 |
| `git pull origin <branch>`    | 拉取远程分支并合并 |
| `git fetch`                   | 拉取最新但不合并   |
| `git clone <url>`             | 克隆远程仓库       |

## 4. 撤销与恢复

| 命令                           | 作用                       |
| ------------------------------ | -------------------------- |
| `git checkout -- <file>`       | 撤销工作区修改             |
| `git reset HEAD <file>`        | 撤销暂存区的文件           |
| `git reset --hard <commit_id>` | 回退到指定提交             |
| `git revert <commit_id>`       | 撤销某次提交（生成新提交） |

## 5. 其他常用命令

| 命令                    | 作用                 |
| ----------------------- | -------------------- |
| `git stash`             | 临时保存未提交修改   |
| `git stash pop`         | 恢复暂存内容         |
| `git tag`               | 查看所有标签         |
| `git tag <tagname>`     | 新建标签             |
| `git show <commit/tag>` | 显示某次提交详细信息 |
| `git config --list`     | 查看配置信息         |
