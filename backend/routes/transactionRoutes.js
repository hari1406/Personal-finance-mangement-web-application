const express = require("express");
const {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const timeRestriction = require("../middleware/timeRestriction");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // every route below requires a valid login token

router.post("/", addTransaction);
router.get("/", getTransactions);
router.put("/:id", timeRestriction, updateTransaction); // blocked after 12 hours
router.delete("/:id", deleteTransaction);

module.exports = router;
