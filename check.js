const fs = require("fs");

// Read JSON
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

// Check condition
if (!data.should_pass) {
  console.error("Condition failed based on JSON — failing HyperExecute job.");
  process.exit(1); // ❌ fail job
}

console.log("Condition passed. Job will continue.");
process.exit(0);
