# Groundwork — Credit Visibility for the Invisible

**A live credit-scoring tool for people who have never had a formal credit
history — built from real transaction behavior, not a bureau file.**

Built for the Razorpay Buildathon (Open Track).

---

## The problem

Millions of small vendors and gig workers in India move real money every
day — daily UPI collections, rent, utility bills — but none of it ever
becomes a credit history. Because they have no bureau file, they're
invisible to lenders, even when their actual financial behavior is
completely creditworthy. This isn't a data problem, it's a translation
problem: the signal already exists, it just has never been converted into
something a lender can trust.

## What Groundwork does

Groundwork ingests a user's raw transaction history and turns it into a
transparent, explainable credit score built from four real signals:

| Factor | What it measures |
|---|---|
| Payment consistency | How many weeks show steady, active transaction days |
| Income regularity | How much daily/weekly income varies over time |
| Utility & rent payment record | Whether recurring obligations are paid on time |
| Cash flow volatility | How often income drops sharply month to month |

Every factor's weight is shown directly to the user — nothing is a black
box. An LLM (via Groq) then turns those weights into a plain-language
explanation, so a lender — or the vendor themselves — can understand *why*
the score is what it is, not just what number it landed on.

**It's also live, not static.** You can add a real transaction through the
UI and watch the score recompute in real time, using the same scoring
logic that generated the original number — proving the system actually
responds to behavior rather than displaying a fixed, hardcoded result.

## Why this is harder than a typical fraud/credit demo

Most "AI for credit" hackathon projects wrap a black-box model in a chat
interface. Groundwork deliberately does the opposite: every number on
screen is traceable to a specific, auditable signal in the raw data. The
scoring math is 100% deterministic Python — the LLM's only job is to
*narrate* the reasoning afterward, never to invent or adjust the score
itself. That separation is what makes the score defensible to an actual
lender, not just impressive in a demo.

## Architecture

Raw transactions (data/transactions.json)
│
▼
scoring.py → computes 4 factors + final score (pure logic, no LLM)
│
▼
explain.py → Groq LLM turns the factor weights into plain language
│
▼
app.py → serves GET /score/{user_id} and POST /transactions/{user_id}
│
▼
frontend/ → live dashboard: score, factors, ledger, add-transaction form


## Folder structure 

GroundWork/
├── README.md
├── .gitignore
├── data/
│ ├── transactions.json # transaction history, multiple users
│ └── users.json # user metadata
├── backend/
│ ├── requirements.txt
│ ├── app.py # API — GET /score, POST /transactions
│ ├── scoring.py # feature engineering + score calculation
│ └── explain.py # Groq call for plain-language explanation
└── credit_score_frontend/
├── package.json
├── index.html
└── src/
├── main.jsx
├── app.jsx
├── components/
│ ├── header.jsx
│ ├── scorepanel.jsx
│ ├── ledger.jsx
│ └── AddTransaction.jsx
└── data/
└── sampleProfile.js # fallback mock data


## Running it locally

**1. Backend**
```bash
cd backend
pip install -r requirements.txt
```
Create a `.env` file inside `backend/` with your Groq API key: GROQ_API_KEY=gsk_your_key_here

Then start the server:
```bash
uvicorn app:app --reload
```
API runs at `http://localhost:8000`. Test it directly:
```bash
curl http://localhost:8000/score/meena_r
```

**2. Frontend**
```bash
cd credit_score_frontend
npm install
npm run dev
```
UI runs at `http://localhost:5173` and fetches live from the backend —
no mock data used by default.

## Sample data included

- `meena_r` — a vegetable vendor with 8 months of steady daily UPI income
  and a visible dip during monsoon season, so the volatility factor has
  something real to react to.
- `arjun_k` — an auto-rickshaw driver with tighter margins, included to
  show the scoring logic generalizes across different income patterns
  rather than being hand-tuned to one profile.

## Live demo script 

1. **Open Meena's dashboard** — walk through the score and the four
   factors, pointing specifically at the negative weight on "Cash flow
   volatility." This proves the score reacts to real signals instead of
   just averaging everything into a flat number.
2. **Read the plain-language explanation** — this is the part an actual
   lender, or Meena herself, could act on without needing to understand
   the underlying math.
3. **The moment that matters:** use the "Add a transaction" form live —
   add a new income entry or a missed payment — and watch the score and
   factor weights recompute in real time on screen. This is what proves
   Groundwork is a working system, not a static mockup.
4. **Close on the framing:** this is what credit scoring could look like
   for the roughly 190 million+ credit-invisible adults in India — built
   from behavior that already exists, not from a file that doesn't.
