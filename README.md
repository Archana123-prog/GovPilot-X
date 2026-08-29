# GovPilot-X

GovPilot-X connects government challenges with verified startup capability and pilot milestones.

## Structure

- `index.html`, `app.js`, `styles.css`: live static client for GitHub Pages
- `frontend/`: Vite + React frontend, with the previous multi-role HTML/CSS/JS modules retained for migration
- `backend/`: FastAPI API, services, domain boundaries, AI, database, and workers
- `firebase/`: Firestore, Storage, and Functions configuration
- `public/`: public images, icons, and favicon assets

## Run the Python API

```powershell
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

Open `http://localhost:8000` for the client and `http://localhost:8000/docs` for the API docs.

## Run the React frontend

```powershell
cd frontend
npm install
npm run dev
```

Build the frontend for production with `npm run build` from `frontend/`.

## GitHub Pages

Deploy the repository root from the `main` branch. The root `index.html` is the GitHub Pages entry point. `404.html` preserves client-side routes on refresh.

Keep credentials in local environment variables. Do not commit `backend/.env` or Firebase service-account keys.
