#!/bin/bash
set -euo pipefail

cd /Users/artem/WebstormProjects/Library
npm run dev
node uvicorn backend.main:app --reload --port 8000
