# CloudTask

A full-stack CRUD task manager built with Node.js and Express, backed by IBM Cloudant — a managed NoSQL document database on IBM Cloud.

Built as a project for IBM Cloud Computing.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![IBM Cloudant](https://img.shields.io/badge/IBM%20Cloudant-054ADA?logo=ibm&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

### Live Demo

**[cloudtask-8rtb.onrender.com](https://cloudtask-8rtb.onrender.com)**

> Hosted on Render's free tier. The first request after idle may take 30-60 seconds to wake up — that's normal, not a bug.

---

### What is this?

Every task in this app is stored as a JSON document in IBM Cloudant — not a row in a table. The app connects to a live Cloudant instance on IBM Cloud, and all CRUD operations happen through the official `@ibm-cloud/cloudant` SDK.

The frontend is intentionally minimal — vanilla HTML, CSS, and JavaScript with no framework and no build step. The focus is on the cloud integration, not the UI library.

---

### Features

- **Full CRUD** — create, read, update, and delete tasks
- **Mark done / undo** — toggle task completion, persisted in Cloudant
- **Filter tabs** — switch between All, Active, and Completed views
- **Search** — instant client-side filtering
- **Clear all** — bulk delete with confirmation
- **Task count** — live counter updates with every action
- **Responsive** — works on desktop and mobile
- **Cloudant backend** — every task is a revision-tracked JSON document

---

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | IBM Cloudant NoSQL (CouchDB-compatible) |
| SDK | `@ibm-cloud/cloudant` (official IBM SDK) |
| Hosting | Render |
| Typography | DM Sans (Google Fonts) |

---

### Getting Started

**Try it live** — just open [cloudtask-8rtb.onrender.com](https://cloudtask-8rtb.onrender.com). No setup needed.

**Run locally:**

```bash
git clone <your-repo-url>
cd CloudTask
npm install
```

Create a `.env` file in the root:

```
CLOUDANT_URL=https://<your-instance>-bluemix.cloudantnosqldb.appdomain.cloud
CLOUDANT_APIKEY=your-api-key
DB_NAME=tasks
PORT=5000
```

Start the server:

```bash
npm run dev
```

Open `http://localhost:5000` in your browser.

---

### Connect to IBM Cloudant

1. Go to **IBM Cloud** > **Catalog** > search **Cloudant** > create on the **Lite plan** (free)
2. Open the resource > **Service credentials** > **New credential** > Create
3. Copy the `url` and `apikey` fields into your `.env` file
4. Restart the app — the database is created automatically on first run

---

### API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create a task — `{ "title" }` |
| PUT | `/tasks/:id` | Update a task — `{ "title"?, "completed"? }` |
| DELETE | `/tasks/:id` | Delete a single task |
| DELETE | `/tasks/all` | Delete all tasks |

---

### Project Structure

```
CloudTask/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── routes/
│   └── taskRoutes.js
├── cloudant.js
├── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

### Author

**Dev Jaiswal**
