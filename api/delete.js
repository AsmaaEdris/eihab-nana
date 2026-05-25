// api/delete.js

import { kv } from '@vercel/kv';

export default async function handler(
    req,
    res
) {

    if (req.method !== 'DELETE') {

        return res.status(405).json({
            error: 'Method not allowed'
        });

    }

    try {

        const { id } = req.query;

        let guests =
            await kv.get(
                'wedding_guests'
            ) || [];

        guests.splice(
            parseInt(id),
            1
        );

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