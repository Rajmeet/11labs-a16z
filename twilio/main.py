from twilio.rest import Client

# Your Twilio account SID and Auth Token
account_sid = 'your_account_sid'
auth_token = 'your_auth_token'

# Create a Twilio client
client = Client(account_sid, auth_token)

# Make the call
call = client.calls.create(
    to='+1XXXXXXXXXX',   # The number you want to call (with country code)
    from_='+1XXXXXXXXXX',  # Your Twilio number (with country code)
    url='http://demo.twilio.com/docs/voice.xml'  # URL for TwiML instructions
)

print(f"Call SID: {call.sid}")
