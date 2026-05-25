const express = require('express');
const path = require('path');
const { kv } = require('@vercel/kv');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

// 1. تسجيل ضيف جديد
app.post('/api/register', async (req, res) => {
  try {
    const { name, status, guestsCount, message } = req.body;
    const newGuest = { name, status, guestsCount, message, date: new Date().toISOString() };
    
    const guests = (await kv.get('wedding_guests')) || [];
    guests.push(newGuest);
    await kv.set('wedding_guests', guests);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. جلب البيانات للداشبورد (مع إضافة index لكل ضيف ليستخدمه زر الحذف)
app.get('/api/guests', async (req, res) => {
  try {
    const guests = (await kv.get('wedding_guests')) || [];
    // إضافة id لكل ضيف يساوي ترتيبه في القائمة
    const guestsWithIds = guests.map((guest, index) => ({ ...guest, id: index }));
    res.status(200).json(guestsWithIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. حذف ضيف (جديدة)
app.delete('/api/delete', async (req, res) => {
  try {
    const { id } = req.query; 
    let guests = (await kv.get('wedding_guests')) || [];
    
    // تأكدي أننا نحذف العنصر الصحيح باستخدام الـ index
    guests.splice(parseInt(id), 1);
    
    await kv.set('wedding_guests', guests);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;