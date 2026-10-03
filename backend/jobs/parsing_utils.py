import bleach
from langdetect import detect, LangDetectException

REMOTE_KEYWORDS = ["remote", "work from home", "anywhere", "distributed"]
HYBRID_KEYWORDS = ["hybrid"]

ALLOWED_TAGS = ["p", "ul", "ol", "li", "strong", "b", "em", "i", "a", "br", "h3", "h4"]
ALLOWED_ATTRS = {"a": ["href", "target", "rel"]}


def infer_work_mode(location_text, description_text=""):
    combined = f"{location_text} {description_text}".lower()

    if any(kw in combined for kw in HYBRID_KEYWORDS):
        return "hybrid"
    if any(kw in combined for kw in REMOTE_KEYWORDS):
        return "remote"
    return "onsite"


def infer_country(location_text):
    if not location_text:
        return ""
    parts = [p.strip() for p in location_text.split(",")]
    return parts[-1] if parts else ""


def clean_description(raw_html):
    if not raw_html or not raw_html.strip():
        return ""

    cleaned = bleach.clean(raw_html, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, strip=True)

    if "<p>" not in cleaned and "<ul>" not in cleaned:
        paragraphs = [p.strip() for p in cleaned.split("\n") if p.strip()]
        cleaned = "".join(f"<p>{p}</p>" for p in paragraphs)

    return cleaned


def detect_language(text):
    if not text or len(text.strip()) < 20:
        return "en"
    try:
        return detect(text)
    except LangDetectException:
        return "en"