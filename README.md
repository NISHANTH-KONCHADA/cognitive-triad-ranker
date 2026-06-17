# Cognitive Triad Ranker

This repository contains the code for the **Intelligent Candidate Discovery & Ranking Challenge**.

## Architecture: The Cognitive Triad
We constructed a highly optimized, zero-shot candidate ranking system running locally in pure Python. It evaluates all 100,000 candidates in under 20 seconds on CPU. 

1. **The Sleuth (L1)**: Detects impossible honeypots and heavily penalizes keyword-stuffing titles.
2. **The Assessor (L2)**: Rewards explicit NLP/IR keywords (`vector database`, `Pinecone`, `RAG`, etc.) while penalizing pure CV/Speech profiles, perfectly matching the JD's requirement for product engineering over pure research.
3. **The Recruiter (L3)**: Applies behavioral economic multipliers—rewarding sub-30 day notice periods and Pune/Noida locations, while penalizing those inactive for 6+ months and those with poor recruiter response rates.

## Running the Pipeline

Ensure you have Python installed. The codebase relies solely on the Python Standard Library to guarantee it passes the 5-minute sandbox constraint. No external dependencies required!

```bash
python run_pipeline.py --candidates candidates.jsonl --out submission.csv
```

## Validating Output
```bash
python validate_submission.py submission.csv
```

## Sandbox
The sandbox demo is available in `demo.ipynb` which can be uploaded directly to Google Colab.
