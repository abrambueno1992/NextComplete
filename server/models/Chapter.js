import mongoose from 'mongoose';

import Book from './Book';

const { Schema } = mongoose;

const mongoSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isFree: {
    type: Boolean,
    required: true,
    default: false,
  },
  githubFilePath: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
    required: true,
  },
  htmlContent: {
    type: String,
    default: '',
    required: true,
  },
  excerpt: {
    type: String,
    default: '',
  },
  htmlExcerpt: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  seoTitle: String,
  seoDescription: String,
  sections: [
    {
      text: String,
      level: Number,
      escapedText: String,
    },
  ],
});

class ChapterClass {
  static async getBySlug({ bookSlug, chapterSlug, user }) {
    const book = await Book.getBySlug({ slug: bookSlug, user });
    if (!book) {
      throw new Error('Not found');
    }

    const chapter = await this.findOne({ bookId: book._id, slug: chapterSlug });

    if (!chapter) {
      throw new Error('Not found');
    }

    const chapterObj = chapter.toObject();
    chapterObj.book = book;

    return chapterObj;
  }
}

mongoSchema.loadClass(ChapterClass);

const Chapter = mongoose.model('Chapter', mongoSchema);

export default Chapter;
