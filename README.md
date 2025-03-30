# small-chat-app
Beta version of a small chat application using FastAPI Python and Next.js

## Description

The app has for a goal to serve as a beta version for the full-scale app for an application similar to Discord.
The backend will be in FastAPI utilizing `websockets`. For the frontend Next.js will be utilized for simple design.

## Backend

The backend will have a very simple architecture: 
 - WebSockets: connection for the messaging functionality
 - REST API:
  - creating users - simple email which is added to a dictionary where the email is a key for value of websocket.
  - creating groups - simple name which works also as an identifier of the grouo and list of members and messages.
- When WS receieves/sends message, the message gets stored in the group.messages list.

## Frontend

The frontend will have a very simple architecture:
 - Register/Login page: user provides email and is then redirected to the chat app.
 - Chatting page: rooms for converstaion + creating personal groupchat.

## Architecture

![Architecture of an application](websockets.drawio.png)

## Bootup

#### Backend

To start the backend navigate to the backend folder. Inside the backend folder bootup the virtual evnironmnet, for Windows:
```
chat\Scripts\activate
```
When the environment has started run the following command in the terminal:
```
fastapi dev app.py
```
If all booted up correctly you will see that the server started at `http://localhost:8000`.

#### Frontend
To start the frontend naviagte to `frontned/chat`. Inside the folder run the following command in the terminal:
```
npm run dev
```
If all booted up correctly you wil see that the frontend is running on `http://localhost:3000`

## Example
!!! Imporant note - very simple chat app, there is no database, so after closing the app, all the data will be cleared, so you will need to redo all the steps.
1. Open the frontend
 - When opened it will load a simple login page asking for email.
 - Provide the email. The server will create an account and navigate to the chat page.
2. Chat page
 - When there are no groups existing it will ask you create a group, by simply providing a name.
 - The page will rerender and show a sidebar with groups on the left and loading sreen on the right
 - Select a group
3. Messaging
 - You can start writing messages - the websocket server will handle sending and reading them.
 - To test the messaging better, recreate the flow in a secodn browser and create another user. That way you can experience both users communicating real-time.

