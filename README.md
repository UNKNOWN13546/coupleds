# Coupled 💕 — Grow Closer Every Day

**Coupled** is a premium, mobile-first web application designed to help couples deepen their connection through daily synced questions, shared memory timelines, interactive challenge packs, personality compatibility quizzes, and relationship insights.

Designed with a high-end dark-mode aesthetic, Coupled features rich glassmorphism, smooth animations, and multi-theme support.

---

## 🚀 Live Demo & Repository
* **GitHub Repository**: [https://github.com/UNKNOWN13546/coupleds](https://github.com/UNKNOWN13546/coupleds)
* **Dev Server**: `http://localhost:5173` (Runs locally)

---

## 🎨 Themes
Coupled supports 4 beautiful, distinct visual themes that change the entire look and feel:
1. **Rose** 🌹 (Default - soft pink & violet glow)
2. **Midnight** 🌙 (Deep indigo & cyan neon)
3. **Aurora** 🌌 (Electric green & cyan)
4. **Forest** 🌿 (Golden sage & forest green)

---

## ✨ Features

### 1. 👤 Magical Onboarding
* A 4-step interactive flow with pulsing brand icons and particle backdrops.
* Allows Partner A to create a space, generate a unique 6-digit couple code, "invite" Partner B, and set their anniversary date.

### 2. 🤔 Synced Daily Question
* A curated bank of **65+ thoughtful questions** across categories like communication, dreams, memories, intimacy, and fun.
* **Synced Reveal UX**: Answers are hidden until both partners have submitted their responses. If one partner has answered, they see a beautiful orbiting-hearts waiting animation. Once both answer, a dramatic 3D card flip reveal is triggered along with a confetti celebration!
* Add emoji reactions (❤️, 🥰, 😂, 🤔, 💯) to your partner's answers.

### 3. 🔥 Challenge Packs
* 6 structured, 7-day challenge packs: *Love Languages, Gratitude, Adventure, Communication, Intimacy, and Trust*.
* Complete daily tasks, track completion with progress bars, and celebrate completing the pack with custom confetti.

### 4. 📸 Memories Polaroid Timeline
* Share special moments with photo uploads, text captions, and milestones (e.g. *First Date, Anniversary, Vacation*).
* Styled as polaroid-style photos with interactive hover tilt effects on a chronological timeline.

### 5. 🧠 Compatibility Quiz & Radar Chart
* A 20-question compatibility quiz covering 4 core relationship areas: *Attachment Style, Love Language, Communication, and Life Values*.
* Once both partners finish, a custom-drawn **SVG Radar Chart** overlays both partners' personality footprints to visualize compatibility, highlighting areas of strong alignment and different perspectives.

### 6. 📊 Relationship Insights
* **Streak Calendar**: A GitHub-style contribution grid that lights up when you both answer questions.
* **Health Ring**: An animated SVG donut chart computing your overall relationship health score based on streaks, answered questions, challenges, and quiz progress.
* **Stats Counter**: Tracks days together, memories created, and questions answered.

---

## 🛠️ Tech Stack
* **Frontend Framework**: React (Vite-powered SPA)
* **Styling**: Vanilla CSS (CSS Custom Variables for absolute control and the highest custom aesthetics)
* **Animations**: Framer Motion + Pure CSS Keyframe animations
* **State Management**: React Context + localStorage (Reducer pattern for clean, persistent state)

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Open in Browser
Open `http://localhost:5173` in your browser. 
* *Note: Since the app is built mobile-first, it looks and feels best when viewed in chrome devtools device emulator or resized to a mobile viewport width (approx. 400px).*

---

## 👥 Simulated Sync
To make it easy to test on a single device, Coupled features a **Simulated Sync** system. 
* You can switch back and forth between **Partner A** and **Partner B** using the quick-toggle avatar in the top right or the switch option in the **Profile** tab.
* This allows you to experience the onboarding, the waiting screen, and the synced reveal without needing two separate phones or databases!
