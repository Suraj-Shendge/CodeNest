# Modern LeetCode (demo)

A **single‑page coding‑challenge platform** built with **Next.js 14**, **Material‑UI**, **Framer Motion**, **Monaco Editor**, and the free **Piston** execution API.  
All pages have smooth animated transitions – cards fade‑in, confetti on success, etc.

## 👉 What you get out of the box

- A list of problems with difficulty badges & tags  
- Markdown‑rendered problem statements  
- In‑browser code editor (Monaco) with language auto‑highlighting  
- “Run” button that sends the code to a sandboxed serverless function which talks to the **Piston** API (no Docker needed)  
- Animated result card + confetti on AC  
- Ready‑to‑deploy on **Vercel** (or any Node‑compatible host)

## 🔧 Tech stack

| Layer | Library / Service |
|-------|-------------------|
| Framework | **Next.js 14** (app router) |
| UI | **Material‑UI v5** + **Framer Motion** |
| Editor | **Monaco Editor** (client‑side) |
| Execution | Serverless function → [Piston API](https://emkc.org/api/v2/piston) |
| Styling | MUI theming + tiny `globals.css` |
| Animations | Framer Motion, `react-confetti` |
| Data | Static `data/problems.json` (replace with a DB later) |
| Deploy | **Vercel** (zero config) |
| CI | GitHub Actions lint (optional) |

## 🚀 Getting started locally

### Prerequisites

- **Node 20+** (recommended)
- **pnpm** (or `npm`/`yarn`)

```bash
# 1️⃣ Clone (or copy) the repo
git clone https://github.com/<YOUR‑USER>/modern-leetcode.git
cd modern-leetcode

# 2️⃣ Install deps
pnpm install   # or npm install

# 3️⃣ Run dev server
pnpm dev       # or npm run dev
# Open http://localhost:3000

