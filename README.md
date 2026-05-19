# 🤖 AI Smart Complaint Management System

A full-stack complaint management platform powered by AI. Users submit civic complaints, and AI automatically classifies urgency, recommends departments, generates summaries, and creates automated responses.

---

## 🚀 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS    |
| Backend   | Node.js + Express.js              |
| Database  | MongoDB Atlas (Mongoose)          |
| Auth      | JWT + bcrypt                      |
| AI        | OpenRouter API (GPT-4o-mini)      |
| Charts    | Chart.js + react-chartjs-2        |

---

## 📁 Project Structure

```
complaint-system/
├── backend/
│   ├── config/db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register/Login
│   │   ├── complaintController.js   # CRUD + stats
│   │   └── aiController.js          # AI analysis
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT protection
│   │   └── errorMiddleware.js       # Global errors
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Complaint.js             # Complaint schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── aiRoutes.js
│   ├── services/
│   │   └── openrouterService.js     # AI API calls
│   ├── utils/
│   │   └── aiPromptBuilder.js       # Prompt engineering
│   ├── .env                         # Environment variables
│   └── server.js                    # Entry point
│
└── frontend/
    └── src/
        ├── components/              # Reusable UI
        ├── pages/                   # Route pages
        ├── services/api.js          # Axios API layer
        └── context/AuthContext.jsx  # Global auth state
```

---

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- OpenRouter API key (free at openrouter.ai)

### 1. Clone & Install Backend

```bash
cd backend
npm install
```

### 2. Configure Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/complaints
JWT_SECRET=your_long_random_secret_here
OPENROUTER_API_KEY=sk-or-v1-your-key-here
FRONTEND_URL=http://localhost:5173
```

### 3. Start Backend

```bash
npm run dev    # Development (nodemon)
npm start      # Production
```

### 4. Install & Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## 📡 API Reference

### Auth
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/api/auth/register` | `{username, email, password}` | Public |
| POST | `/api/auth/login` | `{email, password}` | Public |
| GET | `/api/auth/me` | — | Private |

### Complaints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/complaints` | Create complaint | Public |
| GET | `/api/complaints` | Get all (with filters) | Public |
| GET | `/api/complaints/stats` | Dashboard stats | Public |
| GET | `/api/complaints/:id` | Get one | Public |
| PUT | `/api/complaints/:id` | Update status | Private |
| DELETE | `/api/complaints/:id` | Delete | Admin |

**Query params for GET /api/complaints:**
- `search` - text search
- `location` - filter by location
- `category` - filter by category
- `status` - filter by status
- `page` - page number
- `limit` - items per page

### AI
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/analyze` | Analyze & save to complaint | Private |
| POST | `/api/ai/quick-analyze` | Quick analysis (no save) | Public |

---

## 🤖 AI Features

The AI system uses **OpenRouter** to call GPT-4o-mini and returns:

```json
{
  "priority": "High",
  "department": "Municipal Water Department",
  "summary": "Water pipeline burst near main market area causing water logging.",
  "response": "Your complaint has been registered and forwarded to the Municipal Water Department with high priority. Expected resolution within 3 days.",
  "estimatedResolutionDays": 3
}
```

### Priority Levels
- 🔴 **Critical** — Life-threatening, affects many people
- 🟠 **High** — Urgent public infrastructure issue
- 🟡 **Medium** — Important but not immediate danger
- ⚪ **Low** — Minor inconvenience

---

## 🏗️ MongoDB Schemas

### Complaint
```javascript
{
  name, email, title, description,
  category, location, status,
  aiAnalysis: { priority, department, summary, response },
  timeline: [{ status, note, updatedAt }],
  createdAt, updatedAt
}
```

### User
```javascript
{ username, email, password (hashed), role: 'user'|'admin', createdAt }
```

---

## 🌐 Deployment

### Backend → Render
1. Push to GitHub
2. New Web Service → connect repo
3. Build: `npm install`, Start: `npm start`
4. Add env variables in Render dashboard

### Frontend → Vercel/Render
1. Set `VITE_API_URL=https://your-backend.onrender.com/api`
2. Build: `npm run build`, Output: `dist`

### MongoDB → Atlas
1. Create free cluster at mongodb.com
2. Get connection string → paste in backend `.env`

---

## ✨ Features

- ✅ Submit complaints (public, no login required)
- ✅ Track complaints by ID
- ✅ Search by location, category, status
- ✅ AI urgency detection & department routing
- ✅ AI-generated summaries & automated responses
- ✅ Complaint timeline tracking
- ✅ JWT authentication
- ✅ Role-based access (user/admin)
- ✅ Dashboard with charts
- ✅ Card & table views
- ✅ Pagination
- ✅ Responsive design

---

## 📸 Screenshots

*(Add screenshots after running the project)*

1. Dashboard with charts
2. Complaint list page
3. Complaint detail with AI analysis
4. Submit complaint form
5. AI Analysis page
6. Login/Register pages
