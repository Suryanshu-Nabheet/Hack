# Credential Tester - Python Version

This is a Python implementation of a credential testing tool for ethical hacking purposes.

## Features

- Tests login combinations on target websites
- Uses requests library for HTTP requests
- Implements rate limiting and retry logic
- Progress tracking and safety confirmations
- Beautiful console output with emojis

## Prerequisites

- Python 3.7 or higher
- Required packages: requests, beautifulsoup4

## Installation

```bash
cd python
pip install requests beautifulsoup4
```

## Usage

```bash
python3 main.py
```

## Configuration

The script tests:
- User IDs: 1000000000 to 9999999999 (10-digit range)
- Passwords: 11111 to 99999 (5-digit range)
- Target: https://parentsalarmapp.com

## Safety Features

- Rate limiting (0.2s delay between requests)
- Retry logic (3 attempts per request)
- Safety confirmation before running
- Progress tracking
- Early termination after finding 5 valid credentials

## ⚠️ Ethical Use Only

This tool is for educational and authorized testing purposes only. Always ensure you have explicit permission before testing any website.

## Project Structure

```
python/
├── main.py              # Main Python script
└── README.md           # This file
```
