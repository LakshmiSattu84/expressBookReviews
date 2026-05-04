const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});

});
  

// Get the book list available in the shop
// Task 10
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve) => {
      resolve(books);
    });

    const result = await getBooks;
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
// Task 11
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const getBookByISBN = new Promise((resolve, reject) => {
      const book = books[isbn];

      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });

    const result = await getBookByISBN;
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});
  
// Get book details based on author
// Task 12
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;

    const getBooksByAuthor = new Promise((resolve) => {
      const result = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
      );

      resolve(result);
    });

    const result = await getBooksByAuthor;
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get all books based on title
// Task 13
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    const getBooksByTitle = new Promise((resolve) => {
      const result = Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
      );

      resolve(result);
    });

    const result = await getBooksByTitle;
    res.send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const bookReviews = books[isbn].reviews;

    return res.status(200).json({message: bookReviews});
  
});

module.exports.general = public_users;
