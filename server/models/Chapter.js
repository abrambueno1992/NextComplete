import mongoose from 'mongoose';

import generateSlug from '../utils/slugify';
import Book from './Book'

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
  githubFilePath: {
    type: String,
  },
  order: {
    type: Number,
    required: true,
  },
  seoTitle: String,
  seoDescription: String,
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
  static async syncContent({ book, data }) {
    const {
      title,
      excerpt = '',
      isFree = false,
      seoTitle = '',
      seoDescription = '',
    } = data.attributes;
  
    const { body, path } = data;
  
    const chapter = await this.findOne({
      bookId: book.id,
      githubFilePath: path,
    });
  
    let order;
  
    if (path === 'introduction.md') {
      order = 1;
    } else {
      order = parseInt(path.match(/[0-9]+/), 10) + 1;
    }
  
    if (!chapter) {
      const slug = await generateSlug(this, title, { bookId: book._id });
  
      return this.create({
        bookId: book._id,
        githubFilePath: path,
        title,
        slug,
        isFree,
        content,
        htmlContent,
        sections,
        excerpt,
        htmlExcerpt,
        order,
        seoTitle,
        seoDescription,
        createdAt: new Date(),
      });
    }
  
    const modifier = {
      content,
      htmlContent,
      sections,
      excerpt,
      htmlExcerpt
      isFree,
      order,
      seoTitle,
      seoDescription,
    };
  
    if (title !== chapter.title) {
      modifier.title = title;
      modifier.slug = await generateSlug(this, title, {
        bookId: chapter.bookId,
      });
    }
  
    return this.updateOne({ _id: chapter._id }, { $set: modifier });
  }
}

mongoSchema.index({ bookId: 1, slug: 1 }, { unique: true });
mongoSchema.index({ bookId: 1, githubFilePath: 1 }, { unique: true });

mongoSchema.loadClass(ChapterClass);

const Chapter = mongoose.model('Chapter', mongoSchema);

export default Chapter;
