#!/bin/bash
set -euo pipefail

cd /Users/artem/WebstormProjects/Library
uvicorn backend.main:app --reload --port 8000