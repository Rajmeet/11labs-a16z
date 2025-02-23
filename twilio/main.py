from twilio.rest import Client
from dotenv import load_dotenv
import os
load_dotenv()

# Twilio credentials (from env)
ACCOUNT_SID = os.getenv("ACCOUNT_SID")
AUTH_TOKEN = os.getenv("AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
TO_PHONE_NUMBER = os.getenv("TO_PHONE_NUMBER")

# Initialize Twilio client
client = Client(ACCOUNT_SID, AUTH_TOKEN)

# List all verified phone numbers
verified_numbers = client.incoming_phone_numbers.list()
for number in verified_numbers:
    print(f"Verified number: {number.phone_number}")

outbound_numbers = client.outgoing_caller_ids.list()
for number in outbound_numbers:
    print(f"Outbound number: {number.phone_number}")

# # Make the call
call = client.calls.create(
    twiml="<Response><Say>Hello, world!</Say></Response>",
    to=TO_PHONE_NUMBER,
    from_=TWILIO_PHONE_NUMBER,
)

print(f"Call initiated with SID: {call.sid}")