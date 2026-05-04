const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        
       return res.status(200).json({ message: "User successfully logged in", token: accessToken });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;
    const review = req.query.review;

    // Validate auth
    if (!username) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    // Validate input
    if (!review) {
      return res.status(400).json({
        message: "Review content is required"
      });
    }

    // Validate book existence
    if (!books[isbn]) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    // Initialize reviews object if missing
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    const isUpdate = !!books[isbn].reviews[username];

    // Add or update review
    books[isbn].reviews[username] = review;

    return res.status(200).json({
      message: isUpdate
        ? `The user ${username} updated Review successfully!`
        : `The user ${username} added Review successfully!`,
      isbn,
      username,
      review,
      reviews: books[isbn].reviews
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `The user ${username} review was deleted successfully!`
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
