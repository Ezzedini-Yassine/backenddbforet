#!/bin/bash

# Download BD Forêt V2 data for specific departments
# You can modify the department codes as needed

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/../../data/bdforet"

# Create data directory if it doesn't exist
mkdir -p "$DATA_DIR"

echo "📁 Data directory: $DATA_DIR"

# BD Forêt V2 base URL
BASE_URL="https://data.geopf.fr/telechargement/download/BDFORET/BDFORET_2-0__SHP_LAMB93_D0"

# Departments to download (modify as needed)
# Format: Department_Code
DEPARTMENTS=(
  "75"  # Paris
  "92"  # Hauts-de-Seine
  "93"  # Seine-Saint-Denis
  "13"  # Bouches-du-Rhône
  "69"  # Rhône
)

echo "🌲 Downloading BD Forêt V2 data..."

for DEPT in "${DEPARTMENTS[@]}"; do
  echo "📥 Downloading department: $DEPT"
  
  # Construct the download URL
  URL="${BASE_URL}${DEPT}-2024-12-15/BDFORET_2-0_SHP_LAMB93_D0${DEPT}-2024-12-15.7z"
  OUTPUT_FILE="$DATA_DIR/bdforet_${DEPT}.7z"
  
  # Download the file
  if [ ! -f "$OUTPUT_FILE" ]; then
    wget -q --show-progress -O "$OUTPUT_FILE" "$URL" || {
      echo "⚠️  Failed to download $DEPT, trying alternative URL..."
      # Alternative: try without date suffix
      ALT_URL="${BASE_URL}${DEPT}/BDFORET_2-0_SHP_LAMB93_D0${DEPT}.7z"
      wget -q --show-progress -O "$OUTPUT_FILE" "$ALT_URL" || {
        echo "❌ Failed to download department $DEPT"
        continue
      }
    }
    echo "✅ Downloaded: $OUTPUT_FILE"
  else
    echo "⏭️  Already exists: $OUTPUT_FILE"
  fi
  
  # Extract the 7z file (requires p7zip-full)
  EXTRACT_DIR="$DATA_DIR/dept_${DEPT}"
  if [ ! -d "$EXTRACT_DIR" ]; then
    echo "📦 Extracting $DEPT..."
    mkdir -p "$EXTRACT_DIR"
    7z x "$OUTPUT_FILE" -o"$EXTRACT_DIR" > /dev/null
    echo "✅ Extracted to: $EXTRACT_DIR"
  else
    echo "⏭️  Already extracted: $EXTRACT_DIR"
  fi
done

echo "✨ BD Forêt download complete!"
echo "📍 Data location: $DATA_DIR"

# List downloaded files
echo ""
echo "📋 Downloaded departments:"
ls -lh "$DATA_DIR"/*.7z 2>/dev/null || echo "No 7z files found"