# 🚀 ET AI Concierge

A comprehensive AI-powered platform that provides personalized financial guidance and helps users explore the Economic Times ecosystem.

---

## 📌 Overview

ET AI Concierge is a conversational AI system that understands a user’s financial profile and delivers personalized recommendations across ET products, tools, and services.

---

## 💡 Features

### User Features

* AI Chat Interface for onboarding
* Multi-step financial profiling
* Personalized recommendations
* Financial action plans
* Follow-up conversational support

---

### Core AI Capabilities

* ET Welcome Concierge
* Financial Life Navigator
* Cross-Sell Recommendation Engine
* Services Marketplace Suggestions

---

## 🛠️ Tech Stack

**Frontend:**

* React.js (Vite)
* JavaScript, CSS

**Backend:**

* Node.js
* Express.js

**AI:**

* OpenAI API

---

## 📁 Project Structure

```
AI-Concierge-for-ET/
├── backend/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js (v14 or higher)
* npm
* OpenAI API key

---

### 1. Clone Repository

```bash
git clone <your-repo-link>
cd AI-Concierge-for-ET
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
OPENAI_API_KEY=your_api_key_here
PORT=3001
```

Run backend:

```bash
node server.js
```

OR:

```bash
npx nodemon server.js
```

---

## 🌐 Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## 🔗 API Endpoint

* POST `/api/concierge` → Generates personalized recommendations

---

## 🧪 How It Works

1. User enters:

   * Income
   * Profession
   * Experience
   * Financial Goal

2. Backend:

   * Processes input
   * Sends structured data to OpenAI

3. AI:

   * Generates personalized recommendations

4. Frontend:

   * Displays structured financial plan
   * Allows follow-up interaction

---

## 🚧 Future Enhancements

* Voice-based AI assistant
* Real-time portfolio tracking
* Advanced recommendation engine
* Multi-language support

---

## 👨‍💻 Author

Hackathon Project – AI-driven financial concierge system
