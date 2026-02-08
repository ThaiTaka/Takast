import kagglehub
import os
import json

# Download latest version
path = kagglehub.dataset_download("iambestfeeder/10000-vietnamese-books")

print("Path to dataset files:", path)

# Analyze dataset structure
print("\nAnalyzing dataset structure...")
for root, dirs, files in os.walk(path):
    print(f"\nDirectory: {root}")
    for file in files[:5]:  # Show first 5 files
        file_path = os.path.join(root, file)
        print(f"  - {file} (size: {os.path.getsize(file_path)} bytes)")
    if len(files) > 5:
        print(f"  ... and {len(files) - 5} more files")
    break  # Only show first level

# Save path to config
config = {
    "dataset_path": path,
    "total_books": len([f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))])
}

with open("dataset_config.json", "w", encoding="utf-8") as f:
    json.dump(config, f, ensure_ascii=False, indent=2)

print(f"\nDataset path saved to dataset_config.json")
print(f"Total items in dataset: {config['total_books']}")
