import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const INVITES = [
  "https://h5.smartwallet-pay.com?invite=V2JNGPTA",
  "https://h5.smartwallet-pay.com?invite=OGAS2GUW",
  "https://h5.smartwallet-pay.com?invite=WRNNKJTT"
];

const STATE_FILE = "./state.json";

if (!fs.existsSync(STATE_FILE)) {
  fs.writeFileSync(STATE_FILE, JSON.stringify({ index: 0 }));
}

function readState() {
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
}

function writeState(data) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(data));
}

app.post("/get-invite", (req, res) => {
  const state = readState();
  const invite = INVITES[state.index];
  state.index = (state.index + 1) % INVITES.length;
  writeState(state);
  res.json({ invite });
});

app.get("/", (req, res) => res.send("Server running"));

app.listen(3000, () => console.log("Running"));
