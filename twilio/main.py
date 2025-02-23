from time import sleep
from twilio.rest import Client
import requests
# Twilio credentials (replace with your actual credentials)
ACCOUNT_SID = "AC5a05635b367abdb70b023c22c402c051"
AUTH_TOKEN = "5d9a3222ed27a8c54d87a23c6a3b396f"
TWILIO_PHONE_NUMBER = "+16317142951"
TO_PHONE_NUMBER = "+16789997644"

# Initialize Twilio client
client = Client(ACCOUNT_SID, AUTH_TOKEN)

# Make the call with recording enabled
call = client.calls.create(
    to=TO_PHONE_NUMBER,
    from_=TWILIO_PHONE_NUMBER,
    send_digits="1234#",  # Sends "1234#" as DTMF tones
    twiml="<Response><Say>Sending DTMF tones now.</Say></Response>",
    record=True  # Enable recording
)

print(f"Call initiated. SID: {call.sid}")

# Wait for call to complete
while True:
    call = client.calls(call.sid).fetch()
    print(f"Call status: {call.status}")

    if call.status in ["completed", "failed", "busy", "no-answer"]:
        break
    sleep(2)

if call.status == "completed":
    # Retrieve the recording
    recordings = client.recordings.list(call_sid=call.sid)

    if recordings:
        recording = recordings[0]  # Get first recording
        print(f"Recording SID: REe4b499ec927439f720ddad0de6d39abe, URL: /2010-04-01/Accounts/AC5a05635b367abdb70b023c22c402c051/Recordings/REe4b499ec927439f720ddad0de6d39abe.json")

        # Download the recording
        recording_url = f"https://api.twilio.com{recording.uri}.json"
        response = requests.get(recording_url, auth=(ACCOUNT_SID, AUTH_TOKEN))

        if response.status_code == 200:
            with open("recording.json", "wb") as f:
                f.write(response.content)
            print("Recording downloaded successfully as 'recording.json'.")
        else:
            print("Failed to download recording:", response.status_code)
    else:
        print("No recording found for this call.")

else:
    print("Call did not complete successfully. No transcription requested.")