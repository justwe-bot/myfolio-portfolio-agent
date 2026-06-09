---
name: myfolio-portfolio-agent
description: Use this skill when the user wants an AI agent to query, add, update, delete, analyze, or generate reports for portfolio holdings in 自选理财助手（韭菜账本） through its Agent API using a user-provided MYFOLIO_AGENT_TOKEN.
---

# 自选理财助手（韭菜账本）Portfolio Agent

Use this skill to manage a user's portfolio records in 自选理财助手（韭菜账本） through its Agent API.

This skill manages 自选理财助手（韭菜账本） holding records only. It never places real trades, never transfers assets, and never represents brokerage or exchange authorization.

## Required Configuration

Read this value from the user's environment or secret settings:

```text
MYFOLIO_AGENT_TOKEN=ai_xxx
```

If the user provided a token in the install or configuration prompt, treat that value as `MYFOLIO_AGENT_TOKEN` for this session. If the runtime supports shell environment variables, prefer an exported variable:

```bash
export MYFOLIO_AGENT_TOKEN="ai_xxx"
```

The API base URL is built into this skill:

```text
https://funds-api.justaway.cn
```

Users only need to provide `MYFOLIO_AGENT_TOKEN`; do not ask them to configure an API base URL.

`MYFOLIO_AGENT_TOKEN` is kept as the legacy environment variable name for compatibility. Treat it as the Agent Token for 自选理财助手（韭菜账本）, not as the product name.

Never ask the user to paste the token into public chat, source code, GitHub issues, logs, or files that may be committed.

## Auth

All API requests must use:

```http
Authorization: Bearer ${MYFOLIO_AGENT_TOKEN}
```

Do not send `userId`. The backend derives the user from the Agent Token.

## Required HTTP Headers

Cloudflare may block generic automation request fingerprints. Every 自选理财助手（韭菜账本） Agent API request MUST explicitly include these headers:

```http
User-Agent: Apifox/1.0.0 (https://apifox.com)
Accept: */*
Authorization: Bearer ${MYFOLIO_AGENT_TOKEN}
```

`Host` and `Connection` are normally added by the HTTP client automatically. If the client allows setting them safely, use:

```http
Host: funds-api.justaway.cn
Connection: keep-alive
```

Do not use a generic Python, curl, OpenClaw, bot, or empty User-Agent for these API calls. If a request receives a Cloudflare `1010` response, retry once with the exact User-Agent above before treating the token or backend as invalid.

## Core Workflow

1. For any update or delete request, first call `GET /api/AgentPortfolio/assets`.
2. Before deleting an asset, repeat the asset type, code, and name, then ask the user to confirm.
3. For cost price or quantity changes, show the current value and the requested new value before calling the update API.
4. After add, update, or delete, call `GET /api/AgentPortfolio/assets` again and summarize the confirmed result.
5. Explain that all changes are 自选理财助手（韭菜账本） records only, not real securities trades.

## Single Asset Advice Workflow

Use `GET /api/AgentPortfolio/assetAnalysis/today` as the preferred interface when the user asks for today's advice, operation suggestion, sentiment, trend, or analysis for one saved asset.

1. Call `GET /api/AgentPortfolio/assets` first if the user's asset type or code is ambiguous.
2. Only request analysis for an asset that belongs to the user's 自选理财助手（韭菜账本） holdings.
3. Call `GET /api/AgentPortfolio/assetAnalysis/today?assetType={assetType}&value={value}`.
4. If `queryStatus` is `processing`, tell the user the analysis task is still running and can be retried later.
5. If `isCompleted` is true, summarize `data.analysis_summary`, `data.operation_advice`, `data.trend_prediction`, `data.market_sentiment`, and `data.news_items` when present.
6. Never treat analysis advice as a trade instruction; remind the user it is for reference only when discussing buy, sell, add, or reduce actions.

## Screenshot And Market Lookup Workflow

When the user provides screenshots from Alipay, broker apps, exchanges, or metal quote pages:

1. Extract visible asset names, codes if present, current amount, holding profit, quantity, and cost price.
2. Use the read-only market helper endpoints to search candidates and fetch reference prices.
3. If the screenshot only has current amount and profit, use `/api/AgentPortfolio/resolve` to generate estimated quantity and cost price.
4. Clearly mark all reverse-calculated values as estimates.
5. Present a pending change list and wait for the user to confirm before calling add, update, or delete.
6. After the write call, query holdings again and confirm the actual 自选理财助手（韭菜账本） record state.

