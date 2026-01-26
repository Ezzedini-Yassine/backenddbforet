#!/bin/bash

# Download French Cadastre data (parcel boundaries)
# Source: Etalab Cadastre

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/../../data/cadastre"

# Create data directory if it doesn't exist
mkdir -p "$DATA_DIR"

echo "📁 Data directory: $DATA_DIR"

# Base URL for cadastre data
BASE_URL="https://cadastre.data.gouv.fr/data/etalab-cadastre/latest/geojson/departements"

# Departments to download (same as BD Forêt for consistency)
DEPARTMENTS=(
  "75"  # Paris
  "92"  # Hauts-de-Seine
  "93"  # Seine-Saint-Denis
  "13"  # Bouches-du-Rhône
  "69"  # Rhône
)

echo "🏘️  Downloading Cadastre parcels..."

for DEPT in "${DEPARTMENTS[@]}"; do
  echo "📥 Downloading department: $DEPT"
  
  # Construct the download URL
  URL="${BASE_URL}/${DEPT}/cadastre-${DEPT}-parcelles.json.gz"
  OUTPUT_FILE="$DATA_DIR/cadastre_${DEPT}.json.gz"
  
  # Download the file
  if [ ! -f "$OUTPUT_FILE" ]; then
    wget -q --show-progress -O "$OUTPUT_FILE" "$URL" || {
      echo "❌ Failed to download cadastre for department $DEPT"
      continue
    }
    echo "✅ Downloaded: $OUTPUT_FILE"
  else
    echo "⏭️  Already exists: $OUTPUT_FILE"
  fi
  
  # Extract the gzipped file
  JSON_FILE="$DATA_DIR/cadastre_${DEPT}.json"
  if [ ! -f "$JSON_FILE" ]; then
    echo "📦 Extracting $DEPT..."
    gunzip -c "$OUTPUT_FILE" > "$JSON_FILE"
    echo "✅ Extracted to: $JSON_FILE"
  else
    echo "⏭️  Already extracted: $JSON_FILE"
  fi
done

echo "✨ Cadastre download complete!"
echo "📍 Data location: $DATA_DIR"

# Show file sizes
echo ""
echo "📋 Downloaded files:"
ls -lh "$DATA_DIR"/*.json 2>/dev/null || echo "No JSON files found"