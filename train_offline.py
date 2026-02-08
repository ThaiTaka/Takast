"""
OFFLINE TRAINING SCRIPT với Real-time Dashboard
Features:
- Real-time progress bar
- Auto-save checkpoint (graceful shutdown)
- Resume từ checkpoint
- Training metrics tracking
"""

import os
import sys
import logging
import json
import time
import signal
from pathlib import Path
from datetime import datetime

# Add ml_model to path
sys.path.append(str(Path(__file__).parent / 'ml_model'))

from book_embedding import VietnameseBookEmbedding

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global variables for graceful shutdown
training_active = True
model_instance = None

PROGRESS_FILE = "./data/training_progress.json"
METRICS_FILE = "./data/training_metrics.json"

def signal_handler(sig, frame):
    """Handle Ctrl+C for graceful shutdown"""
    global training_active, model_instance
    print("\n\n⏸️  Receiving shutdown signal...")
    training_active = False
    if model_instance:
        print("💾 Saving checkpoint before exit...")
        model_instance.pause_training()
    print("✓ Checkpoint saved. Safe to exit.")
    sys.exit(0)

# Register signal handler
signal.signal(signal.SIGINT, signal_handler)

def save_progress(data):
    """Save training progress to JSON"""
    os.makedirs(os.path.dirname(PROGRESS_FILE), exist_ok=True)
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def save_metrics(data):
    """Save training metrics"""
    os.makedirs(os.path.dirname(METRICS_FILE), exist_ok=True)
    with open(METRICS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def print_progress_bar(current, total, bar_length=50, metrics=None):
    """Print beautiful progress bar"""
    percent = float(current) / total if total > 0 else 0
    filled = int(bar_length * percent)
    bar = '█' * filled + '░' * (bar_length - filled)
    
    print(f'\r│{bar}│ {percent*100:.1f}% ({current}/{total})', end='')
    
    if metrics:
        elapsed = metrics.get('elapsed', 0)
        eta = metrics.get('eta', 0)
        print(f' │ ⏱️  {format_time(elapsed)} │ ETA: {format_time(eta)}', end='')
    
    sys.stdout.flush()

def format_time(seconds):
    """Format seconds to readable time"""
    if seconds < 60:
        return f"{int(seconds)}s"
    elif seconds < 3600:
        return f"{int(seconds/60)}m {int(seconds%60)}s"
    else:
        return f"{int(seconds/3600)}h {int((seconds%3600)/60)}m"

def main():
    """Train AI model offline với real-time dashboard"""
    global training_active, model_instance
    
    print("=" * 80)
    print("🤖 VIETNAMESE BOOK AI - OFFLINE TRAINING DASHBOARD")
    print("=" * 80)
    print()
    
    # Dataset path
    DATASET_PATH = r"C:\Users\karin\.cache\kagglehub\datasets\iambestfeeder\10000-vietnamese-books\versions\1\output"
    CHECKPOINT_DIR = "./data/checkpoints"
    
    # Check dataset exists
    if not os.path.exists(DATASET_PATH):
        logger.error(f"❌ Dataset not found: {DATASET_PATH}")
        logger.info("Please run: python download_dataset.py")
        return
    
    logger.info(f"📂 Dataset: {DATASET_PATH}")
    logger.info(f"💾 Checkpoint: {CHECKPOINT_DIR}")
    print()
    
    # Initialize model
    logger.info("⚙️  Initializing model...")
    model = VietnameseBookEmbedding(DATASET_PATH, CHECKPOINT_DIR)
    model_instance = model
    
    # Check existing checkpoint
    checkpoint_loaded = model.load_checkpoint()
    
    if checkpoint_loaded and model.books and len(model.books) > 0:
        status = model.get_training_status()
        print()
        print("📊 CHECKPOINT FOUND")
        print(f"   Progress: {status['progress']:.2f}%")
        print(f"   Books: {status['current_index']:,}/{status['total_books']:,}")
        print(f"   Embeddings: {status['embeddings_count']:,}")
        print()
        
        if status['progress'] >= 99.9:
            print("✅ Training completed!")
            response = input("Retrain from scratch? (y/N): ").strip().lower()
            if response != 'y':
                logger.info("Using existing model")
                return
            else:
                import shutil
                shutil.rmtree(CHECKPOINT_DIR, ignore_errors=True)
                os.makedirs(CHECKPOINT_DIR, exist_ok=True)
                model = VietnameseBookEmbedding(DATASET_PATH, CHECKPOINT_DIR)
                model_instance = model
        else:
            print("⏩ Resuming from checkpoint...")
    else:
        print("🆕 Starting fresh training...")
    
    print()
    print("=" * 80)
    print("🚀 TRAINING STARTED")
    print("=" * 80)
    print()
    print("💡 Controls:")
    print("   • Ctrl+C → Pause & Save (graceful shutdown)")
    print("   • Auto-save every 50 books")
    print("   • Run script again → Resume from last checkpoint")
    print()
    print("-" * 80)
    print()
    
    start_time = time.time()
    last_save_time = start_time
    
    try:
        model.is_training = True
        
        # Load books if not loaded
        if not model.books:
            logger.info("📚 Loading books metadata...")
            model.books = model.load_books_metadata()
            model.metadata = model.books.copy()
            print()
        
        total_books = len(model.books)
        logger.info(f"📖 Total books: {total_books:,}")
        print()
        
        batch_size = 32
        save_interval = 50
        
        # Training loop
        while model.current_index < total_books and training_active:
            batch_start = model.current_index
            batch_end = min(model.current_index + batch_size, total_books)
            batch_books = model.books[batch_start:batch_end]
            
            # Create embeddings
            texts = []
            for book in batch_books:
                text = f"Tên sách: {book['title']}. "
                if 'summary' in book and book['summary']:
                    text += f"Tóm tắt: {book['summary']}. "
                text += f"Nội dung: {book['preview']}"
                texts.append(text)
            
            # Encode
            batch_embeddings = model.model.encode(texts, show_progress_bar=False)
            model.embeddings.extend(batch_embeddings)
            model.current_index = batch_end
            model.training_progress = (model.current_index / total_books) * 100
            
            # Calculate metrics
            elapsed = time.time() - start_time
            books_per_sec = model.current_index / elapsed if elapsed > 0 else 0
            eta = (total_books - model.current_index) / books_per_sec if books_per_sec > 0 else 0
            
            # Display progress
            metrics = {
                'elapsed': elapsed,
                'eta': eta,
                'speed': books_per_sec
            }
            print_progress_bar(model.current_index, total_books, metrics=metrics)
            
            # Save progress data
            progress_data = {
                'current_index': model.current_index,
                'total_books': total_books,
                'progress': model.training_progress,
                'embeddings_count': len(model.embeddings),
                'elapsed_seconds': int(elapsed),
                'eta_seconds': int(eta),
                'books_per_second': round(books_per_sec, 2),
                'last_update': datetime.now().isoformat()
            }
            save_progress(progress_data)
            
            # Save checkpoint periodically
            if (model.current_index % save_interval == 0 and 
                time.time() - last_save_time > 30):  # At least 30s between saves
                model.save_checkpoint()
                last_save_time = time.time()
                print(f"\n💾 Checkpoint saved at {model.current_index:,}/{total_books:,}")
        
        # Final save
        if training_active:
            print("\n")
            model.save_checkpoint()
            model.save_embeddings()
            
            # Save final metrics
            total_time = time.time() - start_time
            final_metrics = {
                'status': 'completed',
                'total_books': total_books,
                'total_embeddings': len(model.embeddings),
                'total_time_seconds': int(total_time),
                'average_speed': round(total_books / total_time, 2),
                'completed_at': datetime.now().isoformat()
            }
            save_metrics(final_metrics)
            
            print("=" * 80)
            print("✅ TRAINING COMPLETED!")
            print("=" * 80)
            print(f"   📚 Books: {total_books:,}")
            print(f"   🧠 Embeddings: {len(model.embeddings):,}")
            print(f"   ⏱️  Time: {format_time(total_time)}")
            print(f"   ⚡ Speed: {round(total_books/total_time, 2)} books/sec")
            print(f"   💾 Location: {CHECKPOINT_DIR}")
            print()
            print("🎉 Ready for deployment!")
            print()
            
    except KeyboardInterrupt:
        # Already handled by signal handler
        pass
        
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        
        if model_instance:
            model_instance.save_checkpoint()
            print("\n💾 Emergency checkpoint saved")

if __name__ == "__main__":
    main()
