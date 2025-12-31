const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const INVITES = [
  "https://h5.smartwallet-pay.com?invite=V2JNGPTA",
  "https://h5.smartwallet-pay.com?invite=WRNNKJTT",
  "https://h5.smartwallet-pay.com?invite=OGAS2GUW"
];

const STATE_FILE = "./state.json";

/* ---------- helpers ---------- */
function readState() {
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state));
}

/* ---------- ROUTE ---------- */
app.post("/get-invite", (req, res) => {
  let state = readState();

  const invite = INVITES[state.index];

  // rotate
  state.index = (state.index + 1) % INVITES.length;
  writeState(state);

  res.json({ invite });
});

/* ---------- HEALTH CHECK ---------- */
app.get("/", (req, res) => {
  res.send("Invite Rotator Running");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
