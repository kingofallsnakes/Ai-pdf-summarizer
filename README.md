# 📄 AI PDF Summarizer

> 🔥 A modern AI-powered tool to extract and summarize content from `.pdf`, `.docx`, and `.txt` files with voice support, dark mode UI, and instant Q&A using Gemini AI.

[![Made with React](https://img.shields.io/badge/Made%20with-React-blue?logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)
[![Status](https://img.shields.io/badge/status-Active-blue)](#)

---

## 🚀 Live Demo

🧠 Coming soon on [Vercel/Netlify] – or deploy it yourself using the guide below.

---

## ✨ Features

- 📂 Upload files (`.pdf`, `.docx`, `.txt`)
- 📄 Extracts text using PDF.js, Mammoth & Tesseract OCR fallback
- 🧠 Summarizes content using **Gemini 2.0 Flash Model**
- 🎙️ Text-to-speech play/stop functionality
- ❓ Ask questions from file context (AI Q&A)
- 💾 Export summary as `.txt` or `.pdf`
- 🌗 Toggle Light/Dark theme with animated backgrounds
- 📜 Styled output with subheadings, clean lines, readable fonts
- 📱 Fully responsive + mobile friendly UI

---

## 🧰 Tech Stack

| Layer        | Tech Used                             |
|--------------|----------------------------------------|
| Frontend     | `React + Vite`                         |
| AI Backend   | `Gemini API (Google Generative AI)`    |
| Text Extraction | `pdfjs-dist`, `tesseract.js`, `mammoth`, `FileSaver`, `jsPDF` |
| Styling      | `CSS3` with `glassmorphism`, `animations`, `dark/light themes` |
| TTS Support  | `SpeechSynthesis` Web API             |

---

## 🔧 Installation

1. **Clone the repo**  
```bash
git clone https://github.com/kingofallsnakes/Ai-pdf-summarizer.git
cd Ai-pdf-summarizer
````

2. **Install dependencies**

```bash
npm install
```

3. **Add your API Key**
   Replace your Gemini API key in `App.jsx`:

```js
const GEMINI_API_KEY = "your-api-key-here";
```

4. **Run locally**

```bash
npm run dev
```

---

## Screenshots

<img width="1366" height="456" alt="Image" src="https://github.com/user-attachments/assets/f7c8dd15-3ab4-46f6-9c68-a1d9b6597998" />

<img width="1366" height="708" alt="Image" src="https://github.com/user-attachments/assets/33e68d7a-c4bf-45a6-89c5-f3b6031f1fe4" />

<img width="786" height="530" alt="Image" src="https://github.com/user-attachments/assets/9640314c-b84a-48f5-b682-feab32f4aea9" />

<img width="966" height="321" alt="Image" src="https://github.com/user-attachments/assets/7decdede-d78e-434e-a823-50907020c481" />

---

## 📂 Project Structure

```bash
├── public/
│   └── index.html
├── src/
│   ├── App.jsx         # Main React component
│   ├── index.css       # Reset/default styling
│   ├── style.css       # Custom UI styles
├── .gitignore
├── README.md
├── package.json
└── vite.config.js
```

---

## 🛠️ Usage

1. Upload a `.pdf`, `.docx`, or `.txt` file.
2. The app extracts and summarizes it using Gemini.
3. You can ask questions about the content.
4. Export the summary if needed.

Build with:

```bash
npm run build
```

---

## 🤝 Contributing

Pull requests are welcome!
Feel free to fork the repo and submit PRs for improvements.

> 📧 DM me on GitHub if you'd like to collaborate on more AI tools!

---

## 📜 License

This project is licensed under the **MIT License**.
Feel free to use it in your own projects with credit!

---

## 👑 Author

Created with ❤️ by [@kingofallsnakes](https://github.com/kingofallsnakes)
✨ Smart tools. Clean UI. Real AI.

