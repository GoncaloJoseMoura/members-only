const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const debug = require("debug")("book");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const allMessages = await Message.find({})
    .sort({ date: -1 })
    .exec();

  res.render("index", {messages: allMessages});
});

// Display book create form on GET.
exports.message_create_get = asyncHandler(async (req, res, next) => {

  res.render("message_form", {
    title: "Create Message",
    errors: undefined
  });
});

// Handle book create on POST.
exports.message_create_post = [

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("message", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      user: req.user.id
    });

    if (!errors.isEmpty()) {

      res.render("message_form", {
        title: "Create Message",
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await message.save();
      res.redirect('/');
    }
  }),
];

// Handle book delete on POST.
exports.message_delete_get = asyncHandler(async (req, res, next) => {
    // Get details of author and all their books (in parallel)
      await Message.findByIdAndDelete(req.params.id);
      res.redirect('/');
});

// // Display book update form on GET.
// exports.book_update_get = asyncHandler(async (req, res, next) => {
//   // Get book, authors and genres for form.
//   const [book, allAuthors, allGenres] = await Promise.all([
//     Book.findById(req.params.id).populate("author").exec(),
//     Author.find().sort({ family_name: 1 }).exec(),
//     Genre.find().sort({ name: 1 }).exec(),
//   ]);

//   if (book === null) {
//     // No results.
//     debug(`id not found on update: ${req.params.id}`);
//     const err = new Error("Book not found");
//     err.status = 404;
//     return next(err);
//   }

//   // Mark our selected genres as checked.
//   allGenres.forEach((genre) => {
//     if (book.genre.includes(genre._id)) genre.checked = "true";
//   });

//   res.render("book_form", {
//     title: "Update Book",
//     authors: allAuthors,
//     genres: allGenres,
//     book: book,
//     errors: undefined,
//   });
// });

// // Handle book update on POST.
// exports.book_update_post = [
//   // Convert the genre to an array.
//   (req, res, next) => {
//     if (!Array.isArray(req.body.genre)) {
//       req.body.genre =
//         typeof req.body.genre === "undefined" ? [] : [req.body.genre];
//     }
//     next();
//   },

//   // Validate and sanitize fields.
//   body("title", "Title must not be empty.")
//     .trim()
//     .isLength({ min: 1 })
//     .escape(),
//   body("author", "Author must not be empty.")
//     .trim()
//     .isLength({ min: 1 })
//     .escape(),
//   body("summary", "Summary must not be empty.")
//     .trim()
//     .isLength({ min: 1 })
//     .escape(),
//   body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
//   body("genre.*").escape(),

//   // Process request after validation and sanitization.
//   asyncHandler(async (req, res, next) => {
//     // Extract the validation errors from a request.
//     const errors = validationResult(req);

//     // Create a Book object with escaped/trimmed data and old id.
//     const book = new Book({
//       title: req.body.title,
//       author: req.body.author,
//       summary: req.body.summary,
//       isbn: req.body.isbn,
//       genre: typeof req.body.genre === "undefined" ? [] : req.body.genre,
//       _id: req.params.id, // This is required, or a new ID will be assigned!
//     });

//     if (!errors.isEmpty()) {
//       // There are errors. Render form again with sanitized values/error messages.

//       // Get all authors and genres for form
//       const [allAuthors, allGenres] = await Promise.all([
//         Author.find().sort({ family_name: 1 }).exec(),
//         Genre.find().sort({ name: 1 }).exec(),
//       ]);

//       // Mark our selected genres as checked.
//       for (const genre of allGenres) {
//         if (book.genre.indexOf(genre._id) > -1) {
//           genre.checked = "true";
//         }
//       }
//       res.render("book_form", {
//         title: "Update Book",
//         authors: allAuthors,
//         genres: allGenres,
//         book: book,
//         errors: errors.array(),
//       });
//       return;
//     } else {
//       // Data from form is valid. Update the record.
//       const updatedBook = await Book.findByIdAndUpdate(req.params.id, book, {});
//       // Redirect to book detail page.
//       res.redirect(updatedBook.url);
//     }
//   }),
// ];
