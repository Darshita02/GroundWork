export const profile = {
  name: "Meena R.",
  role: "Vegetable vendor, Dadar market",
  monthsTracked: 8,
  score: 71,
  scoreLabel: "Building — steady",
  factors: [
    { id: "consistency", label: "Payment consistency", weight: 34, detail: "34 of the last 34 weeks show at least 5 active transaction days." },
    { id: "regularity", label: "Income regularity", weight: 28, detail: "Daily UPI inflow varies less than 18% week to week over 8 months." },
    { id: "utility", label: "Utility & rent payment record", weight: 22, detail: "Electricity bill paid on or before due date in 7 of 8 months." },
    { id: "volatility", label: "Cash flow volatility", weight: -13, detail: "Two months showed inflow drops greater than 25% (monsoon season)." }
  ],
  ledger: [
    { date: "2026-08-29", desc: "Daily UPI collections", amount: 4200, type: "credit" },
    { date: "2026-08-28", desc: "Electricity bill — BEST", amount: -1150, type: "debit" },
    { date: "2026-08-27", desc: "Daily UPI collections", amount: 3800, type: "credit" },
    { date: "2026-08-24", desc: "Stall rent", amount: -2500, type: "debit" },
    { date: "2026-08-23", desc: "Daily UPI collections", amount: 4600, type: "credit" }
  ]
}