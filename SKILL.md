---
name: myfolio-portfolio-agent
description: Use this skill when the user wants an AI agent to query, add, update, delete, analyze, or generate reports for their MyFolio portfolio holdings through the MyFolio Agent API using a user-provided MYFOLIO_AGENT_TOKEN.
---

# MyFolio Portfolio Agent

Use this skill to manage a user's MyFolio portfolio records through the MyFolio Agent API.

This skill manages MyFolio holding records only. It never places real trades, never transfers assets, and never represents brokerage or exchange authorization.

## Required Configuration

Read this value from the user's environment or secret settings:

```text
MYFOLIO_AGENT_TOKEN=ai_xxx
```

The API base URL is built into this skill:

```text
https://funds-api.justaway.cn
```

Users only need to provide `MYFOLIO_AGENT_TOKEN`; do not ask them to configure an API base URL.

Never ask the user to paste the token into public chat, source code, GitHub issues, logs, or files that may be committed.

## Auth

All API requests must use:

```http
Authorization: Bearer ${MYFOLIO_AGENT_TOKEN}
```

Do not send `userId`. The backend derives the user from the Agent Token.

## Core Workflow

1. For any update or delete request, first call `GET /api/AgentPortfolio/assets`.
2. Before deleting an asset, repeat the asset type, code, and name, then ask the user to confirm.
3. For cost price or quantity changes, show the current value and the requested new value before calling the update API.
4. After add, update, or delete, call `GET /api/AgentPortfolio/assets` again and summarize the confirmed result.
5. Explain that all changes are MyFolio records only, not real securities trades.

## API

Base URL:

```text
https://funds-api.justaway.cn
```

List holdings:

```http
GET /api/AgentPortfolio/assets
```

Add one holding:

```http
POST /api/AgentPortfolio/assets
Content-Type: application/json

{
  "assetType": "fund",
  "value": "000001",
  "name": "示例基金",
  "costPrice": 1.2345,
  "quantity": 1000
}
```

Update one holding:

```http
PATCH /api/AgentPortfolio/assets/{assetType}/{value}
Content-Type: application/json

{
  "costPrice": 1.25,
  "quantity": 1200
}
```

Delete one holding:

```http
DELETE /api/AgentPortfolio/assets/{assetType}/{value}
```

Analyze current holdings:

```http
POST /api/AgentPortfolio/analyze
Content-Type: application/json

{
  "reportType": "detailed",
  "days": 120,
  "includeNewsSummary": false
}
```

Read daily report cache:

```http
GET /api/AgentPortfolio/dailyReport
```

Generate or resume today's report:

```http
POST /api/AgentPortfolio/dailyReport
Content-Type: application/json

{
  "reportType": "detailed",
  "days": 120,
  "includeMarketReview": true
}
```

## Asset Types

Use these normalized asset types:

- `fund`
- `stock`
- `crypto`
- `metal`

For A-share stock codes, accept user input such as `SH600000`, `600000.SH`, or `600000`; the backend normalizes storage.

## Error Handling

- `401`: token is missing, malformed, revoked, expired, or invalid. Ask the user to copy or reset the Agent Token in MyFolio.
- `403`: token lacks the required scope. Ask the user to reset token permissions in MyFolio.
- `404`: the requested asset or report does not exist.
- `409`: the asset already exists. Use update instead of add.
- `429`: report generation or analysis is busy. Wait and retry later.
- `504` from `/api/AgentPortfolio/analyze`: the downstream analysis service timed out. Do not treat this as a token or Skill installation failure; tell the user that portfolio CRUD and daily reports may still work, then retry later or use the daily report endpoint.

When an API call fails, report the backend message directly and suggest the smallest next action.
