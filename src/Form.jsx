import { useState } from "react";
import axios from "axios";

const API_BASE = "https://api.allorigins.win/get?url=";
const TRANSLATE_URL = "https://ftapi.pythonanywhere.com/translate";
const LANGUAGES_URL = "https://ftapi.pythonanywhere.com/languages";

const languages = [
  { code: "en", name: "🇺🇸 English" },
  { code: "te", name: "🇮🇳 Telugu" },
  { code: "hi", name: "🇮🇳 Hindi" },
  { code: "ta", name: "🇮🇳 Tamil" },
  { code: "fr", name: "🇫🇷 French" },
  { code: "es", name: "🇪🇸 Spanish" },
  { code: "de", name: "🇩🇪 German" },
  { code: "it", name: "🇮🇹 Italian" },
  { code: "pt", name: "🇵🇹 Portuguese" },
  { code: "ru", name: "🇷🇺 Russian" },
  { code: "ja", name: "🇯🇵 Japanese" },
  { code: "ar", name: "🇸🇦 Arabic" },
  { code: "tr", name: "🇹🇷 Turkish" },
  { code: "zh-CN", name: "🇨🇳 Chinese (Simplified)" },
];

export default function TranslationForm() {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("te");
  const [translated, setTranslated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setTranslated("");

    try {
      const params = sourceLang === "auto"
        ? `dl=${targetLang}&text=${encodeURIComponent(text.trim())}`
        : `sl=${sourceLang}&dl=${targetLang}&text=${encodeURIComponent(text.trim())}`;

      const url = `${API_BASE}${encodeURIComponent(TRANSLATE_URL + '?' + params)}`;
      const res = await axios.get(url);
      
      // Parse proxy response
      const data = JSON.parse(res.data.contents);
      const translatedText = data["destination-text"] || "No translation available";
      setTranslated(translatedText);
    } catch (err) {
      console.error("Translation error:", err);
      setError("Translation failed. Try shorter text or different languages.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!translated) return;
    await navigator.clipboard.writeText(translated);
  };

  const handleSpeak = () => {
    if (!translated || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(translated);
    utterance.lang = targetLang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleSwapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50 rounded-3xl p-8 md:p-12 transition-all duration-500 hover:shadow-3xl">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              🌍 Language Translator
            </h1>
          </div>

          {/* Language selectors */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">From</label>
              <select
                className="w-full px-5 py-4 bg-white/70 border-2 border-indigo-200 rounded-2xl shadow-lg focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all duration-300 text-lg font-medium hover:shadow-xl hover:bg-white"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="md:self-center p-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-2xl shadow-lg hover:shadow-xl hover:from-gray-500 hover:to-gray-600 transform hover:-translate-y-1 transition-all duration-200 font-bold text-xl self-start md:self-center"
              onClick={handleSwapLanguages}
              title="Swap languages"
            >
              ↔️
            </button>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">To</label>
              <select
                className="w-full px-5 py-4 bg-white/70 border-2 border-purple-200 rounded-2xl shadow-lg focus:border-purple-400 focus:ring-4 focus:ring-purple-100/50 transition-all duration-300 text-lg font-medium hover:shadow-xl hover:bg-white"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Text to translate
            </label>
            <textarea
              className="w-full px-6 py-6 bg-white/60 border-2 border-gray-200 rounded-3xl shadow-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all duration-300 resize-vertical min-h-[140px] text-lg placeholder-gray-500 hover:shadow-2xl hover:border-gray-300"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{text.length}/500</p>
          </div>

          {/* Button */}
          <button
            className="w-full px-8 py-6 bg-gradient-to-r cursor-pointer from-indigo-600 via-purple-600 to-blue-600 text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-6"
            onClick={handleTranslate}
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <>
                <div className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Translating...
              </>
            ) : (
              "✨ Translate Now"
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="mb-8 p-5 bg-red-50 border-2 border-red-200 rounded-2xl shadow-md">
              <p className="text-red-800 font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Result */}
          {translated && (
            <div className="p-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-3xl shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex-1">
                  ✅ Translation Result
                </h3>
                <div className="flex gap-3 flex-shrink-0">
                  <button
                    className="px-5 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
                    onClick={handleCopy}
                  >
                    📋 Copy
                  </button>
                  <button
                    className="px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
                    onClick={handleSpeak}
                  >
                    🔊 Speak
                  </button>
                </div>
              </div>
              <div className="bg-white/80 p-6 rounded-2xl border border-gray-200 shadow-inner">
                <p className="text-xl whitespace-pre-wrap text-gray-800 font-medium min-h-[80px]">
                  {translated}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
