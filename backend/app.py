from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import sys
import os
import threading
import json
from datetime import datetime

# Add ml_model to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ml_model'))

from book_embedding import VietnameseBookEmbedding
from vietnamese_tts import VietnameseTTS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Configuration
DATASET_PATH = r"C:\Users\karin\.cache\kagglehub\datasets\iambestfeeder\10000-vietnamese-books\versions\1\output"
CHECKPOINT_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'checkpoints')

# Global model instance
model = None
tts_model = None
training_thread = None


def initialize_model():
    """Initialize ML model"""
    global model
    if model is None:
        model = VietnameseBookEmbedding(DATASET_PATH, CHECKPOINT_DIR)
        # Try to load existing embeddings
        model.load_embeddings()


def initialize_tts():
    """Initialize TTS model"""
    global tts_model
    if tts_model is None:
        tts_model = VietnameseTTS()
    return tts_model


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})


@app.route('/api/books/search', methods=['POST'])
def search_books():
    """Search books by query (title or content)"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        top_k = data.get('top_k', 10)
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        initialize_model()
        results = model.search(query, top_k=top_k)
        
        return jsonify({
            'success': True,
            'query': query,
            'results': results,
            'count': len(results)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/books/<path:filename>', methods=['GET'])
def get_book_content(filename):
    """Get full content of a book"""
    try:
        file_path = os.path.join(DATASET_PATH, filename)
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'Book not found'}), 404
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Split into lines for reading functionality
        lines = content.split('\n')
        
        return jsonify({
            'success': True,
            'filename': filename,
            'title': filename.replace('.txt', ''),
            'content': content,
            'lines': lines,
            'total_lines': len(lines)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/books/list', methods=['GET'])
def list_books():
    """List all books with pagination"""
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        files = [f for f in os.listdir(DATASET_PATH) if f.endswith('.txt')]
        files.sort()
        
        total = len(files)
        start = (page - 1) * per_page
        end = start + per_page
        
        books = []
        for filename in files[start:end]:
            file_path = os.path.join(DATASET_PATH, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    preview = f.read(300)
                books.append({
                    'filename': filename,
                    'title': filename.replace('.txt', ''),
                    'preview': preview
                })
            except:
                pass
        
        return jsonify({
            'success': True,
            'books': books,
            'page': page,
            'per_page': per_page,
            'total': total,
            'total_pages': (total + per_page - 1) // per_page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/training/start', methods=['POST'])
def start_training():
    """Start or resume training"""
    global training_thread
    
    try:
        initialize_model()
        
        if model.is_training:
            return jsonify({'error': 'Training is already running'}), 400
        
        def train_task():
            try:
                model.train(batch_size=32, save_interval=50)
                socketio.emit('training_complete', {
                    'message': 'Training completed successfully'
                })
            except Exception as e:
                socketio.emit('training_error', {
                    'error': str(e)
                })
        
        training_thread = threading.Thread(target=train_task)
        training_thread.start()
        
        return jsonify({
            'success': True,
            'message': 'Training started'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/training/pause', methods=['POST'])
def pause_training():
    """Pause training"""
    try:
        initialize_model()
        
        if not model.is_training:
            return jsonify({'error': 'No training in progress'}), 400
        
        model.pause_training()
        
        return jsonify({
            'success': True,
            'message': 'Training paused'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/training/status', methods=['GET'])
def training_status():
    """Get training status"""
    try:
        initialize_model()
        status = model.get_training_status()
        
        return jsonify({
            'success': True,
            'status': status
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/tts/synthesize', methods=['POST'])
def synthesize_speech():
    """Synthesize speech from text"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        voice = data.get('voice', 'female')
        speed = data.get('speed', 1.0)
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        tts = initialize_tts()
        audio_bytes = tts.synthesize(text, voice=voice, speed=speed)
        
        if audio_bytes is None:
            return jsonify({'error': 'Failed to synthesize speech'}), 500
        
        # Return audio file
        from flask import send_file
        import io
        
        return send_file(
            io.BytesIO(audio_bytes),
            mimetype='audio/wav',
            as_attachment=False,
            download_name='speech.wav'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/tts/voices', methods=['GET'])
def get_voices():
    """Get available TTS voices"""
    try:
        tts = initialize_tts()
        voices = tts.get_available_voices()
        
        return jsonify({
            'success': True,
            'voices': voices
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/tts/train', methods=['POST'])
def train_tts():
    """Train TTS model from VietSpeech dataset"""
    try:
        tts = initialize_tts()
        
        def train_task():
            try:
                metadata = tts.train_from_dataset()
                socketio.emit('tts_training_complete', {
                    'message': 'TTS training completed',
                    'metadata': metadata
                })
            except Exception as e:
                socketio.emit('tts_training_error', {
                    'error': str(e)
                })
        
        import threading
        thread = threading.Thread(target=train_task)
        thread.start()
        
        return jsonify({
            'success': True,
            'message': 'TTS training started'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('Client connected')
    emit('connected', {'message': 'Connected to server'})


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('Client disconnected')


@socketio.on('request_training_status')
def handle_training_status_request():
    """Send training status to client"""
    try:
        initialize_model()
        status = model.get_training_status()
        emit('training_status', status)
    except Exception as e:
        emit('error', {'error': str(e)})


if __name__ == '__main__':
    # Create checkpoint directory
    os.makedirs(CHECKPOINT_DIR, exist_ok=True)
    
    print("Starting Vietnamese Book Reader API...")
    print(f"Dataset path: {DATASET_PATH}")
    print(f"Checkpoint directory: {CHECKPOINT_DIR}")
    
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
