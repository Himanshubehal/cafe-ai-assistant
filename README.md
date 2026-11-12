# Ask the Cafe – AI Cafe Assistant

A chatbot for a small cafe (Brew & Bite). Customers can ask about the menu, prices and timings and get instant replies.

## Features
- Chat interface like ChatGPT, with a typing indicator and auto-scroll
- AI replies using the Google Gemini API, limited to cafe topics through system instructions
- Chats saved in MongoDB, linked to a session ID in localStorage, so returning visitors see their old chat without logging in
- Error handling on both the frontend and the backend

## Tech Stack
React (Vite), Tailwind CSS, Node.js, Express, MongoDB (Mongoose), Google Gemini API

## Run Locally
1. Clone the repo
2. In `server`, run `npm install` and create a `.env` file with `GEMINI_API_KEY` and `MONGO_URI`
3. Run `node server.js`
4. In `client`, run `npm install`, then `npm run dev`

## Future Improvements
- User login so chats sync across devices
- Admin page for the cafe owner to update the menu