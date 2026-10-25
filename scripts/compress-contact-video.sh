#!/usr/bin/env bash
# Web-optimise contact film (hero-style H.264 + poster). Requires ffmpeg.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="${1:-$HOME/Downloads/coffee_pill_women.mp4}"
VIDEO_OUT="$ROOT/static/video/coffee_pill_women.mp4"
POSTER_OUT="$ROOT/static/images/contact-film-poster.jpg"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install with: brew install ffmpeg" >&2
  exit 1
fi

if [[ ! -f "$SOURCE" ]]; then
  echo "Source not found: $SOURCE" >&2
  echo "Usage: $0 [/path/to/coffee_pill_women.source.mp4]" >&2
  exit 1
fi

TMP="$(mktemp "${TMPDIR:-/tmp}/coffee_pill.XXXXXX.mp4")"
trap 'rm -f "$TMP"' EXIT

echo "Poster → $POSTER_OUT"
ffmpeg -y -loglevel error -ss 0.5 -i "$SOURCE" \
  -vf "scale=720:720" -frames:v 1 -update 1 -q:v 8 \
  "$POSTER_OUT"

echo "Video → $VIDEO_OUT"
ffmpeg -y -loglevel error -i "$SOURCE" \
  -vf "scale=720:720" \
  -c:v libx264 -profile:v high -level 4.0 -pix_fmt yuv420p \
  -b:v 1250k -maxrate 1500k -bufsize 2500k \
  -c:a aac -b:a 128k -ac 2 \
  -movflags +faststart \
  "$TMP"

mv "$TMP" "$VIDEO_OUT"
chmod 644 "$VIDEO_OUT" "$POSTER_OUT"
trap - EXIT

ls -lh "$VIDEO_OUT" "$POSTER_OUT"
ffprobe -v error -show_entries format=duration,size,bit_rate -of default=nw=1:nk=1 "$VIDEO_OUT" | paste - - - | \
  awk '{printf "duration=%ss size=%s bytes avg_bitrate=%s b/s\n", $1, $2, $3}'
