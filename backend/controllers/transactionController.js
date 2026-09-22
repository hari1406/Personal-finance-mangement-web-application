const Transaction = require("../models/Transaction");
const Account = require("../models/Account");

exports.addTransaction = async (req, res) => {
  const transaction = await Transaction.create({ ...req.body, user: req.user.id });

  if (transaction.type !== "transfer") {
    const account = await Account.findOne({ _id: transaction.account, user: req.user.id });
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    if (transaction.type === "income") {
      account.balance += transaction.amount;
    } else {
      account.balance -= transaction.amount;
    }
    await account.save();
  }

  res.status(201).json(transaction);
};

exports.getTransactions = async (req, res) => {
  const { from, to, category, division, type, account } = req.query;

  let filter = { user: req.user.id };
  if (from && to) {
    filter.date = { $gte: new Date(from), $lte: new Date(to) };
  } else if (from) {
    filter.date = { $gte: new Date(from) };
  } else if (to) {
    filter.date = { ...(filter.date || {}), $lte: new Date(to) };
  }
  if (category) filter.category = category;
  if (division) filter.division = division;
  if (type) filter.type = type;
  if (account) filter.account = account;

  const transactions = await Transaction.find(filter)
    .sort({ date: -1 })
    .populate("account", "name")
    .populate("fromAccount", "name")
    .populate("toAccount", "name");

  res.json(transactions);
};

exports.updateTransaction = async (req, res) => {
  // req.transaction is attached by the timeRestriction middleware,
  // which also enforces the 12-hour edit window.
  const existing = req.transaction;
  if (String(existing.user) !== req.user.id) {
    return res.status(403).json({ message: "Not authorized to edit this transaction" });
  }

  // If the amount, type or account changed, correct the account balance(s)
  if (existing.type !== "transfer") {
    const oldAccount = await Account.findOne({ _id: existing.account, user: req.user.id });
    if (oldAccount) {
      oldAccount.balance += existing.type === "income" ? -existing.amount : existing.amount; // revert
      await oldAccount.save();
    }
  }

  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (updated.type !== "transfer") {
    const newAccount = await Account.findOne({ _id: updated.account, user: req.user.id });
    if (newAccount) {
      newAccount.balance += updated.type === "income" ? updated.amount : -updated.amount; // reapply
      await newAccount.save();
    }
  }

  res.json(updated);
};

exports.deleteTransaction = async (req, res) => {
  const txn = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
  if (!txn) return res.status(404).json({ message: "Transaction not found" });

  if (txn.type !== "transfer") {
    const account = await Account.findOne({ _id: txn.account, user: req.user.id });
    if (account) {
      account.balance += txn.type === "income" ? -txn.amount : txn.amount; // revert effect
      await account.save();
    }
  }

  await txn.deleteOne();
  res.json({ message: "Transaction deleted" });
};
