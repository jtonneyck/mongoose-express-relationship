var express = require('express');
var router = express.Router();
var Author = require("../models/Author")
var Book = require("../models/Book")
var mongoose = require("mongoose")

router.get('/', function(req, res, next) {
    Book.find({})
        .populate("author")
        .then((books)=> {
            debugger
            res.render('books', { books: books});
        })
        .catch((error)=> {
            next()
        })
});

router.get("/create", (req,res)=> {
    Author.find({})
        .then((authors)=> {
            res.render("create-book", {authors});
        })
        .catch((err)=> {
            next();
        })
})

router.post("/create", (req,res)=> {
    
    let newBook = {
        title: req.body.title,
        description: req.body.description,
        rating: req.body.rating,
        author: mongoose.Types.ObjectId(req.body.author),
        image_url: req.body.image_url
    };

    Book.create(newBook)
        .then((book)=> {
            res.redirect(`/books/detail/${book._id}`)
        })
})

router.get('/detail/:id', function(req, res, next) {
    debugger
    Book.findById(req.params.id)
        .populate("author")
        .then((book)=> {
            debugger
            res.render('detail-book', {book});
        })
        .catch((error)=> {
            next()
        })
});

router.get('/edit/:id', function(req, res, next) {
    Book.findById(req.params.id)
        .populate("author")
        .then((book)=> {
            Author.find({})
                .then((allAuthors)=> {
                    res.render('edit-book', {book, allAuthors});
                })
        })
        .catch((error)=> {
            next()
        })
});

router.post('/edit/:id', function(req, res, next) {
    debugger
    let updateBook = {
        title: req.body.title,
        description: req.body.description,
        author: mongoose.Types.ObjectId(req.body.author)
    }
    Book.findByIdAndUpdate(req.params.id, updateBook)
        .then((book)=> {
            res.redirect(`/books/detail/${req.params.id}`)
        })
        .catch((error)=> {
            next()
        })
});

module.exports = router;
