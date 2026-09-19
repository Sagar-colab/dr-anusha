# Dr. Anusha — AI Health Companion

A warm, AI-powered health companion chatbot designed to provide general health and wellness guidance through a friendly doctor-inspired persona.

Dr. Anusha is built to create a supportive and approachable conversational experience while maintaining clear safety boundaries around medical information.

The application is designed to **inform and support users without diagnosing medical conditions or prescribing medication**, and encourages users to seek professional medical help when appropriate.

## ✨ Features

- 🤖 AI-powered conversational health companion
- 💬 Real-time streaming responses
- 🧠 Keyword-based mood detection
- 🌿 Mood-aware conversational experience
- 🫁 Guided 4-7-8 breathing companion for detected distress
- 🚨 Emergency-situation guidance
- 🩺 No-diagnosis and no-prescription safeguards
- 📱 Responsive and modern user interface
- ⚡ Fast server-side AI integration using Gemini
- 🔐 Environment-based API key configuration
- 🎨 Custom typography and calming visual design
- 🧩 Modular component-based architecture

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, TypeScript
- **Styling:** Tailwind CSS v4
- **Fonts:** Fraunces + Inter
- **AI:** Google Gemini (`gemini-2.5-flash`)
- **Deployment:** Vercel
- **Version Control:** GitHub

## 🏗️ Architecture

```text
src/
├── app/
│   ├── page.tsx
│   └── api/
│       └── chat/
│           └── route.ts
│
├── components/
│   ├── Chat.tsx
│   └── BreathingCompanion.tsx
│
├── lib/
│   ├── mood.ts
│   └── system-prompt.ts
│
└── types/
    └── chat.ts
```

---

### Created by **Sagar U.**
