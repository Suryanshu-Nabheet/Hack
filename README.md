# Credential Tester Project

This project contains two implementations of a credential testing tool - one in Python and one in TypeScript/Node.js. Both tools perform the same functionality for educational and authorized testing purposes.

## Project Structure

```
Test/
├── python/                 # Python implementation
│   ├── main.py            # Main Python script
│   └── README.md          # Python-specific documentation
├── nodejs/                # Node.js/TypeScript implementation
│   ├── src/
│   │   └── main.ts        # Main TypeScript source
│   ├── package.json       # Node.js dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   └── README.md          # Node.js-specific documentation
└── README.md              # This file
```

## Features (Both Implementations)

- **Comprehensive Testing**: Tests 10-digit user IDs (1000000000-9999999999) with 5-digit passwords (11111-99999)
- **Rate Limiting**: Respects server resources with appropriate delays
- **Retry Logic**: Handles network errors with automatic retries
- **Progress Tracking**: Shows real-time progress and statistics
- **Professional Output**: Clean, emoji-free console output
- **Auto-Start**: No manual confirmations required - starts automatically after 3-second delay
- **Early Termination**: Stops after finding 5 valid credentials

## Quick Start

### Python Version
```bash
cd python
pip install requests beautifulsoup4
python3 main.py
```

### Node.js Version
```bash
cd nodejs
npm install
npm run dev
```

## ⚠️ Important Safety Notice

**ETHICAL USE ONLY**: These tools are designed for educational purposes and authorized penetration testing only. 

**Requirements:**
- You MUST have explicit written permission to test the target website
- Respect server resources and implement appropriate rate limiting
- Use only on systems you own or have explicit authorization to test
- Consider the massive scale of testing (billions of combinations)

**Legal Disclaimer**: The authors are not responsible for any misuse of these tools. Users are solely responsible for ensuring they have proper authorization before using these tools on any system.

## Target Configuration

Both tools are configured to test:
- **Target**: https://parentsalarmapp.com
- **User ID Range**: 1000000000 to 9999999999 (10-digit numbers)
- **Password Range**: 11111 to 99999 (5-digit numbers)
- **Total Combinations**: ~89 billion combinations
- **Estimated Time**: ~5,000 hours (208 days) at 0.2s per request

## Technical Details

### Python Implementation
- Uses `requests` library for HTTP requests
- Uses `BeautifulSoup` for HTML parsing
- Session management with cookie handling
- Console output with emojis and progress bars

### Node.js Implementation
- Uses `axios` for HTTP requests
- Uses `cheerio` for HTML parsing (jQuery-like server-side)
- TypeScript for type safety
- Modern async/await patterns
- Fresh axios instances for each attempt to ensure clean state

Both implementations maintain feature parity and produce equivalent results.
