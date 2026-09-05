"""
API entry point. Exposes:
  GET  /score/{user_id}        -> score, factors, explanation, recent ledger
  POST /transactions/{user_id} -> add a transaction, returns updated score
"""
import json
import os
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from scoring import compute_score
from explain import explain_score

app = FastAPI(title="Groundwork Credit Score API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def _load_json(filename):
    with open(os.path.join(DATA_DIR, filename), encoding="utf-8") as f:
        return json.load(f)


def _save_json(filename, data):
    with open(os.path.join(DATA_DIR, filename), "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def _build_score_response(user_id: str):
    users = _load_json("users.json")
    all_transactions = _load_json("transactions.json")

    user = next((u for u in users if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_transactions = [t for t in all_transactions if t["user_id"] == user_id]
    if not user_transactions:
        raise HTTPException(status_code=404, detail="No transaction history for this user")

    result = compute_score(user_transactions, user["monthsTracked"])
    explanation = explain_score(user["name"], result["score"], result["factors"])

    return {
        "name": user["name"],
        "role": user["role"],
        "monthsTracked": user["monthsTracked"],
        "score": result["score"],
        "scoreLabel": result["scoreLabel"],
        "factors": result["factors"],
        "explanation": explanation,
        "ledger": sorted(user_transactions, key=lambda t: t["date"])[-5:]
    }


@app.get("/score/{user_id}")
def get_score(user_id: str):
    return _build_score_response(user_id)


class NewTransaction(BaseModel):
    date: str        # "YYYY-MM-DD"
    desc: str
    amount: float
    type: str         # "credit" or "debit"


@app.post("/transactions/{user_id}")
def add_transaction(user_id: str, transaction: NewTransaction):
    users = _load_json("users.json")
    if not any(u["id"] == user_id for u in users):
        raise HTTPException(status_code=404, detail="User not found")

    all_transactions = _load_json("transactions.json")
    all_transactions.append({
        "user_id": user_id,
        "date": transaction.date,
        "desc": transaction.desc,
        "amount": transaction.amount,
        "type": transaction.type
    })
    _save_json("transactions.json", all_transactions)

    return _build_score_response(user_id)