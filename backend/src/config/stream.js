import { StreamChat } from "stream-chat";
const streamKey = process.env.STREAM_API_KEY;
const streamSecret = process.env.STREAM_SECRET_KEY;

if (!streamKey || !streamSecret) {
  console.log("stream api key or secret are missing");
}

const streamClient = StreamChat.getInstance(streamKey, streamSecret, {
  disableCache: true,
});

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    throw new Error(error);
  }
};
