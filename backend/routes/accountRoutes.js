const express = require("express");
const {
  createAccount,
  getAccounts,
  updateAccount,
  transferAmount,
} = require("../controllers/accountController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // every route below requires a valid login token

router.post("/", createAccount);
router.get("/", getAccounts);
router.put("/:id", updateAccount);
router.post("/transfer", transferAmount);

module.exports = router;
