import json
import gzip
import re
from datetime import datetime

def is_honeypot(cand):
    # Check for impossible skills
    for skill in cand.get('skills', []):
        if skill.get('proficiency') == 'expert' and skill.get('duration_months', 0) == 0:
            return True
            
    # Check for impossible career durations
    total_career_months = sum(job.get('duration_months', 0) for job in cand.get('career_history', []))
    yoe = cand.get('profile', {}).get('years_of_experience', 0)
    
    # Allow 2 years of margin for overlapping jobs or internships before graduation
    if total_career_months > (yoe * 12) + 24:
        return True
        
    return False

def extract_text_corpus(cand):
    text_parts = []
    text_parts.append(cand.get('profile', {}).get('headline', ''))
    text_parts.append(cand.get('profile', {}).get('summary', ''))
    
    for job in cand.get('career_history', []):
        text_parts.append(job.get('title', ''))
        text_parts.append(job.get('description', ''))
        
    for skill in cand.get('skills', []):
        text_parts.append(skill.get('name', ''))
        
    return " ".join(text_parts).lower()

def score_candidate(cand):
    if is_honeypot(cand):
        return -1.0, "Identified as a honeypot candidate (impossible profile)."
        
    profile = cand.get('profile', {})
    signals = cand.get('redrob_signals', {})
    
    title = profile.get('current_title', '').lower()
    yoe = profile.get('years_of_experience', 0)
    
    # 1. Title Penalty
    bad_titles = ['marketing', 'hr ', 'hr manager', 'accountant', 'sales', 'customer support', 'graphic design', 'content writer', 'operations']
    if any(bt in title for bt in bad_titles):
        return -1.0, f"Title ({profile.get('current_title')}) is not an engineering fit."
        
    # 2. Base Score
    base_score = 50.0
    
    # 3. YOE Scoring (target 5-9)
    if 5 <= yoe <= 9:
        base_score += 10
    elif 4 <= yoe < 5 or 9 < yoe <= 11:
        base_score += 5
    else:
        base_score -= 10
        
    # 4. IT Services vs Product Check
    industries = [job.get('industry', '') for job in cand.get('career_history', [])]
    if len(industries) > 0 and all(ind == 'IT Services' for ind in industries):
        base_score -= 15 # Penalize pure consulting
        
    # 5. Semantic Matching
    corpus = extract_text_corpus(cand)
    nlp_ir_keywords = [
        'rag', 'pinecone', 'vector', 'embedding', 'retrieval', 'ranking', 
        'llm', 'fine-tuning', 'recommender', 'hybrid search', 'qdrant', 
        'weaviate', 'faiss', 'milvus', 'ndcg', 'mrr', 'a/b testing', 
        'sentence-transformer', 'xgboost', 'nlp', 'search'
    ]
    cv_speech_keywords = [
        'image classification', 'speech recognition', 'gans', 'tts', 
        'object detection', 'computer vision', 'opencv', 'yolo'
    ]
    
    nlp_hits = sum(1 for kw in nlp_ir_keywords if kw in corpus)
    cv_hits = sum(1 for kw in cv_speech_keywords if kw in corpus)
    
    base_score += (nlp_hits * 3) # Big boost for each NLP/IR keyword
    
    if cv_hits > 0 and nlp_hits == 0:
        base_score -= 20 # Penalize pure CV/Speech

    if nlp_hits == 0:
        # If no NLP/IR signals, this is likely not a fit.
        base_score -= 30
        
    # 6. Behavioral Multipliers
    response_rate = signals.get('recruiter_response_rate', 0.0)
    
    # Active date penalty
    last_active = signals.get('last_active_date', '2020-01-01')
    try:
        last_active_date = datetime.strptime(last_active, "%Y-%m-%d")
        days_inactive = (datetime(2026, 6, 17) - last_active_date).days
        if days_inactive > 180:
            base_score *= 0.5 # 50% penalty
    except:
        pass
        
    notice_period = signals.get('notice_period_days', 60)
    if notice_period <= 30:
        base_score *= 1.1
    elif notice_period > 60:
        base_score *= 0.8
        
    location = profile.get('location', '').lower()
    relocate = signals.get('willing_to_relocate', False)
    if 'pune' in location or 'noida' in location:
        base_score *= 1.2
    elif relocate:
        base_score *= 1.0
    else:
        base_score *= 0.7 # Penalty for not in target location and not willing to relocate
        
    final_score = base_score * max(0.1, response_rate) # Response rate is a huge multiplier
    
    # Normalize score somewhat to 0-1 range for presentation, though not strictly required, 
    # we just need non-increasing. Let's use a logistic function or just scale it.
    final_score = max(0.0, min(100.0, final_score)) / 100.0
    
    # Construct reasoning
    reasoning_parts = []
    reasoning_parts.append(f"{profile.get('current_title')} with {yoe} yrs exp.")
    if nlp_hits > 0:
        reasoning_parts.append(f"Strong NLP/IR background ({nlp_hits} key term hits).")
    else:
        reasoning_parts.append("Lacks NLP/IR background.")
    reasoning_parts.append(f"Response rate {response_rate:.2f}.")
    if notice_period <= 30:
        reasoning_parts.append(f"Great notice period ({notice_period} days).")
        
    reasoning = " ".join(reasoning_parts)
    
    return final_score, reasoning

def process_candidates(input_path, top_k=100):
    scored_candidates = []
    
    open_func = gzip.open if str(input_path).endswith('.gz') else open
    is_jsonl = str(input_path).endswith('.jsonl') or str(input_path).endswith('.jsonl.gz')
    
    with open_func(input_path, 'rt', encoding='utf-8') as f:
        if not is_jsonl:
            # Parse as a single JSON array (for sample_candidates.json)
            candidates_list = json.load(f)
            for cand in candidates_list:
                score, reasoning = score_candidate(cand)
                if score > 0:
                    rounded_score = round(score, 4)
                    scored_candidates.append((rounded_score, cand['candidate_id'], reasoning))
        else:
            # Parse line by line (for candidates.jsonl)
            for line in f:
                if not line.strip():
                    continue
                cand = json.loads(line)
                score, reasoning = score_candidate(cand)
                if score > 0:
                    rounded_score = round(score, 4)
                    scored_candidates.append((rounded_score, cand['candidate_id'], reasoning))
                
    # Sort descending by score, tie break by candidate_id ascending
    scored_candidates.sort(key=lambda x: (-x[0], x[1]))
    
    return scored_candidates[:top_k]
