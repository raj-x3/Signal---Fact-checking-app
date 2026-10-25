# SignalCheck — India-First AI Fact-Checking Platform

SignalCheck is an epistemic evidence-investigation platform engineered for claims circulating in India. It pairs **Google Gemma 4** (`gemma-4-26b-a4b-it` via `@google/genai`) with an **8-source multi-provider retrieval pipeline** (Tavily, Brave, GDELT, Google Fact Check Tools, Crossref, PubMed, Indian Government Portals, and Indian Fact-Checkers Registry).

The project is structured into clean, independent `frontend/` and `backend/` folders that can be run separately or together from your terminal.

---

## 📁 Project Structure

```
signalcheck/
├── frontend/                  # React 19 + TypeScript + Vite + Tailwind 4 UI
│   ├── src/                   # Components, types, services, and styling
│   ├── public/                # Static assets & favicon
│   ├── index.html             # HTML root
│   ├── vite.config.ts         # Vite server & /api proxy to backend (port 5001)
│   ├── package.json           # Frontend dependencies and scripts
│   └── .env.example           # Frontend environment settings
│
├── backend/                   # Node.js + Express + TypeScript + Gemma 4 API
│   ├── src/
│   │   ├── routes/            # GET /api/health, POST /api/fact-check
│   │   ├── services/          # Gemma 4 engine & fact-check orchestrator
│   │   ├── providers/         # 8 multi-source evidence adapters & aggregator
│   │   ├── schemas/           # Zod validation schemas
│   │   ├── middleware/        # Rate limiting & error handling
│   │   ├── utils/             # URL normalization & Devanagari text analysis
│   │   ├── config/            # Environment configuration
│   │   └── server.ts          # Express server entry point
│   ├── package.json           # Backend dependencies and scripts
│   ├── tsconfig.json          # TypeScript NodeNext configuration
│   ├── .env.example           # Backend environment template
│   └── README.md              # Detailed backend API reference
│
├── scripts/
│   └── dev.js                 # Unified dev runner to launch both services
├── package.json               # Root monorepo orchestrator scripts
└── README.md                  # Main documentation (this file)
```

---

## 💻 Terminal Commands

### Option A: Run Both Together (Recommended)
From the root project folder, you can run both backend (port 5001) and frontend (port 3000) concurrently in a single terminal:

```bash
npm run dev
```

---

### Option B: Run in Separate Terminals

#### 1. Backend Terminal (Port 5001)
Open a new terminal tab:
```bash
cd backend
npm run dev
```
*Output: Backend running on `http://localhost:5001`.*

#### 2. Frontend Terminal (Port 3000)
Open a second terminal tab:
```bash
cd frontend
npm run dev
```
*Output: Frontend running on `http://localhost:3000`.*

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🧪 Testing the Platform

### Running Backend Integration & Unit Tests
Run the 23-test suite covering multilingual Hindi/English claim decomposition, URL sanitization, multi-source retrieval, and verdict assignment:

```bash
# From root:
npm test

# Or inside the backend folder:
cd backend
npm test
```

### Checking Backend Health
While the backend is running:
```bash
curl http://localhost:5001/api/health
```

### Testing a Fact-Check via Terminal (cURL)
```bash
curl -X POST http://localhost:5001/api/fact-check \
  -H "Content-Type: application/json" \
  -d '{"claim": "Indian government announced 2026 solar rooftop subsidy scheme"}'
```

---

## 🔑 Environment Configuration

Create a `.env` file in the `backend/` folder:

```bash
cp backend/.env.example backend/.env
```

| Variable | Required? | Purpose | Default |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | Port for the backend API | `5001` |
| `FRONTEND_URL` | Optional | Allowed CORS origin | `http://localhost:3000` |
| `GEMMA_API_KEY` | Recommended | Google GenAI API key for Gemma 4 | Uses offline heuristic engine if blank |
| `GEMMA_MODEL_ID` | Optional | Model identifier | `gemma-4-26b-a4b-it` |
| `TAVILY_API_KEY` | Optional | Commercial deep web search | Optional (1,000 free searches/mo) |
| `BRAVE_SEARCH_API_KEY` | Optional | Independent web crawler | Optional (2,000 free queries/mo) |
| `GOOGLE_FACT_CHECK_API_KEY` | Optional | ClaimReview database | Optional |

> **Zero-Key Fallback**: SignalCheck includes zero-key public providers (GDELT 2.0 News, Crossref Academic, PubMed PMC, and Indian Government Portals) and an offline heuristic reasoning engine. The platform runs out of the box even before API keys are added.

---

## 📦 Building for Production

```bash
# Build both backend and frontend from root:
npm run build

# Start the compiled backend:
cd backend && npm start

# Preview the compiled frontend:
cd frontend && npm run preview
```
