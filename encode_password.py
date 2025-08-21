# encode_password.py
import urllib.parse

password = "#Dashman15#@"
encoded = urllib.parse.quote_plus(password)
print(encoded)
