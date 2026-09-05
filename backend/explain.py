"""
Turns the numeric score factors into a plain-language explanation
using Groq's free API (runs open-source Llama models).
"""
import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


def explain_score(profile_name, score, factors):
    factor_lines = "\n".join(
        f"- {f['label']}: {f['weight']:+d} ({f['detail']})" for f in factors
    )

    prompt = f"""You are explaining a credit-visibility score to a small business owner
who has never had a formal credit score before. Be warm, plain, and specific.
Do not use jargon like "underwriting" or "risk model."

User: {profile_name}
Score: {score}/100

Factors:
{factor_lines}

Write a 3-4 sentence explanation of why this score is what it is,
in plain language, addressed directly to the user."""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )

    return response.choices[0].message.content