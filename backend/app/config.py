# backend/app/config.py
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

# Fetch the Java microservice URL from the environment variable
JAVA_MICROSERVICE_URL = os.getenv('JAVA_MICROSERVICE_URL', 'http://localhost:8080/api/data')  # Default to localhost:8080