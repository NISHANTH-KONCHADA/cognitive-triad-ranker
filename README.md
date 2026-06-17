<div align="center">
  <img src="https://github.com/NISHANTH-KONCHADA/cognitive-triad-ranker/blob/main/landing-page/src/assets/dig.png?raw=true" alt="Architecture Diagram" width="800"/>

  <h1>Cognitive Triad Architecture</h1>
  <p><strong>Intelligent Candidate Discovery & Ranking Engine — India.Runs Hackathon</strong></p>

  [![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)
  [![Dependencies](https://img.shields.io/badge/Dependencies-Zero-brightgreen.svg)]()
  [![Execution](https://img.shields.io/badge/Execution-O(1)%20Streaming-orange.svg)]()
  [![Website](https://img.shields.io/badge/Website-Live_Demo-8b5cf6.svg)](https://NISHANTH-KONCHADA.github.io/cognitive-triad-ranker/)
</div>

---

## ⚡ Overview

The **Cognitive Triad Architecture** is a blazing-fast, highly deterministic candidate ranking engine built strictly with pure Python standard libraries. It evaluates large-scale datasets (100,000+ candidates) in **under 20 seconds** on standard CPU, completely bypassing memory constraints through an O(1) streaming parser.

Built for the **India.Runs Data & AI Challenge**, this system looks past keyword stuffing and vanity titles to find genuine Senior AI Engineers with strong NLP/RAG product backgrounds, optimal notice periods, and high response rates.

## 🧠 The Architecture Layers

1. **L1: The Sleuth (Anomaly Detector)**
   - Acts as an initial trapdoor. Detects impossible experience gaps, eliminates honeypots (e.g., Marketing Managers keyword-stuffing AI terms), and ensures only relevant domains enter the funnel.

2. **L2: The Assessor (Semantic Ontology Scorer)**
   - Maps deep domain expertise. It actively rewards explicit NLP/IR engineering keywords (`vector database`, `Pinecone`, `RAG`, `LLM`) while neutralizing pure Computer Vision or Speech profiles, matching the JD's requirement for product engineering over pure research.

3. **L3: The Recruiter (Behavioral Multiplier)**
   - Applies behavioral economic multipliers. It rewards candidates with sub-30 day notice periods and Pune/Noida locations, while penalizing those inactive for 6+ months or displaying poor recruiter response rates.

---

## 🚀 Quickstart (Local Evaluation)

Because we rely entirely on the Python Standard Library, there are **zero dependencies** to install. No `pip install`, no Virtual Environments.

**1. Run the Pipeline**
Execute the streamer over the compressed `.jsonl.gz` dataset to generate the final top 100 predictions:
```bash
python run_pipeline.py --candidates candidates.jsonl --out submission.csv
```

**2. Validate Output**
Verify the structural integrity of your submission:
```bash
python validate_submission.py submission.csv
```

---

## 🧪 Interactive Sandbox

Want to test it instantly? We've provided an interactive Google Colab notebook for the judges.
👉 **[Open Sandbox Demo](https://colab.research.google.com/drive/1hsgdND3edPTgdujltDK42j_wqRjzZ2tD?usp=sharing)**

## 🌐 Live Architecture Site

View our interactive, animated React landing page explaining the data flow:
👉 **[Visit Landing Page](https://NISHANTH-KONCHADA.github.io/cognitive-triad-ranker/)**
