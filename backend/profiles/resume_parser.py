import pdfplumber
from docx import Document


def extract_text_from_resume(file_field):
    filename = file_field.name.lower()

    if filename.endswith(".pdf"):
        return _extract_pdf_text(file_field)
    elif filename.endswith(".docx"):
        return _extract_docx_text(file_field)
    else:
        return ""


def _extract_pdf_text(file_field):
    text_parts = []
    with pdfplumber.open(file_field) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def _extract_docx_text(file_field):
    document = Document(file_field)
    return "\n".join(paragraph.text for paragraph in document.paragraphs)