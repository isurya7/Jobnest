import io
import pdfplumber
from docx import Document


def extract_text_from_resume(file_field):
    filename = file_field.name.lower()
    file_field.open("rb")
    raw_bytes = file_field.read()
    file_field.close()
    file_stream = io.BytesIO(raw_bytes)

    if filename.endswith(".pdf"):
        return _extract_pdf_text(file_stream)
    elif filename.endswith(".docx"):
        return _extract_docx_text(file_stream)
    else:
        return ""


def _extract_pdf_text(file_stream):
    text_parts = []
    with pdfplumber.open(file_stream) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def _extract_docx_text(file_stream):
    document = Document(file_stream)
    return "\n".join(paragraph.text for paragraph in document.paragraphs)