import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  movie_name: {
    type: "String",
  },
  actors: {
    type: ["String"],
  },
  producer: {
    type: "String",
  },
});

export default mongoose?.models?.movie || mongoose.model("movie", movieSchema);
