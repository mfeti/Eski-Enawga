import userModel from "../models/auth.models.js";
import friendRequestModel from "../models/friendRequest.model.js";

export const getRecommendedUsers = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const currentUser = req.user;

    // get all users except the current user and the users friends
    const recommendedUsers = await userModel
      .find({
        $and: [
          { _id: { $ne: userId } },
          { _id: { $nin: currentUser.friends } },
          { isOnboarding: true },
        ],
      })
      .select(
        "fullName profilePicture learningLanguage nativeLanguage location bio"
      );

    res.status(200).json({
      success: true,
      recommendedUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyFriendUsers = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // get all my friends
    const user = await userModel
      .findById(userId)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePicture learningLanguage nativeLanguage location"
      );
    res.status(200).json({
      success: true,
      friends: user.friends,
    });
  } catch (error) {
    next(error);
  }
};

export const sendFriendRequest = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id: recipientId } = req.params;
    if (userId === recipientId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }
    // check if the recipient exists
    const recipient = await userModel.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient User not found",
      });
    }
    // check if the recipient is already a friend
    const { friends } = await userModel.findById(userId).select("friends");
    if (friends.includes(recipientId)) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user",
      });
    }
    // check if the friend request is already sent
    const existingRequest = await friendRequestModel.findOne({
      $or: [
        { sender: userId, recipient: recipientId },
        { recipient: userId, sender: recipientId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You have already sent a friend request to this user",
      });
    }

    const friendRequest = await friendRequestModel.create({
      sender: userId,
      recipient: recipientId,
    });
    res.status(201).json({
      success: true,
      message: "Friend request sent successfully",
      friendRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptFriendRequest = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id: requestId } = req.params;

    // check if the friend request exists
    const friendRequest = await friendRequestModel.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }
    // check if the friend request is for the current user
    if (friendRequest.recipient.toString() !== userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot accept this friend request",
      });
    }
    // check if the friend request is already accepted
    if (friendRequest.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "Friend request already accepted",
      });
    }
    // update the friend request status to accepted
    friendRequest.status = "accepted";
    await friendRequest.save();

    // add the sender to the recipient's friends list
    const recipient = await userModel.findById(userId);
    recipient.friends.push(friendRequest.sender);
    await recipient.save();

    // add the recipient to the sender's friends list
    const sender = await userModel.findById(friendRequest.sender);
    sender.friends.push(userId);
    await sender.save();

    res.status(200).json({
      success: true,
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getFriendRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // get all friend requests for the current user
    const incomingFriendRequests = await friendRequestModel
      .find({ recipient: userId, status: "pending" })
      .populate(
        "sender",
        "fullName profilePicture learningLanguage nativeLanguage"
      );

    // get accepted friend requests which is sent by me
    const acceptedFriendRequests = await friendRequestModel
      .find({ sender: userId, status: "accepted" })
      .populate("recipient", "fullName profilePicture");

    res.status(200).json({
      success: true,
      incomingFriendRequests,
      acceptedFriendRequests,
    });
  } catch (error) {
    next(error);
  }
};

export const getSentFriendRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // get all sent friend requests for the current user
    const sentFriendRequests = await friendRequestModel
      .find({ sender: userId, status: "pending" })
      .populate(
        "recipient",
        "fullName profilePicture learningLanguage nativeLanguage"
      );

    res.status(200).json({
      success: true,
      sentFriendRequests,
    });
  } catch (error) {
    next(error);
  }
};
