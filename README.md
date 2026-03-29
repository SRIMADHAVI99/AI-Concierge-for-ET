#ET AI Concierge

A comprehensive AI-powered platform that provides personalized financial guidance and helps users explore the Economic Times ecosystem.

---

## Features

### Public Features

* Homepage: AI chatbot interface for user interaction
* Smart Onboarding: Collects user financial profile (income, profession, experience, goals)
* Personalized Recommendations: Suggests ET products and services
* Financial Guidance: Provides actionable financial plans
* Follow-up Chat: Users can ask additional queries

---

### Core AI Features

* ET Welcome Concierge: Guides users through onboarding
* Financial Life Navigator: Analyzes financial profile and suggests strategies
* Cross-Sell Engine: Recommends relevant ET services
* Services Marketplace: Suggests insurance, wealth, and financial services

---

## Tech Stack

**Frontend:**

* HTML, CSS, JavaScript

**Backend:**

* Node.js
* Express.js

**AI Integration:**

* OpenAI API

---

## Project Structure

```
hack2/
├── backend/              # Node.js backend
│   ├── server.js         # Main server file
│   ├── routes/           # API routes
│   └── .env              # Environment variables
│
├── frontend/             # Frontend UI
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── README.md
```

---

## Setup Instructions

### Prerequisites

* Node.js (v14 or higher)
* npm
* OpenAI API key

---

### Installation

#### Clone the repository

```bash
git clone <repository-url>
cd hack2
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
OPENAI_API_KEY=your_api_key_here
PORT=3001
```

Run server:

```bash
node server.js
```

---

### Frontend Setup

* Open project in VS Code
* Right-click `index.html`
* Click **Open with Live Server**

---

## API Endpoints

### Public Endpoint

* POST /api/concierge → Get personalized financial recommendations

---

## How It Works

1. User enters:

   * Income
   * Profession
   * Investment Experience
   * Financial Goal

2. Backend:

   * Processes input
   * Sends data to OpenAI API

3. AI:

   * Generates personalized recommendations
   * Suggests ET products and financial strategies

4. Frontend:

   * Displays structured output
   * Allows follow-up interaction

---

## Future Enhancements

* Voice-based AI concierge
* Real-time financial tracking
* Advanced recommendation engine
* Multi-language support

---

## License

This project is developed for hackathon purposes.
