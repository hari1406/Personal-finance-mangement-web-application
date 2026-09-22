const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // The date & time the user entered for this transaction (can differ from createdAt)
    date: {
      type: Date,
      default: Date.now,
    },
    category: String,
    division: {
      type: String,
      enum: ["office", "personal"],
    },
    description: String,
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
