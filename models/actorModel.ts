import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
  actor_name: {
    type: "String",
  },
});

export default mongoose?.models?.actor || mongoose.model("actor", actorSchema);
