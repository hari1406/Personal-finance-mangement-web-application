const Transaction = require("../models/Transaction");

const timeRestriction = async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  const diff = Date.now() - new Date(transaction.createdAt).getTime();
  const hours = diff / (1000 * 60 * 60);

  if (hours > 12) {
    return res
      .status(403)
      .json({ message: "Editing allowed only within 12 hours" });
  }

  req.transaction = transaction;
  next();
};

module.exports = timeRestriction;
