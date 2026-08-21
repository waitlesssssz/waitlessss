# WaitLess

**AI-Powered Hospitality System** — a contextual conversational agent that replaces static QR-code menus with an intelligent virtual waiter, guiding guests from onboarding to order confirmation in a single lightweight web session.

---

## Overview

WaitLess reimagines the restaurant ordering experience by embedding a conversational AI layer directly into the guest journey. Instead of scrolling through a static PDF menu after scanning a QR code, guests interact with a virtual waiter capable of understanding natural language, filtering the menu by dietary needs, recommending dishes contextually, and confirming orders — all within a frictionless, no-download web widget.

The system closes the loop between guest and kitchen: once an order is confirmed, it is instantly routed to restaurant staff via Telegram, eliminating manual order-taking and reducing service latency.

---

## Tech Stack & Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | `index.html`, `widget.js`, `widget.css` | Custom lightweight UI/UX widget — no framework overhead, optimized for instant load on mobile after QR scan |
| **Backend** | Netlify Functions (`netlify/functions/`) | Serverless architecture handling API requests, session logic, and third-party integrations |
| **AI Engine** | Google Gemini API | Natural language understanding, contextual response generation, dietary filtering, upselling logic |
| **Notifications** | Telegram Bot API | Real-time order delivery to restaurant staff via group chat |

**Architecture flow:**

```
Guest scans QR → Web Widget loads → Conversational session with Gemini
     → Menu filtering / recommendations → Order confirmation
     → Netlify Function triggers Telegram Bot → Staff receives order instantly
```

The system is fully serverless: Netlify Functions act as the bridge between the client-side widget and external APIs (Gemini, Telegram), keeping the frontend lightweight and the backend stateless and scalable.

---

## Key Features

### 🧠 Prompt Engineering
The virtual waiter's personality, tone, and behavioral boundaries are shaped through carefully engineered system prompts sent to Gemini. This includes structured instructions for menu awareness, order-taking discipline (e.g. requiring table number and explicit confirmation before finalizing), and constrained output formatting — ensuring the AI behaves reliably within a commercial hospitality context rather than as an open-ended chatbot.

### 💬 Contextual Conversational Logic
The agent maintains conversation state across a session, allowing it to track what a guest has already ordered, respond to follow-up questions naturally, and apply dietary filters (e.g. vegetarian, gluten-free) without the guest needing to restart the interaction. This context-awareness extends to smart upselling — the AI suggests complementary items (a drink, a side, a dessert) based on what's already in the order, mimicking the judgment of an experienced human waiter.

### ⚡ Frictionless Onboarding
There is no app to download and no account to create. A single QR scan opens a fast-loading, purpose-built web widget — removing every point of friction between a guest's intent and their first interaction with the system. This design choice directly targets the abandonment problem common in traditional QR-menu solutions.

---

## Repository Structure

```
waitless/
├── index.html              # Entry point for the web widget
├── widget.js                # Core client-side logic (chat UI, state, API calls)
├── widget.css                # Lightweight custom styling
├── netlify/
│   └── functions/            # Serverless backend functions
│       ├── gemini.js          # Handles Gemini API requests & prompt orchestration
│       └── telegram.js        # Sends confirmed orders to the Telegram Bot API
└── README.md
```

---

**Developed by Lidiya Berezhnaya** — researcher at the intersection of Digital Humanities and AI Product Development.
