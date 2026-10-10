"""
Verification script querying backend health endpoint.
"""
import urllib.request
import json

def verify():
    url = "http://localhost:8000/api/v1/health"
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            print(f"Health check succeeded: {data}")
            return True
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

if __name__ == "__main__":
    verify()
