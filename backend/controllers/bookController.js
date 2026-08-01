const Book = require('../models/Book');

// @desc    Get user books (with optional tag & status filtering)
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res) => {
  try {
    const { status, tag, search } = req.query;

    // Filter by logged-in user
    let query = { user: req.user.id };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by tag if provided
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search by title or author
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    // Calculate collection statistics
    const allBooks = await Book.find({ user: req.user.id });
    const stats = {
      total: allBooks.length,
      wantToRead: allBooks.filter((b) => b.status === 'Want to Read').length,
      reading: allBooks.filter((b) => b.status === 'Reading').length,
      completed: allBooks.filter((b) => b.status === 'Completed').length,
    };

    res.status(200).json({
      stats,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single book details
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Make sure book belongs to logged in user
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to view this book' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    const { title, author, tags, status, rating, notes } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and author are required' });
    }

    const book = await Book.create({
      user: req.user.id,
      title,
      author,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
      status: status || 'Want to Read',
      rating,
      notes,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update book details
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Make sure book belongs to logged in user
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this book' });
    }

    const { title, author, tags, status, rating, notes } = req.body;

    book.title = title !== undefined ? title : book.title;
    book.author = author !== undefined ? author : book.author;
    if (tags !== undefined) {
      book.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    }
    book.status = status !== undefined ? status : book.status;
    book.rating = rating !== undefined ? rating : book.rating;
    book.notes = notes !== undefined ? notes : book.notes;

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Make sure book belongs to logged in user
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this book' });
    }

    await book.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
