import app from "./app.js";
import connectToDB from "./db/db.js";

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  console.log(`Server running on port ${port}... `);
  await connectToDB();
});
