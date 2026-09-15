exports.handler = async (event) => {
  const { table, items } = JSON.parse(event.body);

  const text = 🔔 Новый заказ!\nСтол: ${table}\n\n${items};

  const url = https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: text,
    }),
  });

  if (!response.ok) {
    return { statusCode: 500, body: "Failed to send" };
  }

  return { statusCode: 200, body: "OK" };
};
