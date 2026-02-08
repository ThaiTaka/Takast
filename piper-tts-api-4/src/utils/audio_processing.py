def split_text(text: str, max_length: int = 100) -> list:
    import re
    # Split text based on Vietnamese punctuation
    sentences = re.split(r'(?<=[.!?]) +', text)
    chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_length:
            current_chunk += sentence + " "
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sentence + " "

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks

def generate_md5_hash(text: str) -> str:
    import hashlib
    return hashlib.md5(text.encode()).hexdigest()