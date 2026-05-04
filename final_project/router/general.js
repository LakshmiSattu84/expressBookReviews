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
  


// Task 10: Get all books list from Google Books API
public_users.get('/', async (req, res) => {
  try {
    // Fetch books from external Google Books API 
    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes?q=subject:fiction"
    );

    return res.status(200).json(response.data.items);

  } catch (error) {
    // Handle errors while fetching books

    return res.status(500).json({
      message: "Error fetching books",
      error: error.message
    });
  }
});


// Task 11: Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    // Fetch book details from external Google Books API using ISBN
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );

    // Check if any book is found with the given ISBN
    if (response.data.totalItems === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(response.data.items);

  } catch (error) {
    // Handle errors while fetching book by ISBN

    return res.status(500).json({
      message: "Error fetching book by ISBN",
      error: error.message
    });
  }
});


// Task 12: Get books by author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;

    // Fetch books from external Google Books API using author name
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}`
    );

    // Check if any books are found for the given author
    if (response.data.totalItems === 0) {
      return res.status(404).json({ message: "No books found for this author" });
    }

    return res.status(200).json(response.data.items);

  } catch (error) {
    // Handle errors while fetching books by author

    return res.status(500).json({
      message: "Error fetching books by author",
      error: error.message
    });
  }
});


// Task 13: Get books by title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;

    // Fetch books from external Google Books API using book title

    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=intitle:${title}`
    );

    // Check if any books are found for the given title
    if (response.data.totalItems === 0) {
      return res.status(404).json({ message: "No books found for this title" });
    }

    return res.status(200).json(response.data.items);

  } catch (error) {
    // Handle errors while fetching books by title

    return res.status(500).json({
      message: "Error fetching books by title",
      error: error.message
    });
  }
});


//  Get book review by ISBN
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const bookReviews = books[isbn].reviews;

    return res.status(200).json({message: bookReviews});
  
});

module.exports.general = public_users;
