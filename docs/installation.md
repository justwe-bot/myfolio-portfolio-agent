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
openclaw skills install git:justwe-bot/myfolio-portfolio-agent@v0.1.8
```

Development build:

```bash
openclaw skills install git:justwe-bot/myfolio-portfolio-agent@main
```

## Token

Copy the Agent Token from the logged-in 自选理财助手（韭菜账本） plugin or mini program portfolio assistant settings.

```bash
export MYFOLIO_AGENT_TOKEN="ai_xxx"
```

The API base URL is built into the skill as `https://funds-api.justaway.cn`; users do not need to set it.

`MYFOLIO_AGENT_TOKEN` is retained as the legacy environment variable name for compatibility. It is the Agent Token for 自选理财助手（韭菜账本）.

## Updates

There is no separate Agent API endpoint for checking skill updates. Re-run the install command to confirm or overwrite the installed skill:

```bash
skillhub install myfolio-portfolio-agent
```
