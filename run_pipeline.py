import argparse
import csv
from src.ranker import process_candidates

def main():
    parser = argparse.ArgumentParser(description="Rank candidates for AI Engineer role.")
    parser.add_argument("--candidates", required=True, help="Path to candidates.jsonl or .gz")
    parser.add_argument("--out", required=True, help="Path to output submission.csv")
    args = parser.parse_args()
    
    print(f"Processing candidates from {args.candidates}...")
    top_candidates = process_candidates(args.candidates, top_k=100)
    
    print(f"Writing top {len(top_candidates)} to {args.out}...")
    with open(args.out, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['candidate_id', 'rank', 'score', 'reasoning'])
        
        for rank, (score, cand_id, reasoning) in enumerate(top_candidates, start=1):
            # Ensure max score formatting
            formatted_score = f"{score:.4f}"
            writer.writerow([cand_id, rank, formatted_score, reasoning])
            
    print("Done!")

if __name__ == "__main__":
    main()
