import json
from fastapi import FastAPI, WebSocket

from fastapi.middleware.cors import CORSMiddleware
# Registered users and their websockets
users = {}

app = FastAPI()
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods="*",
    allow_headers="*"
)


@app.get("/")
def root():
    return json.dumps(list(users.keys()))


@app.post("/{email}")
async def sign_in(email: str):
    checked_data = _validate_incoming_data(email)
    if type(checked_data) == dict:
        return checked_data
    return _get_user(email=checked_data)


def _validate_incoming_data(email: str):
    if email is None:
        return {"fail": "Incorrect data"}
    elif str(email).isspace() or email == "":
        return {"fail": "Empty email"}
    elif "@" not in email:
        return {"fail": "The email format is incorrect"}
    return email


def _get_user(email):
    if email in users:
        return users[email]
    else:
        return register_user(email=email)


def register_user(email):
    users[email] = ""
    return email