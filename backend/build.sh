#!/usr/bin/env bash
# Render / Railway build script
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --no-input
