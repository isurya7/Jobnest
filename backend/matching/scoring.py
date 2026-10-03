from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


def skill_overlap_score(seeker_skill_ids, job_skill_ids):
    if not job_skill_ids:
        return 0
    overlap = len(set(seeker_skill_ids) & set(job_skill_ids))
    return (overlap / len(job_skill_ids)) * 100


def description_similarity_score(seeker_embedding, job_embedding):
    if not seeker_embedding or not job_embedding:
        return 0
    vec_a = np.array(seeker_embedding).reshape(1, -1)
    vec_b = np.array(job_embedding).reshape(1, -1)
    similarity = cosine_similarity(vec_a, vec_b)[0][0]
    return max(0, similarity * 100)


def compute_match_score(seeker_skill_ids, job_skill_ids, seeker_embedding, job_embedding):
    skill_score = skill_overlap_score(seeker_skill_ids, job_skill_ids)
    desc_score = description_similarity_score(seeker_embedding, job_embedding)
    final_score = (0.6 * skill_score) + (0.4 * desc_score)
    return round(final_score, 1)


def score_to_tag(score):
    if score >= 75:
        return "High match"
    elif score >= 45:
        return "Medium match"
    else:
        return "Low match"


def compute_match_breakdown(seeker_skill_ids, seeker_skill_names, job_skill_ids, job_skill_names, seeker_embedding, job_embedding):
    matched_skills = list(set(seeker_skill_names) & set(job_skill_names))
    missing_skills = list(set(job_skill_names) - set(seeker_skill_names))

    skill_score = skill_overlap_score(seeker_skill_ids, job_skill_ids)
    desc_score = description_similarity_score(seeker_embedding, job_embedding)
    final_score = round((0.6 * skill_score) + (0.4 * desc_score), 1)

    return {
        "final_score": final_score,
        "match_tag": score_to_tag(final_score),
        "skill_score": round(skill_score, 1),
        "description_score": round(desc_score, 1),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
    }