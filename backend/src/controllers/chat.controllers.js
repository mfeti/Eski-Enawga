import { getStreamToken } from "../config/stream.js";

export const getChatToken = async (req, res, next) => {
  try {
    const token = await getStreamToken(req.user._id);
    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};
