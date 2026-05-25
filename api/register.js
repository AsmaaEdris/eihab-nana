// api/register.js

import { kv } from '@vercel/kv';

export default async function handler(req, res) {

    if (req.method !== 'POST') {

        return res.status(405).json({
            error: 'Method not allowed'
        });

    }

    try {

      const {
    name,
    status,
    guestsCount,
    message
} = req.body;

       const newGuest = {

    name,
    status,

    guestsCount,

    message,

    date:
        new Date().toISOString()

};

        const guests =
            await kv.get(
                'wedding_guests'
            ) || [];

        guests.push(newGuest);

        await kv.set(
            'wedding_guests',
            guests
        );

        return res.status(200).json({
            success: true
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }
}