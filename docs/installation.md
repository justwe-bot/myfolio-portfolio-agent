# Installation

## SkillHub

Use SkillHub as the primary distribution channel for domestic users:

```text
https://skillhub.cn/
```

The project owner uploads the packaged zip manually.

## GitHub

Stable release:

```bash
openclaw skills install git:justwe-bot/myfolio-portfolio-agent@v0.1.1
```

Development build:

```bash
openclaw skills install git:justwe-bot/myfolio-portfolio-agent@main
```

## Token

Copy the Agent Token from the logged-in MyFolio plugin or mini program AI access settings.

```bash
export MYFOLIO_AGENT_TOKEN="ai_xxx"
export MYFOLIO_API_BASE_URL="https://funds-api.justaway.cn"
```
