# FEED Entry System
## Express.js Backend + React Native Frontend + MongoDB

---

## FOLDER STRUCTURE AFTER SETUP

```
FEED/
├── backend/          ← Express API server
│   ├── models/
│   │   ├── Doctor.js
│   │   ├── Farm.js
│   │   └── Visit.js
│   ├── routes/
│   │   ├── doctors.js
│   │   ├── farms.js
│   │   └── visits.js
│   ├── server.js
│   ├── .env          ← YOU CREATE THIS (not in git)
│   ├── .gitignore
│   └── package.json
│
└── frontend/         ← React Native app
    ├── src/
    │   ├── api/index.js
    │   ├── components/index.js
    │   ├── screens/
    │   │   ├── DoctorsScreen.js
    │   │   ├── FarmsScreen.js
    │   │   └── VisitScreen.js
    │   └── theme/index.js
    ├── App.js
    ├── app.json
    ├── babel.config.js
    └── package.json
```

---

## STEP 1 — Install MongoDB on your Mac (local database)

Open Terminal and run:

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

Verify it's running:
```bash
brew services list
```
You should see `mongodb-community` with status `started`.

---

## STEP 2 — Set up the backend

```bash
cd ~/Desktop/FEED/backend
npm install
```

Create the `.env` file (copy from `.env.example` or create manually):
```bash
echo "MONGO_URI=mongodb://127.0.0.1:27017/feeddb" > .env
echo "PORT=3000" >> .env
```

Start the backend:
```bash
npm run dev
```

You should see:
```
✅  MongoDB connected
✅  Server running on http://localhost:3000
```

Test it works — open your browser and go to:
`http://localhost:3000`

You should see: `{"message":"FEED API is running","time":"..."}`

---

## STEP 3 — Find your Mac's IP address

Your phone needs to reach your Mac's server over WiFi.

1. Go to **System Settings → Wi-Fi → click Details next to your network**
2. Copy the IP Address (looks like `192.168.1.42`)

OR run in Terminal:
```bash
ipconfig getifaddr en0
```

---

## STEP 4 — Set up the frontend

```bash
cd ~/Desktop/FEED/frontend
npm install --legacy-peer-deps
```

Open `src/api/index.js` in VS Code and change line 14:
```js
// Change this:
export const API_URL = "http://YOUR_MAC_IP:3000";

// To your actual IP, e.g.:
export const API_URL = "http://192.168.1.42:3000";
```

---

## STEP 5 — Test with Expo Go on your phone

Your phone MUST be on the same WiFi as your Mac.

In Terminal (inside the frontend folder):
```bash
npx expo start
```

A QR code will appear. Open **Expo Go** on your phone and scan it.
The app will load. All three tabs (Doctors, Farms, Visit) will work.

---

## STEP 6 — GitHub setup for collaboration

In Terminal:
```bash
cd ~/Desktop/FEED
git init
git add .
git commit -m "initial commit"
git branch -M main
```

Go to github.com → New repository → name it `FEED` → Create.

```bash
git remote add origin https://github.com/YOUR_USERNAME/FEED.git
git push -u origin main
```

Add collaborators: GitHub repo → Settings → Collaborators → Add people.

### What collaborators do:
```bash
git clone https://github.com/YOUR_USERNAME/FEED.git
cd FEED/backend && npm install && npm run dev
cd ../frontend && npm install --legacy-peer-deps && npx expo start
```
They scan the QR with Expo Go on their phone.
They need to update `src/api/index.js` with YOUR Mac's IP (or you change it to your
deployed backend URL once live).

---

## STEP 7 — Deploy to production (when ready for supervisor)

### Backend → Render (free)

1. Go to **render.com** → Sign up with GitHub
2. New → Web Service → connect your GitHub repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variable:
   - Key: `MONGO_URI`
   - Value: your MongoDB Atlas connection string (see below)
7. Deploy — you get a URL like `https://feed-backend.onrender.com`

### Database → MongoDB Atlas (free)

1. Go to **cloud.mongodb.com** → create free account
2. Create a free cluster (M0, any region)
3. Database Access → Add new user (username + password)
4. Network Access → Add IP Address → Allow access from anywhere (`0.0.0.0/0`)
5. Clusters → Connect → Connect your application → copy the connection string
   Looks like: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/feeddb`
6. Paste this as `MONGO_URI` in Render's environment variables

### Frontend → update API_URL

Once backend is deployed, in `src/api/index.js` change:
```js
export const API_URL = "https://feed-backend.onrender.com";
```

Commit and push. Anyone with Expo Go can now use the live app.

### Build a real APK (optional, when you want to share without Expo Go)
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

---

## API ENDPOINTS REFERENCE

| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/doctors | Get all doctors |
| GET | /api/doctors/:enroll | Get one doctor |
| POST | /api/doctors | Create/update doctor |
| GET | /api/farms | Get all farms |
| GET | /api/farms/:enroll | Get farms for one doctor |
| POST | /api/farms | Create/update farm record |
| GET | /api/visits | Get all visits |
| GET | /api/visits/:enroll | Get visits for one doctor |
| POST | /api/visits | Add new visit entry |

---

## TROUBLESHOOTING

**"Network request failed" in the app**
→ Make sure backend is running (`npm run dev` in backend folder)
→ Make sure phone is on same WiFi as Mac
→ Double-check the IP in `src/api/index.js`

**"ERESOLVE could not resolve" during npm install**
→ Run `npm install --legacy-peer-deps` instead

**MongoDB connection failed**
→ Run `brew services start mongodb-community@7.0`

**Expo Go won't scan / can't connect**
→ Run `npx expo start --tunnel` (uses internet relay, works on any network)
