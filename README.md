# বাংলা কোডনেমস — Bengali Codenames

A web version of the classic **Codenames** word-guessing party game, played in **Bengali (বাংলা)**.
Pure HTML/CSS/JavaScript — no build step, no dependencies. Runs anywhere static files can be served, including **GitHub Pages**.

![Bengali Codenames preview](https://img.shields.io/badge/play-online-brightgreen) ![No build](https://img.shields.io/badge/build-none-blue) ![GitHub Pages ready](https://img.shields.io/badge/GitHub_Pages-ready-success)

---

## ✨ Features

- 🔗 **Cross-device multiplayer via shared link** — every game has a 6-character code (e.g. `K7M2QX`). Anyone who opens the link `?game=K7M2QX` sees the **exact same 25 words and the exact same color key**, on any device, anywhere in the world. **No server, no signup, no backend.**
- 🕵️ **Private spymaster view** — each player toggles spymaster on their own device, so colors stay secret from teammates.
- 🎴 **25-card grid** with the standard 9 / 8 / 7 / 1 distribution.
- 🔴🔵 **Two teams** (লাল & নীল) with turn tracking and live scores.
- ☠️ **Assassin card** — one wrong click and the game ends instantly.
- 📚 **451 standard Bengali words** — common, concrete nouns curated for clue-giving (nature, animals, food, body, household, places, transport, etc.).
- 📱 **Fully responsive** — works on phones, tablets, and desktops.
- 🇧🇩 **Bengali typography** via Google Fonts (Noto Sans Bengali, Hind Siliguri).
- ⌨️ **Keyboard shortcuts** — `N` for new game, `S` to toggle spymaster, `Esc` to close modal.

---

## 🎮 How to play

Two teams (Red and Blue) compete. Each team picks a **Spymaster** who can see the colour of every word on the board. The spymaster gives a **single-word clue and a number** (e.g. `ফল ৩`) to help their team guess words of their colour.

- Click your team's word → point earned, keep going.
- Click a neutral (grey) word → turn ends.
- Click the other team's word → turn ends + they get a point.
- Click the **assassin** (black) word → your team loses immediately.

The first team to find all their agents wins.

## 📱 Playing across multiple devices

This is what makes the game work for remote groups, video calls, or any setting where one shared screen isn't ideal:

1. **Host** opens the site and clicks **নতুন খেলা** (New game). A 6-character code appears in the top bar (e.g. `K7M2QX`).
2. The host clicks **🔗 লিঙ্ক কপি (Copy link)** and pastes it into the group chat — *or* just tells everyone the 6-character code.
3. Everyone else either:
   - Clicks the link → joins instantly.
   - Or types the code into the **"কোড দিয়ে যোগ দিন"** box → joins.
4. Now **everyone sees the same 25 words in the same positions**.
5. Each spymaster privately presses the **গুপ্তচর প্রধান (Spymaster)** button on their own device — only they see the colors.
6. Players coordinate by talking (in person, voice or video call) just like real Codenames. Card clicks are local to each device, so the team agrees out loud who taps the guess.

### How does this work without a server?

The 6-character code is a **deterministic seed**. The same code always generates the same board — the same word order, the same colors, the same starting team — using a cryptographic-quality pseudo-random number generator (Mulberry32 with FNV-1a hashing). No data is sent anywhere; the board is rebuilt locally on each device from the code alone. This is why the game runs perfectly on a free static host like GitHub Pages.

> 💡 Bonus: you can also play **pass-and-play on one device** — just hand the phone around between turns.

---

## 🚀 Deploying to GitHub Pages

### Option 1 — Web upload (easiest, no terminal)

1. Create a new GitHub repo (e.g. `bengali-codenames`). Make it **public**.
2. Click **Add file → Upload files** and drag in:
   - `index.html`
   - `styles.css`
   - `game.js`
   - `words.js`
   - `README.md`
3. Commit the upload to the `main` branch.
4. Go to **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **Deploy from a branch**.
6. Set **Branch** to `main` and **Folder** to `/ (root)`. Click **Save**.
7. Wait ~1 minute. Your game is now live at:
   ```
   https://<your-username>.github.io/bengali-codenames/
   ```

### Option 2 — Git CLI

```bash
# In this folder
git init
git add .
git commit -m "Bengali Codenames — initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/bengali-codenames.git
git push -u origin main
```

Then enable GitHub Pages from **Settings → Pages** as described above.

### Custom domain (optional)

Add a file named `CNAME` containing your domain (e.g. `codenames.example.com`) and configure DNS to point at GitHub Pages. See the [GitHub Pages docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

---

## 🧪 Run locally

No installation needed — just open `index.html` directly in a browser, **or** run a tiny local server (recommended for proper font loading):

```bash
# Python 3
python3 -m http.server 8000
# Then visit http://localhost:8000
```

---

## 🗂 Project structure

```
bengali-codenames/
├── index.html      # Page markup
├── styles.css      # Visual design
├── game.js         # Game logic
├── words.js        # 451-word Bengali word list
└── README.md
```

---

## 🛠 Customizing the word list

Open `words.js` and add/remove entries from the `BENGALI_WORDS` array. The file already deduplicates, so duplicates across categories are safe. Aim for:

- **Concrete nouns** (objects, animals, places) — easy to clue.
- **Common everyday words** — accessible to all players.
- **One- or two-syllable** words when possible.

---

## 📜 License

MIT — free to use, modify, and share. Codenames is a trademark of Czech Games Edition; this is an unofficial fan-made implementation for personal use.

খেলা উপভোগ করুন — Happy playing 🎉
