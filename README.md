# BirdsGolden Telegram Web App

## Setup

1. Upload `index.html` and `script.js` to GitHub Pages repo.
2. Enable GitHub Pages in `Settings -> Pages`.
3. Use the GitHub Pages URL as Web App URL in your Telegram bot.

## API Endpoints (example)

- `GET /api/user/:userId` → JSON:
```json
{
  "referrals":[{"name":"Անուշ","earned":5000}],
  "tasks":{"completed":2,"earnings":5500},
  "balance":10500
}
