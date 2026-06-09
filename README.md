# 自选理财助手（韭菜账本）Portfolio Agent

OpenClaw Skill for managing portfolio records in 自选理财助手（韭菜账本） through its Agent API.

## 安装

国内用户优先从 SkillHub 安装：

```text
https://skillhub.cn/
```

GitHub 备用安装：

```bash
openclaw skills install git:justwe-bot/myfolio-portfolio-agent@v0.1.9
```

开发版：

```bash
openclaw skills install git:justwe-bot/myfolio-portfolio-agent@main
```

## 配置

在自选理财助手（韭菜账本）插件或小程序登录后，进入持仓助手设置，复制 Agent Token。

```bash
export PORTFOLIO_AGENT_TOKEN="ai_xxx"
```

API Base URL 已内置为 `https://funds-api.justaway.cn`，用户不需要配置。

Agent Token 只授权管理自选理财助手（韭菜账本）持仓记录，不代表真实交易授权。

## 更新

无需单独的检查更新接口。重新执行安装命令即可确认或覆盖到当前发布版本：

```bash
skillhub install myfolio-portfolio-agent
```

如果使用 GitHub 备用安装，则改用最新 tag 的安装命令。

## 能力

- 查询当前持仓
- 搜索基金、股票、虚拟币、黄金候选资产
- 查询基金、股票、虚拟币、黄金参考价格
- 根据截图识别出的名称、金额、收益生成待确认补录建议
- 新增资产
- 修改成本价和持有数量
- 删除资产
- 查看某个已保存资产今天的分析和操作建议
- 分析当前持仓
- 读取或生成持仓日报

说明：持仓增删改查和日报接口由自选理财助手（韭菜账本）Agent API 直接处理；持仓分析接口依赖下游分析服务，若返回 504，应提示用户稍后重试或改用日报。

## 安全

- 不要把 Agent Token 提交到 GitHub
- 不要把 Agent Token 发给不可信的人或服务
- 删除资产前，AI 必须复述资产类型、代码、名称并要求确认
- 如果 token 泄露，在自选理财助手（韭菜账本）插件或小程序设置中立即重置

## 发布

SkillHub 使用打包好的 zip 文件发布。项目 owner 手动登录 SkillHub 上传 `dist/myfolio-portfolio-agent-vX.Y.Z.zip`。

本仓库只提供打包脚本，不保存 SkillHub 登录凭证。
