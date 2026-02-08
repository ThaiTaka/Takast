// This file contains the JavaScript logic for the frontend, including handling user input, sending requests to the backend, and managing audio playback.

document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const submitButton = document.getElementById('submit-button');
    const audioPlayer = document.getElementById('audio-player');

    submitButton.addEventListener('click', async function() {
        const text = textInput.value;

        if (!text) {
            alert('Please enter some text to convert to speech.');
            return;
        }

        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const audioUrl = data.audio_url;

            if (audioUrl) {
                audioPlayer.src = audioUrl;
                audioPlayer.play();
            } else {
                alert('Audio generation failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your request.');
        }
    });
});