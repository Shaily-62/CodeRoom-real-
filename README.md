## OFF-CAMPUS CODE : ZW6QWA

# CodeRoom

**A Real-Time Collaborative Coding Platform**

CodeRoom is a web-based platform that allows developers and students to work together on coding projects. It provides a shared workspace where team members can collaborate on code, manage projects and communicate with their teammates.

The goal of CodeRoom is to make collaborative development easier, especially for students and small development teams working on projects together.

## Features

- **User Authentication** – Sign up and sign in securely.
- **Project Management** – Create and manage coding projects.
- **Team Collaboration** – Invite members and manage project teams.
- **Real-Time Code Editing** – Collaborate on code with multiple team members.
- **Role-Based Access** – Support owner, editor and viewer roles.
- **Project Workspace** – Organize project files and folders.
- **Data Persistence** – Store project information and collaborative document data using Supabase.

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend |
| Vite | Frontend development |
| Tailwind CSS | Styling |
| Node.js | Backend runtime |
| Express.js | REST API |
| Supabase | Authentication and PostgreSQL database |
| Socket.IO / Yjs / Hocuspocus | Real-time collaboration |

## Project Structure

```text
CodeRoom/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.jsx
│   └── package.json
│
├── docker/
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git
- A Supabase account

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd CodeRoom
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure your Supabase credentials and other required environment variables.

Start the backend:

```bash
npm run dev
```

### 3. Setup the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Configure Supabase

- Create a Supabase project.
- Configure the database tables.
- Enable Supabase Authentication.
- Configure the required environment variables.
- Apply the database schema and Row Level Security policies.

## How It Works

1. Users create an account or sign in.
2. A user creates a collaborative project.
3. Team members can be invited to join the project.
4. Members access the shared project workspace.
5. Team members collaborate on code in real time.
6. Project and collaboration data are persisted through the backend and Supabase.

## Future Improvements

- In-editor team chat.
- Video and audio meetings.
- Advanced project analytics.
- GitHub integration.
- Improved collaboration and presence indicators.

## Project Status

🚧 Under Development

CodeRoom is actively being developed, with a focus on making collaborative coding easier for small development teams.

## License

This project is currently under development. License details will be added later.
