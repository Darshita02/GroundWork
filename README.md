# Groundwork — Credit Visibility for the Invisible

A tool that builds a credit-visibility score for people who have never had
a formal credit history — gig workers, street vendors, and small merchants —
using their real, everyday transaction behavior instead of a bank or bureau
file.

---

## The problem

Millions of small vendors and gig workers in India move real money every
day — daily UPI collections, rent, utility bills — but none of it ever
becomes a credit history. Because they have no bureau file, they're
invisible to lenders, even when their actual financial behavior is
completely creditworthy. This isn't a data problem, it's a translation
problem: the signal already exists, it's just never been converted into
something a lender can trust.

## What this project does

Groundwork ingests a user's raw transaction history and turns it into a
transparent, explainable credit score built from four real signals:

| Factor | What it measures |
|---|---|
| Payment consistency | How many weeks show steady, active transaction days |
| Income regularity | How much daily/weekly income varies over time |
| Utility & rent payment record | Whether recurring obligations are paid on time |
| Cash flow volatility | How often income drops sharply month to month |

Each factor contributes a positive or negative weight to the final score,
and every weight is shown to the user — nothing is a black box. An LLM then
turns those weights into a plain-language explanation, so a lender or the
user themselves can understand *why* the score is what it is, not just
what number it landed on.

## Why this matters (and why it's harder than it looks)

Most "AI for fraud/credit" hackathon projects flag transactions or score
risk using a black-box model. This project deliberately does the opposite:
every number on the screen is traceable back to a specific, explainable
signal in the raw data. That's a harder problem than it sounds, because it
means the feature engineering has to do real work — the LLM is only used
to *narrate* the reasoning, never to invent the score itself.

## Architecture

Raw transactions (data/transactions.json)
│
▼
scoring.py → computes 4 factors + final score (pure logic, no LLM)
│
▼
explain.py → LLM turns the factor weights into plain language
│
▼
app.py → serves it all via GET /score/{user_id}
│
▼
frontend/ → displays score, factor breakdown, and recent activity


The scoring math is deliberately kept separate from the explanation step —
this means the score itself is fully deterministic and auditable, and the
LLM's only job is making it understandable, not deciding it.

## Folder structure

invisible-credit-score/
├── README.md
├── data/
│ ├── transactions.json # raw transaction history, multiple users
│ └── users.json # user metadata (name, role, months tracked)
├── backend/
│ ├── requirements.txt
│ ├── app.py # API entry point — GET /score/{user_id}
│ ├── scoring.py # feature engineering + score calculation
│ └── explain.py # LLM call for plain-language explanation
└── frontend/
├── package.json
├── index.html
└── src/
├── main.jsx
├── App.jsx
├── components/
│ ├── Header.jsx
│ ├── ScorePanel.jsx
│ └── Ledger.jsx
└── data/
└── sampleProfile.js # mock data; swap for a live fetch


## Running it locally

**1. Backend**
```bash
cd backend
pip install -r requirements.txt
export ANTHROPIC_API_KEY=your_key_here
uvicorn app:app --reload
```
This starts the API at `http://localhost:8000`. Test it directly:
```bash
curl http://localhost:8000/score/meena_r
```

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
```
This starts the UI at `http://localhost:5173`. By default it reads mock
data from `src/data/sampleProfile.js` — point it at the backend instead by
replacing that import with a `fetch("http://localhost:8000/score/meena_r")`
call in `App.jsx`.

## Sample data included

Two sample users are included out of the box so the app works immediately
without needing real data:
- `meena_r` — a vegetable vendor with 8 months of steady daily UPI income
  and one visible dip during monsoon season (shows the volatility factor
  in action)
- `arjun_k` — an auto-rickshaw driver with tighter margins, to prove the
  scoring generalizes across different income patterns, not just one
  hand-tuned case

## Demo script (2 minutes)

1. Open Meena's profile — score of 71, labeled "Building — steady," despite
   having zero formal credit history.
2. Point to the factor breakdown, specifically the negative weight on
   "Cash flow volatility" — this proves the score reacts to real signals
   instead of just averaging everything out.
3. Switch to Arjun's profile to show a second, structurally different
   pattern scoring correctly on the same logic.
4. Close on the plain-language explanation — this is the part that makes
   the score usable by an actual lender or the person themselves, not just
   a number on a screen.

## What's next (if this moved past a hackathon)

- Replace simulated transaction data with a real UPI/bank statement parser
- Add a lender-facing view that lets them adjust factor weights based on
  their own risk appetite
- Track score movement over time instead of a single snapshot, so users
  can see the effect of specific financial habits