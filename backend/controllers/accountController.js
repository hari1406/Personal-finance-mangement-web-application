const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

exports.createAccount = async (req, res) => {
  const account = await Account.create({ ...req.body, user: req.user.id });
  res.status(201).json(account);
};

exports.getAccounts = async (req, res) => {
  const accounts = await Account.find({ user: req.user.id });
  res.json(accounts);
};

// Rename an account and/or directly correct its balance
exports.updateAccount = async (req, res) => {
  const account = await Account.findOne({ _id: req.params.id, user: req.user.id });
  if (!account) return res.status(404).json({ message: "Account not found" });

  if (req.body.name !== undefined) account.name = req.body.name;
  if (req.body.balance !== undefined) account.balance = Number(req.body.balance);

  await account.save();
  res.json(account);
};

exports.transferAmount = async (req, res) => {
  const { fromAccount, toAccount, amount, description } = req.body;

  if (fromAccount === toAccount) {
    return res.status(400).json({ message: "Choose two different accounts" });
  }
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Enter a valid amount" });
  }

  const from = await Account.findOne({ _id: fromAccount, user: req.user.id });
  const to = await Account.findOne({ _id: toAccount, user: req.user.id });

  if (!from || !to) {
    return res.status(404).json({ message: "Account not found" });
  }
  if (from.balance < amount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  from.balance -= amount;
  to.balance += amount;

  await from.save();
  await to.save();

  const transfer = await Transaction.create({
    type: "transfer",
    amount,
    description: description || `Transfer: ${from.name} -> ${to.name}`,
    fromAccount,
    toAccount,
    user: req.user.id,
  });

  res.json({ message: "Transfer successful", transfer, accounts: [from, to] });
};
