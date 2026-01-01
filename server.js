const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* 🔗 INVITE LINKS */
const INVITES = [
  "https://h5.smartwallet-pay.com/invite=V2JNGPTA",
  "https://h5.smartwallet-pay.com/invite=0GAS2GUW",
  "https://h5.smartwallet-pay.com/invite=WRNNKJTT"
];

/* 👥 USERS PER LINK */
const LIMIT_PER_LINK = 2;

/* 📦 STATE FILE */
const STATE_FILE = "./state.json";

/* 🧠 HELPERS */
function readState() {
  if (!fs.existsSync(STATE_FILE)) {
    return { index: 0, count: 0 };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state));
}

/* 🔁 ROTATION ROUTE */
app.post("/get-invite", (req, res) => {
  let state = readState();

  const invite = INVITES[state.index];

  // increase usage count
  state.count++;

  // if limit reached → move to next link
  if (state.count >= LIMIT_PER_LINK) {
    state.count = 0;
    state.index = (state.index + 1) % INVITES.length;
  }

  writeState(state);

  res.json({ invite });
});

/* ❤️ HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("Invite Rotator Running");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
