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
openclaw skills install git:justwe-bot/myfolio-portfolio-agent@v0.1.3
```

Development build:

```bash
openclaw skills install git:justwe-bot/myfolio-portfolio-agent@main
```

## Token

Copy the Agent Token from the logged-in MyFolio plugin or mini program portfolio assistant settings.

```bash
export MYFOLIO_AGENT_TOKEN="ai_xxx"
```

The API base URL defaults to `https://funds-api.justaway.cn`; users normally do not need to set it.
