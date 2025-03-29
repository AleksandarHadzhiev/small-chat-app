import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
# Registered users and their websockets
users = {}

class Group:
    def __init__(self, name, email, type):
        self.name = name
        self.type = type
        self.members = []
        self.members.append(email)
        self.messages = []


    async def send_message_to_members(self, content, email, connections):
        for member in self.members:
            ws: WebSocket = connections[member]
            content = f"{email}: {content}"
            print(content)
            message = {
                "content": content,
                "group": self.name
            }
            self.messages.append(content)
            await ws.send_json(message)

    def update_name(self, name, owner):
        if owner == self.members[0]:
            self.name = name


    def group_join(self, email):
        self.members.append(email)


    def leave_group(self, email):
        if email in self.members:
            self.members.pop(email)


    def remove_user(self, email, owner):
        if owner == self.members[0]:
            self.leave_group(email=email)


groups: list[Group] = []


class ConnectionManager:
    def __init__(self):
        self.active_connections = {}


    async def connect(self, ws: WebSocket, email: str):
        await ws.accept()
        self.active_connections[email] = ws


    async def disconnect(self, email: str):
        self.active_connections.pop(email)


    async def broadcast(self, message, email):
        content = message["content"]
        group_name = message["group"]
        if len(groups) > 0:
            for group in groups:
                if group.name == group_name:
                    await group.send_message_to_members(content=content, email=email, connections=self.active_connections)


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
            data = await websocket.receive_json() 
            await connection_manager.broadcast(data, email)
    except WebSocketDisconnect:
        connection_manager.disconnect(email=email)
        await connection_manager.broadcast(f"Client #{email} left the chat")


@app.get("/groups")
async def get_groups():
    _groups = []
    for group in groups:
        _groups.append(group.name)
    print(_groups)
    return {"groups": _groups}


@app.post("/")
async def create_group(request: Request):
    body = await request.json()
    if "name" not in body:
        return {"fail": "A group needs a name to be created."}
    elif "email" not in body:
        return {"fail": "A user is needed to create a group."}
    # Continue proper checking
    name = body["name"]
    email = body["email"]
    type = body["type"]
    group = Group(name=name, email=email, type=type)
    groups.append(group)
    return {"message": "A group is created"}


# JOIN GROUP
@app.post("/group/join")
async def join_group(request: Request):
    body = await request.json()
    group_name = body["name"]
    user = body["email"]
    for group in groups:
        if group.name == group_name:
            group.group_join(email=user)


# LEAVE GROUP
@app.post("/leave")
async def leave_group(request: Request):
    body = await request.json()
    email = body["email"]
    group_name = body["name"]
    for group in groups:
        if group.name == group_name:
            group.leave_group(email=email)


# EDIT GROUP
@app.put("/edit")
async def update_name(request: Request):
    body = await request.json()
    owner = body["owner"]
    group_name = body["name"]
    new_name = body["newName"]
    for group in groups:
        if group.name == group_name:
            group.update_name(name=new_name, owner=owner)


# REMOVE MEMBER FROM GROUP
@app.post("/remove")
async def remove_member_from_group(request: Request):
    body = await request.json()
    email = body["email"]
    owner = body["owner"]
    group_name = body["name"]
    for group in groups:
        if group.name == group_name:
            group.remove_user(email=email, owner=owner)


# DELETE GROUP
@app.delete("/delete")
async def delete_group(request: Request):
    body = await request.json()
    owner = body["owner"]
    group_name = body["name"]
    for group in groups:
        if group.name == group_name and group[0] == owner:
            groups.pop(group)


@app.get("/{group_name}/messages")
async def getMessages(group_name):
    for group in groups:
        if group.name == group_name:
            return {"messages": group.messages}
    return {"messages": []}