import { MockFile } from "./types";

// Sample Legacy Python 2.7 Code
export const LEGACY_FILES: MockFile[] = [
  {
    name: "README.md",
    content: `# Legacy User Service (v1.0)
DEPRECATED: Do not deploy to production.

This service handles user profiles and configuration loading.
Last updated: Oct 2014.

## Dependencies
- Python 2.7
- Flask 0.12

## Todo
- Upgrade to Python 3 (Pending since 2018)
- Fix known security issues with pickle
`
  },
  {
    name: "app.py",
    content: `import os
import cPickle as pickle
from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return "Welcome to the Legacy App"

@app.route('/user/<username>')
def user_profile(username):
    # SQL Injection vulnerability
    query = "SELECT * FROM users WHERE username = '%s'" % username
    print "Executing query: " + query
    return "Profile for " + username

@app.route('/load_config', methods=['POST'])
def load_config():
    data = request.data
    # Insecure deserialization
    config = pickle.loads(data)
    return "Config loaded"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')`
  },
  {
    name: "utils.py",
    content: `import urllib2

def fetch_url(url):
    print "Fetching " + url
    try:
        response = urllib2.urlopen(url)
        return response.read()
    except Exception, e:
        print "Error: " + str(e)
        return None

def process_data(data_list):
    # Legacy iteration
    results = []
    for i in range(len(data_list)):
        results.append(data_list[i] * 2)
    return results`
  },
  {
    name: "requirements.txt",
    content: `Flask==0.12
requests==2.4.0`
  }
];

export const DEMO_REPO_URL = "https://github.com/legacy-corp/vulnerable-py2-app";