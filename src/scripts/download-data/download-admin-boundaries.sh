#!/bin/bash

# Download French administrative boundaries
# Source: IGN ADMIN EXPRESS

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/../../data/boundaries"

# Create data directory if it doesn't exist
mkdir -p "$DATA_DIR"

echo "📁 Data directory: $DATA_DIR"

# ADMIN EXPRESS COG (Communes, Départements, Régions)
BASE_URL="https://data.geopf.fr/telechargement/download/ADMIN-EXPRESS-COG-CARTO/ADMIN-EXPRESS-COG-CARTO_3-2__SHP_WGS84G_FRA_2024-01-08/ADMIN-EXPRESS-COG-CARTO_3-2__SHP_WGS84G_FRA_2024-01-08.7z"

OUTPUT_FILE="$DATA_DIR/admin_express.7z"
EXTRACT_DIR="$DATA_DIR/admin_express"

# Download
if [ ! -f "$OUTPUT_FILE" ]; then
  echo "📥 Downloading ADMIN EXPRESS..."
  wget -q --show-progress -O "$OUTPUT_FILE" "$BASE_URL" || {
    echo "❌ Failed to download administrative boundaries"
    exit 1
  }
  echo "✅ Downloaded: $OUTPUT_FILE"
else
  echo "⏭️  Already exists: $OUTPUT_FILE"
fi

# Extract
if [ ! -d "$EXTRACT_DIR" ]; then
  echo "📦 Extracting administrative boundaries..."
  mkdir -p "$EXTRACT_DIR"
  7z x "$OUTPUT_FILE" -o"$EXTRACT_DIR" > /dev/null
  echo "✅ Extracted to: $EXTRACT_DIR"
else
  echo "⏭️  Already extracted: $EXTRACT_DIR"
fi

echo "✨ Administrative boundaries download complete!"
echo "📍 Data location: $DATA_DIR"

# Show structure
echo ""
echo "📋 Directory structure:"
find "$EXTRACT_DIR" -name "*.shp" -type f | head -10