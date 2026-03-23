export default async function handler(req, res) {
    // Only allow POST requests from our frontend
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Securely grab the key from Vercel's Environment Variables
    const API_KEY = process.env.GEMINI_API_KEY;

    // Fail gracefully if the key isn't set up in Vercel yet
    if (!API_KEY) {
        return res.status(500).json({ 
            error: { message: "Server Configuration Error: API key is missing in Vercel Environment Variables." } 
        });
    }

    try {
        // Forward the exact payload to Google's API secretly
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        
        // Pass any Google errors back to the frontend
        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch from Gemini API');
        }

        // Send the successful response back to the frontend
        return res.status(200).json(data);
        
    } catch (error) {
        return res.status(500).json({ error: { message: error.message } });
    }
}

