import re

EXPERIENCE_PATTERN = re.compile(r"(\d+)\+?\s*(?:years?|yrs?)\b", re.IGNORECASE)


def find_skills_in_text(text, skill_names):
    if not text:
        return []
    text_lower = text.lower()
    found = []
    for name in skill_names:
        pattern = r"(?<![a-zA-Z0-9])" + re.escape(name.lower()) + r"(?![a-zA-Z0-9])"
        if re.search(pattern, text_lower):
            found.append(name)
    return found


def extract_experience_years(text):
    if not text:
        return None
    matches = EXPERIENCE_PATTERN.findall(text)
    if not matches:
        return None
    return max(int(m) for m in matches)