import express from 'express';

import Book from '../models/Book';
import Chapter from '../models/Chapter';
import User from '../models/User';

const router = express.Router();

router.get('/get-chapter-detail', async (req, res) => {
  try {
    const { bookSlug, chapterSlug } = req.query;
    const chapter = await Chapter.getBySlug({
      bookSlug,
      chapterSlug,
    });
    res.json(chapter);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

export default router;
