// netlify/functions/chat.js
//
// This function runs on Netlify's server, never in the guest's browser.
// It is the only place that ever touches the Gemini API key, so the key
// stays hidden from anyone visiting the site.

const SYSTEM_PROMPT = `Ты — дружелюбный ИИ-официант кафе WaitLess. Отвечай ТОЛЬКО на русском языке, кратко и по-человечески, без канцелярита.

Твоя задача:
1. Поприветствовать гостя и сразу предложить конкретный следующий шаг (например: "Здравствуйте! Что хотите заказать — может, для начала кофе или что-то из меню?").
2. Помочь выбрать блюда/напитки из меню кафе, отвечать только по меню (не выдумывай блюда, которых нет).
3. Уточнять детали заказа (размер, добавки, количество), если это уместно.
4. В конце — чётко подвести итог заказа списком и спросить подтверждение ("Всё верно, отправляю заказ?").
5. после подтверждения заказа гостем сообщи, что заказ отправлен на кухню, и что официант скоро подойдёт к столику для оплаты.

Если гость спрашивает что-то не по теме кафе — вежливо верни разговор к меню.

[СЮДА ВСТАВИТЬ МЕНЮ КАФЕ, когда пришлёшь его — пока меню нет, отвечай общими словами и проси уточнить, что есть в наличии.]`;

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY is not set in Netlify environment variables" },
      { status: 500 },
    );
  }

  let messages;
  try {
    const body = await req.json();
    messages = body.messages || [];
  } catch (e) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Convert our simple {role, text} history into Gemini's format
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const model = "gemini-3.5-flash-lite";
  const baseUrl = process.env.GOOGLE_GEMINI_BASE_URL || "https://generativelanguage.googleapis.com";
  const url = `${baseUrl}/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || "Gemini API error" },
        { status: response.status },
      );
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Извините, не получилось сформировать ответ. Попробуйте ещё раз.";

    return Response.json({ reply });
  } catch (err) {
    return Response.json({ error: "Server error: " + err.message }, { status: 500 });
  }
};
