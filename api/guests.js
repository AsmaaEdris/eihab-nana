// api/guests.js

import { kv } from '@vercel/kv';

export default async function handler(req, res) {

    try {

        const guests =
            await kv.get(
                'wedding_guests'
            ) || [];

      const guestsWithIds = guests
.reverse()
.map((guest, index) => ({
    ...guest,
    id: guests.length - 1 - index
}));

        return res.status(200).json(
            guestsWithIds
        );

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }
}