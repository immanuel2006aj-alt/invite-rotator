const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* 🔗 SINGLE INVITE LINK */
const INVITE_LINK = "https://h5.smartwallet-pay.com?invite=V2JNGPTA";

/* 📩 SEND INVITE */
app.post("/get-invite", (req, res) => {
  res.json({ invite: INVITE_LINK });
});

/* ❤️ HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("Invite service running");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
