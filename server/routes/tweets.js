import express from "express";
import { verifyToken } from "../verifyToken.js";
import {
  createTweet,
  deleteTweet,
  likeOrDislike,
  getAllTweets,
  getUserTweets,
  getExploreTweets,
  searchTweetsUsersHashtags,
  search,
} from "../controllers/tweet.js";

const router = express.Router();

// Create a Tweet
router.post("/", verifyToken, createTweet);

// Delete a Tweet
router.delete("/:id", verifyToken, deleteTweet);

// Like or Dislike a Tweet
router.put("/:id/like", likeOrDislike);

// Get all timeline tweets
router.get("/timeline/:id", getAllTweets);

// Get user Tweets only
router.get("/user/all/:id", getUserTweets);

// Explore
router.get("/explore", getExploreTweets);

// Search tweets, users, and hashtags based on a word
router.get("/search/:word", verifyToken, search);

export default router;
