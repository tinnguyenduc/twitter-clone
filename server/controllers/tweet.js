import Tweet from "../models/Tweet.js";
import { handleError } from "../error.js";
import User from "../models/User.js";

export const createTweet = async (req, res, next) => {
  const newTweet = new Tweet(req.body);
  try {
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    handleError(500, err);
  }
};

export const deleteTweet = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet.userId === req.body.id) {
      await tweet.deleteOne();
      res.status(200).json("tweet has been deleted");
    } else {
      handleError(500, err);
    }
  } catch (err) {
    handleError(500, err);
  }
};

export const likeOrDislike = async (req, res, next) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet.likes.includes(req.body.id)) {
      await tweet.updateOne({ $push: { likes: req.body.id } });
      res.status(200).json("tweet has been liked");
    } else {
      await tweet.updateOne({ $pull: { likes: req.body.id } });
      res.status(200).json("tweet has been disliked");
    }
  } catch (err) {
    handleError(500, err);
  }
};

export const getAllTweets = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.params.id);
    const userTweets = await Tweet.find({ userId: currentUser._id });
    const followersTweets = await Promise.all(
      currentUser.following.map((followerId) => {
        return Tweet.find({ userId: followerId });
      })
    );

    res.status(200).json(userTweets.concat(...followersTweets));
  } catch (err) {
    handleError(500, err);
  }
};

export const getUserTweets = async (req, res, next) => {
  try {
    const userTweets = await Tweet.find({ userId: req.params.id }).sort({
      createAt: -1,
    });

    res.status(200).json(userTweets);
  } catch (err) {
    handleError(500, err);
  }
};

export const getExploreTweets = async (req, res, next) => {
  try {
    const exploreTweets = await Tweet.find({
      likes: { $exists: true },
    }).sort({ likes: -1 });

    res.status(200).json(exploreTweets);
  } catch (err) {
    handleError(500, err);
  }
};

export const search = async (req, res, next) => {
  try {
    const keyword = req.params.word;
    // Implement your search logic based on the keyword
    // You may need to search for tweets, users, and hashtags in your database
    // Adjust the query based on your data model and requirements
    const searchResults = await Tweet.find({
      $or: [
        { content: { $regex: keyword, $options: "i" } }, // Search in tweet content
        { username: { $regex: keyword, $options: "i" } }, // Search in username
        // Add more conditions based on your data model (e.g., hashtags)
      ],
    });

    res.status(200).json(searchResults);
  } catch (err) {
    handleError(500, err);
  }
};
