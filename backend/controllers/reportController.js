const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

exports.categorySummary = async (req, res) => {
  const summary = await Transaction.aggregate([
    { $match: { type: "expense", user: new mongoose.Types.ObjectId(req.user.id) } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
  ]);

  res.json(summary);
};

// Income vs expense totals for an arbitrary date range (used by the period dropdown)
exports.timeBasedReport = async (req, res) => {
  const { start, end } = req.query;

  const data = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user.id),
        type: { $in: ["income", "expense"] },
        date: { $gte: new Date(start), $lte: new Date(end) },
      },
    },
    { $group: { _id: "$type", total: { $sum: "$amount" } } },
  ]);

  res.json(data);
};
