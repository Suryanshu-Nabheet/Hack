# Credential Tester - Node.js/TypeScript Version

This is a TypeScript/Node.js implementation of the credential testing tool, equivalent to the Python version.

## Features

- Tests login combinations on target websites
- Uses axios for HTTP requests (equivalent to Python's requests)
- Implements rate limiting and retry logic
- Progress tracking and safety confirmations
- TypeScript for better type safety

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
cd nodejs
npm install
```

## Usage

### Development Mode (with ts-node)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Configuration

The script tests:
- User IDs: 1000000000 to 9999999999 (10-digit range)
- Passwords: 11111 to 99999 (5-digit range)
- Target: https://parentsalarmapp.com

## Safety Features

- Rate limiting (200ms delay between requests)
- Retry logic (3 attempts per request)
- Safety confirmation before running
- Progress tracking
- Early termination after finding 5 valid credentials

## ⚠️ Ethical Use Only

This tool is for educational and authorized testing purposes only. Always ensure you have explicit permission before testing any website.

## Project Structure

```
nodejs/
├── src/
│   └── main.ts          # Main TypeScript source
├── dist/                # Compiled JavaScript (after build)
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```
