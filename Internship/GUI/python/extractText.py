import fitz  # PyMuPDF
import sys
import json

def extract_text(path):
    doc = fitz.open(path)
    text_list = []

    for page in doc:
        text = page.get_text()
        if text.strip():
            text_list.append(text.strip())

    return text_list

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    chunks = extract_text(pdf_path)
    print(json.dumps(chunks))  # Send chunks to stdout for Node to receive
