import userModel from "../models/auth.models.js";

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
