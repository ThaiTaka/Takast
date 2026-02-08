import os
import json
import numpy as np
from typing import List, Dict, Tuple
import pickle
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class VietnameseBookEmbedding:
    """
    Deep Learning model để xử lý và tìm kiếm sách Việt Nam
    Hỗ trợ pause/resume training với checkpoint
    """
    
    def __init__(self, dataset_path: str, checkpoint_dir: str = "./checkpoints"):
        self.dataset_path = dataset_path
        self.checkpoint_dir = checkpoint_dir
        self.model_name = "keepitreal/vietnamese-sbert"
        
        os.makedirs(checkpoint_dir, exist_ok=True)
        
        # Lazy load model (only when needed)
        self._model = None
        
        # Data storage
        self.books = []
        self.embeddings = []
        self.metadata = []
        
        # Training state
        self.current_index = 0
        self.is_training = False
        self.training_progress = 0.0
    
    @property
    def model(self):
        """Lazy load model to avoid startup issues"""
        if self._model is None:
            logger.info(f"Loading model: {self.model_name}")
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self.model_name)
        return self._model
        
    def load_books_metadata(self) -> List[Dict]:
        """Load danh sách sách từ dataset với nội dung đầy đủ để training tốt hơn"""
        books_data = []
        
        if not os.path.exists(self.dataset_path):
            logger.error(f"Dataset path not found: {self.dataset_path}")
            return books_data
            
        files = [f for f in os.listdir(self.dataset_path) if f.endswith('.txt')]
        logger.info(f"Found {len(files)} books in dataset")
        
        for filename in files:
            file_path = os.path.join(self.dataset_path, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                # Extract book info from filename and content
                book_name = filename.replace('.txt', '')
                
                # Lấy nhiều nội dung hơn để training hiểu sách tốt hơn
                # Lấy 3000 ký tự đầu (thay vì 500) để AI hiểu rõ hơn về nội dung sách
                preview = content[:3000] if content else ""
                
                # Tạo summary từ các đoạn đầu sách
                lines = content.split('\n')
                meaningful_lines = [line.strip() for line in lines if len(line.strip()) > 20]
                summary = ' '.join(meaningful_lines[:20])  # 20 dòng đầu có ý nghĩa
                
                books_data.append({
                    'filename': filename,
                    'title': book_name,
                    'path': file_path,
                    'preview': preview,
                    'summary': summary[:1000],  # Summary ngắn gọn
                    'content_length': len(content),
                    'first_lines': content.split('\n')[:10] if content else []
                })
            except Exception as e:
                logger.warning(f"Error reading {filename}: {e}")
                
        return books_data
    
    def save_checkpoint(self):
        """Lưu checkpoint để có thể resume sau"""
        checkpoint = {
            'current_index': self.current_index,
            'books': self.books,
            'embeddings': self.embeddings,
            'metadata': self.metadata,
            'training_progress': self.training_progress
        }
        
        checkpoint_path = os.path.join(self.checkpoint_dir, 'latest_checkpoint.pkl')
        with open(checkpoint_path, 'wb') as f:
            pickle.dump(checkpoint, f)
        
        logger.info(f"Checkpoint saved at index {self.current_index}")
    
    def load_checkpoint(self) -> bool:
        """Load checkpoint nếu có"""
        checkpoint_path = os.path.join(self.checkpoint_dir, 'latest_checkpoint.pkl')
        
        if not os.path.exists(checkpoint_path):
            logger.info("No checkpoint found, starting fresh")
            return False
            
        try:
            with open(checkpoint_path, 'rb') as f:
                checkpoint = pickle.load(f)
            
            self.current_index = checkpoint['current_index']
            self.books = checkpoint['books']
            self.embeddings = checkpoint['embeddings']
            self.metadata = checkpoint['metadata']
            self.training_progress = checkpoint['training_progress']
            
            logger.info(f"Checkpoint loaded, resuming from index {self.current_index}")
            return True
        except Exception as e:
            logger.error(f"Error loading checkpoint: {e}")
            return False
    
    def train(self, batch_size: int = 32, save_interval: int = 100):
        """
        Train model trên toàn bộ dataset
        Có thể pause bất cứ lúc nào
        """
        self.is_training = True
        
        # Load checkpoint nếu có
        resumed = self.load_checkpoint()
        
        if not resumed:
            # Load all books metadata
            logger.info("Loading books metadata...")
            self.books = self.load_books_metadata()
            self.metadata = self.books.copy()
            self.current_index = 0
            self.embeddings = []
        
        total_books = len(self.books)
        logger.info(f"Starting training from book {self.current_index}/{total_books}")
        
        try:
            while self.current_index < total_books and self.is_training:
                batch_end = min(self.current_index + batch_size, total_books)
                batch_books = self.books[self.current_index:batch_end]
                
                # Create embeddings cho batch
                texts = []
                for book in batch_books:
                    # Combine title, summary và preview để AI hiểu sâu hơn về nội dung sách
                    # Điều này giúp AI có thể tìm sách dựa trên mô tả nội dung, không chỉ tên
                    text = f"Tên sách: {book['title']}. "
                    
                    if 'summary' in book and book['summary']:
                        text += f"Tóm tắt: {book['summary']}. "
                    
                    text += f"Nội dung: {book['preview']}"
                    
                    texts.append(text)
                
                logger.info(f"Processing batch {self.current_index}-{batch_end}/{total_books}")
                batch_embeddings = self.model.encode(texts, show_progress_bar=False)
                
                self.embeddings.extend(batch_embeddings)
                self.current_index = batch_end
                self.training_progress = (self.current_index / total_books) * 100
                
                # Save checkpoint định kỳ
                if self.current_index % save_interval == 0:
                    self.save_checkpoint()
                    logger.info(f"Progress: {self.training_progress:.2f}%")
                
            # Save final checkpoint
            if self.is_training:
                self.save_checkpoint()
                logger.info("Training completed!")
                self.save_embeddings()
            else:
                logger.info("Training paused, checkpoint saved")
                
        except Exception as e:
            logger.error(f"Error during training: {e}")
            self.save_checkpoint()
            raise
    
    def pause_training(self):
        """Dừng training và save checkpoint"""
        logger.info("Pausing training...")
        self.is_training = False
        self.save_checkpoint()
    
    def save_embeddings(self):
        """Lưu embeddings cuối cùng"""
        embeddings_path = os.path.join(self.checkpoint_dir, 'embeddings.npy')
        metadata_path = os.path.join(self.checkpoint_dir, 'metadata.json')
        
        np.save(embeddings_path, np.array(self.embeddings))
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(self.metadata, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Embeddings saved: {embeddings_path}")
        logger.info(f"Metadata saved: {metadata_path}")
    
    def load_embeddings(self):
        """Load embeddings đã train"""
        embeddings_path = os.path.join(self.checkpoint_dir, 'embeddings.npy')
        metadata_path = os.path.join(self.checkpoint_dir, 'metadata.json')
        
        if not os.path.exists(embeddings_path):
            logger.warning("No embeddings found, need to train first")
            return False
            
        self.embeddings = np.load(embeddings_path)
        with open(metadata_path, 'r', encoding='utf-8') as f:
            self.metadata = json.load(f)
        
        logger.info(f"Loaded {len(self.embeddings)} embeddings")
        return True
    
    def search(self, query: str, top_k: int = 10) -> List[Dict]:
        """
        Tìm kiếm sách dựa trên query (có thể là tên sách hoặc nội dung)
        """
        if len(self.embeddings) == 0:
            logger.warning("No embeddings loaded, loading from checkpoint...")
            if not self.load_embeddings():
                return []
        
        # Encode query
        query_embedding = self.model.encode([query])[0]
        
        # Calculate similarity
        embeddings_array = np.array(self.embeddings)
        similarities = np.dot(embeddings_array, query_embedding)
        
        # Get top k results
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            result = self.metadata[idx].copy()
            result['similarity_score'] = float(similarities[idx])
            results.append(result)
        
        return results
    
    def get_training_status(self) -> Dict:
        """Lấy trạng thái training hiện tại"""
        return {
            'is_training': self.is_training,
            'progress': self.training_progress,
            'current_index': self.current_index,
            'total_books': len(self.books) if self.books else 0,
            'embeddings_count': len(self.embeddings)
        }


if __name__ == "__main__":
    # Test code
    dataset_path = r"C:\Users\karin\.cache\kagglehub\datasets\iambestfeeder\10000-vietnamese-books\versions\1\output"
    
    model = VietnameseBookEmbedding(dataset_path, checkpoint_dir="../data/checkpoints")
    
    # Train
    print("Starting training...")
    model.train(batch_size=32, save_interval=50)
    
    # Search test
    print("\nTesting search...")
    results = model.search("cuốn sách về tình yêu", top_k=5)
    for i, result in enumerate(results, 1):
        print(f"{i}. {result['title']} (score: {result['similarity_score']:.4f})")
