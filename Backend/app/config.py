 # config (MongoDB, GPT-5 API key, etc.)
 
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "breakin")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# GPT-5 API key
GPT_API_KEY = os.getenv("GPT_API_KEY")
