// worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const TELEGRAM_BOT_TOKEN = '8499265790:AAE6z77jD_9jozwdzKMQrrPmRfVvAjhQzl8';
const TELEGRAM_CHAT_ID = '6861066892';

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const data = await request.json();
    const text = `📩 New Support Message\n\n🧑 Name: ${data.name}\n📧 Email: ${data.email}\n💬 Message: ${data.message}\n🕒 ${new Date().toLocaleString()}\nWidget: ${data.widget_type}`;

    const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
    });

    const result = await telegramRes.json();
    if (!result.ok) throw new Error('Telegram API error');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
