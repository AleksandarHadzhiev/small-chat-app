from fastapi import FastAPI, WebSocket, Request

# Registered users and their websockets
users = {}

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello, World!"}


@app.websocket("/ws")
async def sign_in(request: Request, websocket: WebSocket):
    body = await request.json()
    checked_data = _validate_incoming_data(body=body)
    if type(checked_data) == dict:
        return checked_data
    return _get_user(email=checked_data, ws=websocket)


def _validate_incoming_data(body):
    if "email" not in body:
        return {"fail": "Incorrect data"}
    elif str(body["email"]).isspace() or body["email"] == "":
        return {"fail": "Empty email"}
    elif "@" not in body["email"]:
        return {"fail": "The email format is incorrect"}
    return body["email"]


def _get_user(email, ws: WebSocket):
    if email in users:
        return users[email]
    else:
        register_user(email=email, ws=ws)


def register_user(email, ws: WebSocket):
    users[email] = ws
    return ws