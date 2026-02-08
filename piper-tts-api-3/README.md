# Piper TTS API

## Overview
Piper TTS API is a FastAPI application that provides a Text-to-Speech (TTS) service using the Piper TTS engine. This project allows users to convert text into audio files, which can be played back or downloaded.

## Project Structure
```
piper-tts-api
├── src
│   ├── main.py                # Entry point for the FastAPI application
│   ├── api
│   │   ├── __init__.py        # API package initializer
│   │   └── routes
│   │       ├── __init__.py    # Routes package initializer
│   │       └── tts.py         # TTS route handler
│   ├── services
│   │   ├── __init__.py        # Services package initializer
│   │   └── piper_service.py    # Interaction with the Piper TTS engine
│   ├── models
│   │   ├── __init__.py        # Models package initializer
│   │   └── schemas.py         # Pydantic models for request validation
│   ├── config
│   │   ├── __init__.py        # Config package initializer
│   │   └── settings.py        # Configuration settings
│   └── utils
│       ├── __init__.py        # Utils package initializer
│       └── audio_processing.py # Utility functions for audio processing
├── static
│   ├── css
│   │   └── style.css          # CSS styles for the frontend
│   ├── js
│   │   └── app.js             # JavaScript logic for the frontend
│   └── index.html             # Main HTML file for the frontend
├── voices
│   └── .gitkeep               # Placeholder for voices directory
├── output
│   └── .gitkeep               # Placeholder for output directory
├── requirements.txt           # Python dependencies
├── .env.example                # Template for environment variables
├── .gitignore                  # Files to ignore by Git
└── README.md                   # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd piper-tts-api
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables by copying `.env.example` to `.env` and updating the paths as necessary.

## Usage
1. Start the FastAPI server:
   ```
   uvicorn src.main:app --reload
   ```

2. Open your browser and navigate to `http://localhost:8000/docs` to access the API documentation.

3. Use the `/api/tts` endpoint to send a POST request with the text you want to convert to speech. The request body should be in the following format:
   ```json
   {
       "text": "Your text here"
   }
   ```

4. The API will return an audio file that can be played or downloaded.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.