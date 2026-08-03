import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Local Area Insights powered by Google Search Grounding & Gemini
  app.post("/api/local-insights", async (req, res) => {
    try {
      const { address, title, city, state } = req.body;

      if (!address && !title) {
        return res.status(400).json({ 
          error: "Property address or location is required" 
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY environment variable is not configured." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const fullLocation = `${address || title}, ${city || ''} ${state || ''}`.trim();

      const prompt = `Perform a Google Search to analyze the neighborhood and local area for this real estate property:
Location: "${fullLocation}"

Provide a structured, accurate "Local Area Insights" report covering:
1. **Nearby Top Schools & Ratings**: High schools, middle schools, elementary schools in the district.
2. **Walkability & Commute**: Estimated Walk Score / pedestrian rating, access to sidewalks, parks, or trails.
3. **Transit & Highway Proximity**: Nearby train/bus lines, major highways, airport access, and typical drive times to downtown.
4. **Neighborhood Amenities**: Notable nearby shopping centers, grocery stores, cafes, and restaurants.

Format the output clearly with markdown headers, bullet points, and high readability. Keep the tone professional, objective, and informative for home buyers.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const insightText = response.text || "No insights could be generated for this location at this time.";

      // Extract Grounding Chunks (URLs and titles)
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter((chunk: any) => chunk.web?.uri)
        .map((chunk: any) => ({
          title: chunk.web.title || "Web Source",
          uri: chunk.web.uri,
        }));

      return res.json({
        success: true,
        location: fullLocation,
        insightText,
        sources,
      });
    } catch (error: any) {
      console.error("Error fetching local area insights:", error);
      return res.status(500).json({
        error: "Failed to fetch local area insights.",
        details: error?.message || String(error),
      });
    }
  });

  // API Route: Property AI Assistant Chatbot
  app.post("/api/property-chat", async (req, res) => {
    try {
      const { property, message, chatHistory } = req.body;

      if (!property || !message) {
        return res.status(400).json({ 
          error: "Property context and user message are required" 
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY environment variable is not configured." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are an expert, helpful AI Real Estate Assistant specialized in answering user questions about this specific property listing.

Property Details Context:
- Title: ${property.title}
- Price: $${property.price ? property.price.toLocaleString() : 'N/A'}
- Type: ${property.propertyType} (${property.listingType === 'rent' ? 'For Rent' : 'For Sale'})
- Address: ${property.address}, ${property.city}, ${property.state} ${property.zipCode}
- Bedrooms: ${property.bedrooms} | Bathrooms: ${property.bathrooms} | SqFt: ${property.sqft ? property.sqft.toLocaleString() : 'N/A'}
- Price/SqFt: $${property.sqft && property.price ? Math.round(property.price / property.sqft) : 'N/A'}
- Year Built: ${property.yearBuilt || 'N/A'}
- Description: ${property.description}
- Amenities: ${property.amenities ? property.amenities.join(', ') : 'Standard'}
- HOA Fees: $${property.hoaFee ? property.hoaFee + '/mo' : 'None / Not specified'}
- Agent: ${property.agent ? property.agent.name : 'Listing Agent'} (${property.agent?.phone || ''})

Answer user questions accurately, politely, and concisely based on these property details. Offer helpful context on pricing, features, layout, and amenities. Keep responses formatted with clean markdown bullets or paragraphs.`;

      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        for (const msg of chatHistory) {
          contents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      const replyText = response.text || "I'm sorry, I couldn't generate an answer at this moment.";

      return res.json({
        success: true,
        reply: replyText,
      });
    } catch (error: any) {
      console.error("Error in property AI chatbot:", error);
      return res.status(500).json({
        error: "Failed to generate AI response.",
        details: error?.message || String(error),
      });
    }
  });

  // Vite middleware for development vs static serve for production
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
