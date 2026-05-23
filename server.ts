import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client safely (lazy initialization is recommended)
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Food Suggestion proxy endpoint
  app.post("/api/ai/suggest", async (req, res) => {
    try {
      const { prompt, cart, currentSelection } = req.body;
      const client = getGeminiClient();

      const systemInstruction = `You are the Chef Recommendation Assistant for "Handi Restaurant", an authentic Indian heritage clay pot restaurant.
Your task is to help users select dishes, customize taste preferences (spice level, gluten sensitivity), suggest perfect accompaniments (like Burrani Raita, Mirchi Ka Salan, or freshly tandoor breads), and suggest additions to their active order.

Keep your tone warm, deeply hospitable, appetizing, and polite.
Provide concise, highly clean and formatted answers utilizing bullet points and rich bold tags. Recommend real items from our menu:
- Authentic Handi Biryani (Veg, ₹450)
- Murgh Handi Lazeez (Non-Veg, ₹340 - rich aromatic slow-cooked chicken)
- Paneer Handi Khas (Veg, ₹280 - soft paneer cubes in creamy tomato-onion)
- Chicken Tikka Masala (Non-Veg, ₹450)
- Handi Paneer Tikka (Veg, ₹380)
- Mutton Rogan Josh (Non-Veg, Quarter ₹350 / Half ₹650 / Full ₹1200)
- Veg Manchow Soup (Veg, ₹150)
- Chicken Sweet Corn (Non-Veg, ₹180)
- Chilli Chicken (Dry) (Non-Veg, ₹320)
- Hara Bhara Kebab (Veg, ₹260)
- Butter Chicken (Non-Veg, Half ₹380 / Full ₹720)
- Kadhai Paneer (Veg, Half ₹280 / Full ₹520)
- Butter Naan (Veg, ₹60)
- Garlic Naan (Veg, ₹80)

If they have items in their cart, suggest matching combos (e.g. recommend Garlic Naan or Butter Naan with Butter Chicken/Paneer, or Burrani Raita and Mirchi Ka Salan with Handi Biryani).
Keep answers highly helpful & specific. Do not use generic explanations. Max 140 words.`;

      const userMessage = `User request: "${prompt}"
Active Cart items: ${JSON.stringify(cart || [])}
Current selection they are viewing: ${currentSelection ? JSON.stringify(currentSelection) : "None"}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini suggestion error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate suggestions." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
