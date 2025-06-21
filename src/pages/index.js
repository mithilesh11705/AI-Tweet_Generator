import { useState, useEffect } from "react";

const TONES = [
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" },
  { value: "humorous", label: "Humorous" },
  { value: "informative", label: "Informative" },
  { value: "inspirational", label: "Inspirational" },
  { value: "controversial", label: "Controversial" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
];

const LENGTHS = [
  { value: "short", label: "Short (100 chars)" },
  { value: "medium", label: "Medium (200 chars)" },
  { value: "long", label: "Long (280 chars)" },
];

const EMOJIS = {
  "😊": "Happy",
  "😂": "Laughing",
  "🎉": "Celebration",
  "🔥": "Hot",
  "💡": "Idea",
  "🚀": "Growth",
  "💪": "Strong",
  "❤️": "Love",
  "👏": "Applause",
  "✨": "Sparkle",
};

export default function Home() {
  const [topic, setTopic] = useState("");
  const [mood, setMood] = useState("");
  const [tweets, setTweets] = useState([]);
  const [selectedTweet, setSelectedTweet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestedHashtags, setSuggestedHashtags] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [generationCount, setGenerationCount] = useState(3);
  const [selectedTone, setSelectedTone] = useState("casual");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedLength, setSelectedLength] = useState("medium");
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Initialize dark mode from localStorage and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Function to generate hashtags based on topic
  const generateHashtags = (topic) => {
    if (!topic) return [];
    const words = topic.toLowerCase().split(" ");
    const hashtags = words.map((word) => `#${word.replace(/[^a-z0-9]/g, "")}`);
    return [...new Set(hashtags)].slice(0, 5);
  };

  // Update hashtags when topic changes
  useEffect(() => {
    setSuggestedHashtags(generateHashtags(topic));
  }, [topic]);

  const generateTweets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tweet-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          mood,
          hashtags: selectedHashtags,
          count: generationCount,
          tone: selectedTone,
          language: selectedLanguage,
          length: selectedLength,
          emojis: selectedEmojis,
        }),
      });

      const { tweets: generatedTweets } = await response.json();
      setTweets(generatedTweets);
      setSelectedTweet(generatedTweets[0]);
    } catch (error) {
      console.error("Failed to generate tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHashtag = (hashtag) => {
    setSelectedHashtags((prev) =>
      prev.includes(hashtag)
        ? prev.filter((h) => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const toggleEmoji = (emoji) => {
    setSelectedEmojis((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const regenerateTweet = async (index) => {
    try {
      setLoading(true);
      const response = await fetch("/api/tweet-generator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          mood,
          hashtags: selectedHashtags,
          count: 1,
          tone: selectedTone,
          language: selectedLanguage,
          length: selectedLength,
          emojis: selectedEmojis,
        }),
      });

      const {
        tweets: [newTweet],
      } = await response.json();
      const newTweets = [...tweets];
      newTweets[index] = newTweet;
      setTweets(newTweets);
      if (selectedTweet === tweets[index]) {
        setSelectedTweet(newTweet);
      }
    } catch (error) {
      console.error("Failed to regenerate tweet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 p-4 transition-colors duration-200">
      <div className="card p-8 max-w-4xl w-full space-y-6 animate-fade-in">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center">
          <div className="text-center space-y-2 flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Tweet Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Create engaging tweets with AI assistance
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg
                className="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Input Section */}
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="topic"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200"
              >
                What's your topic?
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Technology, Sports, Food..."
                className="input-field w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              {/* Hashtag Suggestions */}
              {suggestedHashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedHashtags.map((hashtag) => (
                    <button
                      key={hashtag}
                      onClick={() => toggleHashtag(hashtag)}
                      className={`px-2 py-1 rounded-full text-sm transition-colors ${
                        selectedHashtags.includes(hashtag)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {hashtag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="mood"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200"
              >
                What's the mood?
              </label>
              <input
                type="text"
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g., Funny, Professional, Casual..."
                className="input-field w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Advanced Customization Options */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                  Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setSelectedTone(tone.value)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTone === tone.value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="input-field w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                  Length
                </label>
                <div className="flex flex-wrap gap-2">
                  {LENGTHS.map((length) => (
                    <button
                      key={length.value}
                      onClick={() => setSelectedLength(length.value)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedLength === length.value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {length.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">
                  Emojis
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="input-field w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-between"
                  >
                    <span>
                      {selectedEmojis.length > 0
                        ? selectedEmojis.join(" ")
                        : "Select emojis..."}
                    </span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 grid grid-cols-5 gap-2">
                      {Object.entries(EMOJIS).map(([emoji, label]) => (
                        <button
                          key={emoji}
                          onClick={() => toggleEmoji(emoji)}
                          className={`p-2 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            selectedEmojis.includes(emoji)
                              ? "bg-blue-100 dark:bg-blue-900"
                              : ""
                          }`}
                          title={label}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="generationCount"
                className="block text-lg font-medium text-gray-700 dark:text-gray-200"
              >
                Number of Variations
              </label>
              <select
                id="generationCount"
                value={generationCount}
                onChange={(e) => setGenerationCount(Number(e.target.value))}
                className="input-field w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value={3}>3 variations</option>
                <option value={5}>5 variations</option>
                <option value={7}>7 variations</option>
              </select>
            </div>

            <button
              onClick={generateTweets}
              className="btn-primary w-full flex items-center justify-center space-x-2"
              disabled={loading || !topic || !mood}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <span>Generate Tweets</span>
              )}
            </button>
          </div>

          {/* Tweet Display Section */}
          <div className="flex-1">
            <div className="h-full flex flex-col">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  AI Assistant
                </h2>
              </div>

              <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900 rounded-xl p-6 min-h-[200px]">
                {tweets.length > 0 ? (
                  <div className="space-y-4">
                    {tweets.map((tweet, index) => (
                      <div
                        key={index}
                        className={`bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm transition-all cursor-pointer hover:shadow-md ${
                          selectedTweet === tweet ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedTweet(tweet)}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-lg leading-relaxed text-gray-900 dark:text-gray-100">
                            {tweet}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              regenerateTweet(index);
                            }}
                            className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            title="Regenerate this tweet"
                          >
                            <svg
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {tweet.length}/280 characters
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex gap-2">
                        {selectedHashtags.map((hashtag) => (
                          <span
                            key={hashtag}
                            className="text-sm text-blue-500 dark:text-blue-400"
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            selectedTweet + " " + selectedHashtags.join(" ")
                          )
                        }
                        className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center space-x-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        <span>Copy Selected Tweet</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>Your generated tweets will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
