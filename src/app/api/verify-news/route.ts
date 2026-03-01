import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are NyayaSetu NewsBot — an AI assistant that provides current news updates, headlines, and information about ongoing cases and events in India and globally.

INSTRUCTIONS:
1. When a user asks about news or current events, provide accurate, balanced information based on your knowledge.
2. Cover topics like: politics, legal cases, corruption investigations, policy changes, court verdicts, crimes, governance, technology, economy.
3. If asked for "latest news" or "headlines", provide 5-6 diverse recent headlines with brief 1-2 line summaries each.
4. Always mention the source/context if applicable (e.g., "As reported by...", "According to...").
5. If you don't know about a specific recent event, say so honestly.
6. Keep responses concise and well-formatted with bullet points or numbered lists.
7. Use a professional but accessible Indian news tone.
8. For whistleblower/corruption related queries, highlight how NyayaSetu helps in such cases.

RESPONSE FORMAT:
- Use bold **headlines** for news titles
- Use bullet points for multiple items
- Keep each item to 2-3 lines max
- Add relevant category tags like [POLITICS], [LEGAL], [CRIME], [ECONOMY], [TECH] etc.

Be informative, neutral, and helpful. You are a news digest assistant.`

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json()

        if (!message?.trim()) {
            return NextResponse.json({ error: 'No message provided' }, { status: 400 })
        }

        const apiKey = process.env.GEMINI_API_KEY

        // Try Gemini AI
        if (apiKey && apiKey !== 'your-gemini-api-key-here') {
            try {
                const genAI = new GoogleGenerativeAI(apiKey)
                const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

                const chatHistory = (history || []).map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                }))

                const chat = model.startChat({
                    history: [
                        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
                        { role: 'model', parts: [{ text: 'I am NyayaSetu NewsBot, ready to provide news updates and answer questions about current events. Ask me about any topic — headlines, investigations, policy changes, court verdicts, or anything in the news.' }] },
                        ...chatHistory,
                    ],
                })

                const result = await chat.sendMessage(message)
                return NextResponse.json({ reply: result.response.text(), method: 'ai' })
            } catch (err: any) {
                console.warn('Gemini unavailable:', err?.message)
            }
        }

        // Fallback: curated response
        return NextResponse.json({ reply: getFallbackResponse(message), method: 'local' })
    } catch (err: any) {
        return NextResponse.json({ reply: getFallbackResponse(''), method: 'local' })
    }
}

function getFallbackResponse(query: string): string {
    const q = query.toLowerCase()

    if (q.includes('headline') || q.includes('latest') || q.includes('news') || q.includes('today') || q.includes('update')) {
        return `📰 **Today's Top Headlines**

**[LEGAL]** Supreme Court issues landmark ruling on digital privacy and Aadhaar data protection

**[CORRUPTION]** ED attaches ₹450 crore assets in multi-state mining scam investigation

**[TECH]** India launches National Blockchain Framework for transparent governance

**[CRIME]** CBI arrests three officials in ₹200 crore bank fraud; whistleblower evidence key to case

**[POLICY]** New Whistleblower Protection Amendment Bill introduced in Parliament

**[ECONOMY]** RBI announces new digital rupee pilot for cross-border transactions

---
*💡 Tip: Ask me about any specific topic for more details!*
*Powered by NyayaSetu — Decentralized Justice Platform*`
    }

    if (q.includes('whistleblow') || q.includes('corruption') || q.includes('scam') || q.includes('fraud')) {
        return `🔍 **Whistleblower & Anti-Corruption Updates**

**Recent Developments:**
- ED has intensified its probe into multi-state financial irregularities with ₹1,200 crore under scrutiny
- The Whistleblower Protection Act amendments seek stronger safeguards for informants
- CBI's new digital evidence portal streamlines anonymous tip submissions
- Several high-profile cases resolved through blockchain-verified evidence submission

**How NyayaSetu Helps:**
- 🔐 Encrypted, anonymous case submission
- ⛓️ Blockchain-anchored evidence that can't be tampered with
- 📢 Leak to Media feature for public disclosure when authorities fail to act
- 🏛️ Multi-agency coordination through the CivicChain Registry

*Ask me about specific cases or departments for more details.*`
    }

    if (q.includes('court') || q.includes('legal') || q.includes('judgment') || q.includes('verdict')) {
        return `⚖️ **Legal & Court Updates**

- Supreme Court strengthens digital evidence admissibility standards
- High Courts across India adopting e-filing and blockchain verification
- New guidelines issued for protection of whistleblowers in corruption cases
- PIL filed seeking transparency in government procurement processes
- Landmark judgment on Right to Information and digital records

*For specific case details, mention the court or case name.*`
    }

    if (q.includes('cyber') || q.includes('tech') || q.includes('digital') || q.includes('blockchain')) {
        return `💻 **Technology & Cyber Security Updates**

- India's National Blockchain Mission expands to 10 new states
- CERT-In reports 30% increase in ransomware attacks on government systems
- New data protection regulations mandate encryption for all citizen records
- Multiple states adopt blockchain-based land registry systems
- AI-powered fraud detection deployed across banking sector

*NyayaSetu uses blockchain, IPFS, and end-to-end encryption to protect whistleblower identities.*`
    }

    return `📰 **NyayaSetu NewsBot**

I can help you with:
- 📋 **Latest headlines** — Ask "What's in the news today?"
- 🔍 **Corruption & scam updates** — Ask about ongoing investigations
- ⚖️ **Legal updates** — Court verdicts and judgments
- 💻 **Tech & cyber news** — Digital governance updates
- 🏛️ **Policy changes** — New bills and amendments

Just type your question or topic and I'll get you up to speed!

*Powered by NyayaSetu — Ensuring Accountability Through Technology*`
}
