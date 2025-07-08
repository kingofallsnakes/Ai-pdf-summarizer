// File: App.jsx (Enhanced UI with Copy, TTS, Toggle View, Highlight)
import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const GEMINI_API_KEY = "AIzaSyDfY5gSge2968QaFGhGNvtwKgfbJx2rke8";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export default function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [formattedView, setFormattedView] = useState(true);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  const speak = (msg) => {
    if (synthRef.current.speaking) synthRef.current.cancel();
    utteranceRef.current = new SpeechSynthesisUtterance(msg);
    utteranceRef.current.lang = 'en-US';
    synthRef.current.speak(utteranceRef.current);
  };

  const stopSpeaking = () => {
    synthRef.current.cancel();
  };

  const highlightImportantLines = (text) => {
    return text.split('\n').map((line, index) => {
      const lower = line.toLowerCase();
      const isImportant = lower.includes("important") || lower.includes("advantage") || lower.includes("limitation");
      const clean = line.replace(/[*#•]+/g, '').trim();
      return <p key={index} className={isImportant ? 'highlight' : ''}>{clean}</p>;
    });
  };

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str).join(' ');
      fullText += strings + '\n';
    }
    if (fullText.trim().length < 10) return await extractTextUsingOCR(file);
    return fullText;
  };

  const extractTextUsingOCR = async (file) => {
    const imageUrl = URL.createObjectURL(file);
    const result = await Tesseract.recognize(imageUrl, 'eng');
    return result.data.text;
  };

  const extractTextFromDocx = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const extractTextFromTxt = async (file) => {
    return await file.text();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setAnswer('');
    setSummary('');
    let extracted = '';
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') extracted = await extractTextFromPDF(file);
    else if (ext === 'docx') extracted = await extractTextFromDocx(file);
    else if (ext === 'txt') extracted = await extractTextFromTxt(file);
    else {
      setSummary('❌ Unsupported file type.');
      setLoading(false);
      return;
    }
    setText(extracted);
    const shortText = extracted.slice(0, 8000);
    const prompt = `Summarize this:\n\n${shortText}`;
    try {
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary found.';
      setSummary(result);
      speak(result);
    } catch (err) {
      setSummary('⚠️ Error: ' + err.message);
    }
    setLoading(false);
  };

  const askQuestion = async () => {
    if (!query || !text) return;
    setLoading(true);
    const context = text.slice(0, 8000) + '\n' + history.map(h => `Q: ${h.q}\nA: ${h.a}`).join('\n');
    const prompt = `Based on this context:\n${context}\nQ: ${query}`;
    try {
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer.';
      setAnswer(result);
      speak(result);
      setHistory(prev => [...prev, { q: query, a: result }]);
    } catch (err) {
      setAnswer('⚠️ Error: ' + err.message);
    }
    setLoading(false);
  };

  const downloadAsTxt = () => saveAs(new Blob([summary], { type: 'text/plain' }), 'summary.txt');
  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.text(summary, 10, 10);
    doc.save('summary.pdf');
  };

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <h1>📄 Cobra Summarizer</h1>
      <input type="file" onChange={handleFile} accept=".pdf,.docx,.txt" />
      <button onClick={() => setDarkMode(!darkMode)}>🌗 Theme</button>
      <button onClick={stopSpeaking}>⛔ Stop Voice</button>
      <button onClick={() => setFormattedView(!formattedView)}>
        {formattedView ? '🧾 Raw View' : '✨ Clean View'}
      </button>
      {loading ? <p className="loading">⏳ Please wait...</p> : (
        <>
          {summary && <div className="output">
            <h3>📑 Summary:</h3>
            <button onClick={() => speak(summary)}>🔊 Play</button>
            <button onClick={() => navigator.clipboard.writeText(summary)}>📋 Copy</button>
            <div className="summary-text">
              {formattedView ? highlightImportantLines(summary) : <pre>{summary}</pre>}
            </div>
          </div>}
          {summary && (
            <div className="export">
              <button onClick={downloadAsTxt}>💾 Export TXT</button>
              <button onClick={downloadAsPDF}>🧾 Export PDF</button>
              <button onClick={() => window.scrollTo(0, 0)}>⬆️ Top</button>
            </div>
          )}
          {summary && (
            <div className="chat">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask a question..." />
              <button onClick={askQuestion}>❓ Ask</button>
              {answer && <div className="answer"><h4>🧠 Answer:</h4><p>{answer}</p></div>}
              <div className="history">
                <h4>📚 Chat History:</h4>
                {history.map((h, i) => <p key={i}><strong>Q:</strong> {h.q}<br /><strong>A:</strong> {h.a}</p>)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}