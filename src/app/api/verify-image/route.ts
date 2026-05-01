import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No image file provided" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("GEMINI_API_KEY is not configured.");
            return NextResponse.json({ error: "Gemini API key is not configured on the server." }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey: apiKey });

        const bytes = await file.arrayBuffer();
        const base64Image = Buffer.from(bytes).toString("base64");

        const prompt = `
        You are a digital forensics expert working for an anti-corruption and civic complaints platforms.
        Your job is to analyze this submitted evidence image and determine if it appears to be AI-generated (e.g., Midjourney, DALL-E, Stable Diffusion) or heavily manipulated using generative AI tools.
        Look for common AI artifacts such as:
        - Asymmetrical or illogical geometry
        - Blurry or illegible background text
        - Warped straight lines
        - Inconsistent lighting and shadows
        - Anatomical errors (e.g., weird hands, limbs)
        
        Respond with ONLY a strict JSON object (do not use markdown formatting tags). The JSON must have the following structure:
        {
            "isAI": boolean,
            "confidence": number (0 to 100),
            "reasoning": "A brief explanation of why you think it is or isn't AI generated"
        }
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                prompt,
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: file.type || "image/jpeg",
                    },
                },
            ],
            config: {
                responseMimeType: "application/json",
            }
        });

        const rawText = response.text || "{}";
        
        try {
            const result = JSON.parse(rawText);
            return NextResponse.json(result);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", rawText);
            return NextResponse.json({ error: "Invalid response format from AI" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Gemini Verification Error:", error);
        return NextResponse.json({ error: "Failed to verify image with AI", details: error.message }, { status: 500 });
    }
}