The helper endpoints are cached by the backend. Do not poll them repeatedly; one search/quote/resolve call per user request is enough unless the user asks to refresh.

## API

Base URL:

```text
https://funds-api.justaway.cn
```

List holdings:

```http
GET /api/AgentPortfolio/assets
User-Agent: Apifox/1.0.0 (https://apifox.com)
Accept: */*
Authorization: Bearer ${MYFOLIO_AGENT_TOKEN}
```

Equivalent curl:

```bash
curl -sS \
  -H "User-Agent: Apifox/1.0.0 (https://apifox.com)" \
  -H "Accept: */*" \
  -H "Authorization: Bearer ${MYFOLIO_AGENT_TOKEN}" \
  "https://funds-api.justaway.cn/api/AgentPortfolio/assets"
```

Search asset candidates:

```http
GET /api/AgentPortfolio/search?assetType=fund&keyword=易方达全球成长
GET /api/AgentPortfolio/search?assetType=stock&keyword=贵州茅台
GET /api/AgentPortfolio/search?assetType=crypto&keyword=BTC
GET /api/AgentPortfolio/search?assetType=metal&keyword=黄金
```

Get one reference quote:

```http
GET /api/AgentPortfolio/quote/{assetType}/{value}
```

Examples:

```http
GET /api/AgentPortfolio/quote/fund/000001
GET /api/AgentPortfolio/quote/stock/1.600519
GET /api/AgentPortfolio/quote/crypto/BTC
GET /api/AgentPortfolio/quote/metal/118.AU9999
```

Resolve screenshot-extracted items into candidates, quotes, and estimates:

```http
POST /api/AgentPortfolio/resolve
Content-Type: application/json

{
  "items": [
    {
      "assetType": "fund",
      "name": "易方达全球成长",
      "amount": 2247.98,
      "holdingProfit": 113.21,
      "currency": "CNY"
    }
  ]
}
```

`resolve` is read-only. It may return `estimatedQuantity`, `estimatedCostAmount`, and `estimatedCostPrice`; these are suggestions only and require user confirmation before writing to holdings.

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

Analyze one saved asset for today's advice:

```http
GET /api/AgentPortfolio/assetAnalysis/today?assetType=fund&value=000001
User-Agent: Apifox/1.0.0 (https://apifox.com)
Accept: */*
Authorization: Bearer ${MYFOLIO_AGENT_TOKEN}
```

Example response fields:

```json
{
  "reportDate": "2026-06-09",
  "assetType": "fund",
  "value": "000001",
  "analysisValue": "000001",
  "normalizedValue": "000001",
  "queryStatus": "completed",
  "isProcessing": false,
  "isCompleted": true,
  "fromCache": true,
  "data": {
    "analysis_summary": "...",
    "operation_advice": "...",
    "trend_prediction": "...",
    "market_sentiment": "..."
  }
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

- `fund`: fund code, for example `000001`
- `stock`: EastMoney A-share secid, for example `1.600519` or `0.000001`
- `crypto`: uppercase coin symbol, for example `BTC`
- `metal`: quote secid, currently `118.AU9999` for 上海黄金9999

For A-share stock codes, accept user input such as `SH600000`, `600000.SH`, or `600000`; the backend normalizes storage.

## Error Handling

- `401`: token is missing, malformed, revoked, expired, or invalid. Ask the user to copy or reset the Agent Token in 自选理财助手（韭菜账本）.
- `403`: token lacks the required scope. Ask the user to reset token permissions in 自选理财助手（韭菜账本）.
- `404`: the requested asset or report does not exist.
- `409`: the asset already exists. Use update instead of add.
- `429`: report generation or analysis is busy. Wait and retry later.
- Cloudflare `1010`: the request fingerprint or User-Agent was blocked. Retry with `User-Agent: Apifox/1.0.0 (https://apifox.com)` and `Accept: */*`.
- `504` from `/api/AgentPortfolio/analyze`: the downstream analysis service timed out. Do not treat this as a token or Skill installation failure; tell the user that portfolio CRUD and daily reports may still work, then retry later or use the daily report endpoint.
- `processing` from `/api/AgentPortfolio/assetAnalysis/today`: today's single-asset analysis has started or is still running. Do not retry aggressively; tell the user to retry later or read the daily report.

When an API call fails, report the backend message directly and suggest the smallest next action.
