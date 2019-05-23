const express = require("express");
const db = require("./data/accounts-model.js");
const server = express();

server.use(express.json());

function logger(req, res, next) {
  const { path } = req;
  const timeStamp = Date.now();
  const log = { path, timeStamp };
  console.log(`${req.method} Request`, log);
  next();
}

server.use(logger);
// your code here

server.get("/accounts", async (req, res) => {
  try {
    const getAccount = await db.find();
    if (getAccount) {
      res.status(200).json(getAccount);
    } else {
      res.status(400).json({ message: "no accounts found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong with this request" });
  }
});

server.get("/accounts/:id", validateAccountId, async (req, res) => {
  try {
    const { id } = await db.findById(req.params.id);
    if (id) {
      res.status(200).json(req.user);
    } else {
      res
        .status(400)
        .json({ message: "account with this ID could not be located." });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "couldnt retrieve user with that specifired ID" });
  }
});

server.post("/accounts", async (req, res) => {
  try {
    const addAccount = await db.add(req.body);
    if (addAccount) {
      res.status(201).json(addAccount);
    } else {
      res.status(400).json({ message: "could not add this account" });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong with this request" });
  }
});

server.delete("/accounts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const count = await db.remove(req.params.id);
    if (count > 0) {
      res
        .status(200)
        .json({ message: "The account has been nuked. Flawless Victory." });
    } else {
      res.status(404).json({ message: "The account couldnt be found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error nuking this account" });
  }
});

server.put("/accounts/:id", validateAccountId, async (req, res) => {
  try {
    const updatedAccount = await db.update(req.params.id, req.body);
    if (updatedAccount) {
      res.status(200).json(updatedAccount);
    } else {
      res.status(404).json({ message: "error updating account" });
    }
  } catch (err) {
    res.status(500).json({ message: "could not update account" });
  }
});

async function validateAccountId(req, res, next) {
  try {
    const { id } = req.params;
    const accountId = await db.findById(id);
    if (accountId) {
      req.user = accountId;
      next();
    } else {
      res.status(404).json({ message: "invalid account id" });
      next();
    }
  } catch (err) {
    res.status(500).json({ message: "error validating account" });
  }
}

module.exports = server;
