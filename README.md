# MyFolio Portfolio Agent

OpenClaw Skill for managing MyFolio portfolio records through the MyFolio Agent API.

## 安装

国内用户优先从 SkillHub 安装：

```text
https://skillhub.cn/
```

GitHub 备用安装：

```bash
openclaw skills install git:justwe-bot/myfolio-portfolio-agent@v0.1.1
```

开发版：

```bash
openclaw skills install git:justwe-bot/myfolio-portfolio-agent@main
```

## 配置

在 MyFolio 插件或小程序登录后，进入 AI 接入设置，复制 Agent Token。

```bash
export MYFOLIO_AGENT_TOKEN="ai_xxx"
export MYFOLIO_API_BASE_URL="https://funds-api.justaway.cn"
```

Agent Token 只授权管理 MyFolio 持仓记录，不代表真实交易授权。

## 能力

- 查询当前持仓
- 新增资产
- 修改成本价和持有数量
- 删除资产
- 分析当前持仓
- 读取或生成持仓日报

## 安全

- 不要把 Agent Token 提交到 GitHub
- 不要把 Agent Token 发给不可信的人或服务
- 删除资产前，AI 必须复述资产类型、代码、名称并要求确认
- 如果 token 泄露，在 MyFolio 插件或小程序设置中立即重置

## 发布

SkillHub 使用打包好的 zip 文件发布。项目 owner 手动登录 SkillHub 上传 `dist/myfolio-portfolio-agent-vX.Y.Z.zip`。

本仓库只提供打包脚本，不保存 SkillHub 登录凭证。
