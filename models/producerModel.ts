import mongoose from "mongoose";

const producerSchema = new mongoose.Schema({
  producer_name: {
    type: "String",
  },
});

export default mongoose?.models?.producer ||
  mongoose.model("producer", producerSchema);
