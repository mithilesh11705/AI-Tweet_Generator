import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Cache for storing recent generations to avoid duplicate API calls
const generationCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      topic,
      mood,
      hashtags = [],
      count = 1,
      tone = "casual",
      language = "en",
      length = "medium",
      emojis = [],
    } = req.body;

    if (!topic || !mood) {
      return res.status(400).json({ error: "Topic and mood are required" });
    }

    // Create a cache key based on the input parameters
    const cacheKey = JSON.stringify({
      topic,
      mood,
      hashtags,
      tone,
      language,
      length,
      emojis,
    });

    // Check if we have a cached result
    const cachedResult = generationCache.get(cacheKey);
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      return res.status(200).json({ tweets: cachedResult.tweets });
    }

    // Generate tweets in parallel with optimized parameters
    const tweetPromises = Array(count)
      .fill()
      .map(async () => {
        const prompt = `Generate a viral tweet about ${topic} with a ${mood} tone. 
      The tweet should be ${tone} in style.
      ${
        length === "short"
          ? "Keep it very concise (around 100 characters)."
          : length === "medium"
          ? "Make it medium length (around 200 characters)."
          : "Use the full character limit (280 characters)."
      }
      ${emojis.length > 0 ? `Include these emojis: ${emojis.join(" ")}` : ""}
      ${
        hashtags.length > 0
          ? `Include these hashtags: ${hashtags.join(" ")}`
          : ""
      }
      Make it engaging and shareable.`;

        const response = await openai.chat.completions.create({
          model: "google/gemini-flash-1.5",
          messages: [
            {
              role: "system",
              content:
                "You are a viral tweet generator. Generate engaging, shareable tweets that are optimized for social media. Keep the tone consistent with the request and ensure the tweet is well-formatted with proper spacing and emoji placement.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens:
            length === "short" ? 100 : length === "medium" ? 200 : 280,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
        });

        return response.choices[0].message.content.trim();
      });

    const tweets = await Promise.all(tweetPromises);

    // Cache the result
    generationCache.set(cacheKey, {
      tweets,
      timestamp: Date.now(),
    });

    // Clean up old cache entries
    const now = Date.now();
    for (const [key, value] of generationCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        generationCache.delete(key);
      }
    }

    res.status(200).json({ tweets });
  } catch (error) {
    console.error("Error generating tweets:", error);
    res.status(500).json({ error: "Failed to generate tweets" });
  }
}
