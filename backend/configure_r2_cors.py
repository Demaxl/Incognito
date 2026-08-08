#!/usr/bin/env python3
"""Apply CORS rules to the Cloudflare R2 bucket (S3-compatible API).

Required env (same as production):
  R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT_URL
Optional:
  R2_REGION_NAME (default us-east-1)

Usage:
  cd backend
  export $(grep -v '^#' .env.r2 | xargs)   # or set vars manually
  python configure_r2_cors.py
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import boto3
from botocore.config import Config


def main() -> int:
    access_key = os.environ.get("R2_ACCESS_KEY_ID", "").strip()
    secret_key = os.environ.get("R2_SECRET_ACCESS_KEY", "").strip()
    bucket = os.environ.get("R2_BUCKET_NAME", "").strip()
    endpoint = os.environ.get("R2_ENDPOINT_URL", "").strip().rstrip("/")
    region = os.environ.get("R2_REGION_NAME", "us-east-1").strip() or "us-east-1"
    if region == "auto":
        region = "us-east-1"

    missing = [
        name
        for name, value in [
            ("R2_ACCESS_KEY_ID", access_key),
            ("R2_SECRET_ACCESS_KEY", secret_key),
            ("R2_BUCKET_NAME", bucket),
            ("R2_ENDPOINT_URL", endpoint),
        ]
        if not value
    ]
    if missing:
        print(f"Missing env vars: {', '.join(missing)}", file=sys.stderr)
        return 1

    cors_path = Path(__file__).with_name("r2-cors.json")
    rules = json.loads(cors_path.read_text())

    client = boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name=region,
        config=Config(signature_version="s3v4", s3={"addressing_style": "path"}),
    )

    client.put_bucket_cors(
        Bucket=bucket,
        CORSConfiguration={"CORSRules": rules},
    )
    print(f"CORS applied to bucket {bucket!r}:")
    for rule in rules:
        print(f"  origins={rule.get('AllowedOrigins')} methods={rule.get('AllowedMethods')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
