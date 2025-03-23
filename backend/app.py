import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
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

class ConnectionManager:
    def __init__(self):
        self.active_connections = users


    async def connect(self, ws: WebSocket, email: str):
        await ws.accept()
        self.active_connections[email] = ws


    async def disconnect(self, email: str):
        self.active_connections.pop(email)


    async def broadcast(self, message: str):
        for email in self.active_connections:
            ws: WebSocket = self.active_connections[email]
            await ws.send_text(message)

connection_manager = ConnectionManager()

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


@app.websocket("/ws/{email}")
async def websocket_endpoint(websocket: WebSocket, email: str):
    await connection_manager.connect(ws=websocket, email=email)
    try:
        while True:
            data = await websocket.receive_text() 
            await connection_manager.broadcast(f"Client #{email}: {data}")
    except WebSocketDisconnect:
        connection_manager.disconnect(email=email)
        await connection_manager.broadcast(f"Client #{email} left the chat")