const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ===== CONFIG ===== */
const INVITES = [
  "https://h5.smartwallet-pay.com?invite=V2JNGPTA",
  "https://h5.smartwallet-pay.com?invite=OGAS2GUW",
  "https://h5.smartwallet-pay.com?invite=WRNNKJTT"
];

const BATCH_SIZE = 10;   // users per link
const STATE_FILE = "./state.json";

/* ===== HELPERS ===== */
function readState() {
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

function writeState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state));
}

/* ===== MAIN ROUTE ===== */
app.post("/get-invite", (req, res) => {
  let state = readState();

  const total = state.total || 0;

  // 🔢 batch-based rotation
  const batchIndex = Math.floor(total / BATCH_SIZE);
  const linkIndex = batchIndex % INVITES.length;

  const invite = INVITES[linkIndex];

  // increment global count
  state.total = total + 1;
  writeState(state);

  res.json({
    invite,
    total: state.total,
    batch: batchIndex + 1,
    link: linkIndex + 1
  });
});

/* ===== STATUS (OPTIONAL) ===== */
app.get("/status", (req, res) => {
  const state = readState();
  const batchIndex = Math.floor((state.total || 0) / BATCH_SIZE);
  res.json({
    totalRegistrations: state.total || 0,
    currentBatch: batchIndex + 1,
    currentLink: (batchIndex % INVITES.length) + 1
  });
});

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.send("Invite Rotator Running");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
