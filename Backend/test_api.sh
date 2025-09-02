#!/bin/bash

# Test the API endpoints

echo "Testing backend API..."

# Test health endpoint (home page)
echo "1. Testing home page:"
curl -s "http://localhost:8000/" | head -3

echo -e "\n\n2. Testing sentiment endpoint:"
curl -X POST "http://localhost:8000/transcription/sentiment" \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this application!"}'

echo -e "\n\n3. Testing transcription endpoint (this will fail without ML service):"
echo "This is a test file" > test_audio.txt
curl -X POST "http://localhost:8000/transcription/transcribe" \
  -F "file=@test_audio.txt"

rm -f test_audio.txt

echo -e "\n\nDone!"
