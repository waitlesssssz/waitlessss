// widget.js — чат-виджет ИИ-официанта WaitLess
// Подключается на странице вместе с widget.css и вызывает
// netlify/functions/chat.js для получения ответов от Gemini.

(function () {
  function init() {
    var btn = document.getElementById('chat-with-waiter');
    if (!btn) return;

    var history = [];

    var win = document.createElement('div');
    win.id = 'waitless-chat-window';
    win.innerHTML =
      '<div class="wl-chat-header">' +
        '<span>ИИ-официант</span>' +
        '<button type="button" aria-label="Закрыть чат">&times;</button>' +
      '</div>' +
      '<div class="wl-chat-messages"></div>' +
      '<div class="wl-chat-input-row">' +
        '<input type="text" placeholder="Напишите сообщение…" autocomplete="off">' +
        '<button type="button">Отправить</button>' +
      '</div>';
    document.body.appendChild(win);

    var messagesEl = win.querySelector('.wl-chat-messages');
    var closeBtn = win.querySelector('.wl-chat-header button');
    var input = win.querySelector('.wl-chat-input-row input');
    var sendBtn = win.querySelector('.wl-chat-input-row button');

    function addMessage(role, text) {
      var msg = document.createElement('div');
      msg.className = 'wl-msg ' + (role === 'user' ? 'wl-msg-user' : 'wl-msg-assistant');
      msg.textContent = text;
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return msg;
    }

    var greeted = false;

    function openWindow() {
      win.classList.add('wl-open');
      input.focus();
      if (!greeted) {
        greeted = true;
        addMessage('assistant', 'Здравствуйте! 😊 Что бы вы хотели сегодня — чашечку кофе, позавтракать у нас, или показать вам сегодняшние спешлы и скидки?');
      }
    }

    function closeWindow() {
      win.classList.remove('wl-open');
    }

    function sendMessage() {
      var text = input.value.trim();
      if (!text) return;
      input.value = '';
      history.push({ role: 'user', text: text });
      addMessage('user', text);

      var typing = addMessage('assistant', 'Печатает…');
      typing.classList.add('wl-typing');
      sendBtn.disabled = true;

      fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          typing.remove();
          if (!result.ok) {
            addMessage('assistant', result.data.error || 'Не получилось получить ответ. Попробуйте ещё раз.');
            return;
          }
          history.push({ role: 'assistant', text: result.data.reply });
          addMessage('assistant', result.data.reply);
        })
        .catch(function () {
          typing.remove();
          addMessage('assistant', 'Ошибка соединения. Попробуйте ещё раз.');
        })
        .finally(function () {
          sendBtn.disabled = false;
        });
    }

    btn.addEventListener('click', openWindow);
    closeBtn.addEventListener('click', closeWindow);
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
