class PiperService:
    def __init__(self, piper_executable: str, model_path: str):
        self.piper_executable = piper_executable
        self.model_path = model_path

    def generate_audio(self, text: str, output_path: str):
        import subprocess

        command = [
            self.piper_executable,
            '--model', self.model_path,
            '--text', text,
            '--output', output_path
        ]
        subprocess.run(command, check=True)

    def check_cached_audio(self, output_path: str) -> bool:
        import os
        return os.path.exists(output_path)