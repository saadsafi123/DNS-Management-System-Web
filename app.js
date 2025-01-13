// Requiring npm modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/dnsDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Schema and Model Definitions
const recordSchema = new mongoose.Schema({
  dns: String,
  ip: String,
  class: String
});

const Record = mongoose.model("Record", recordSchema);

/**********************************HOME ROUTE*************************** */

app.get("/", (req, res) => {
  res.render("home");
});


/**********************************ADD ROUTE******************************/

app.get("/add", (req, res) => {
  res.render("add",{ error: null, success: null });
});


app.post("/add", async (req, res) => {
  const { dns, ip } = req.body;

  // Check if the IP address is valid
  if (!isValidIp(ip)) {
    const error = "Please enter a valid IP address.";
    console.log(error);
    return res.render("add", { error ,success:null});
  }

  // calculate class based on IP
  const ipClass = getIpClass(ip);

  try {
    // Check if the IP or DNS already exists
    const existingRecordByIp = await Record.findOne({ ip });
    const existingRecordByDns = await Record.findOne({ dns });

    if (existingRecordByIp) {
      const error = `Unable to assign IP address (${ip}) to DNS (${dns}) as it is already assigned to DNS (${existingRecordByIp.dns}).`;
      console.log(error);
      return res.render("add", { error ,success:null});
    }

    if (existingRecordByDns) {
      const error = `Unable to assign DNS (${dns}) to IP address (${ip}) as it is already assigned to IP (${existingRecordByDns.ip}).`;
      console.log(error);
      return res.render("add", { error ,success:null});
    }

    // If no conflicts, add the new record
    const newRecord = new Record({
      dns,
      ip,
      class: ipClass, 
    });

    await newRecord.save();
    console.log("New record added:", dns, ip, ipClass);
    const success = "Record added successfully!";
    return res.render("add", { error:null, success });
  } catch (err) {
    console.error("Error adding record:", err);
    const error = "An unexpected error occurred. Please try again.";
    return res.render("add", { error ,success:null});
  }
});


/**********************************SEARCH ROUTE******************************/

app.get("/search", (req, res) => {
  res.render("search");
});

app.post("/search", async (req, res) => {
  const { dns, ip } = req.body;
  console.log(req.body);
  try {
    let record;
    if (dns) {
      record = await Record.findOne({ dns });
    } else if (ip) {
      record = await Record.findOne({ ip });
      console.log(record);
    }

    if (record) {
      res.render("result", { record });
    } else {
      res.send("No record found");
    }
  } catch (err) {
    console.error("Error searching for record:", err);
    res.redirect("/search");
  }
});

/********************************** VIEW-ALL ROUTE ******************************/

app.get("/view-all", async (req, res) => {
  try {
    const records = await Record.find();
    res.render("viewAll", { records });
  } catch (err) {
    console.error("Error viewing all records:", err);
    res.redirect("/");
  }
});

/****************** UPDATE *******************/

app.get("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const record = await Record.findById(id);
    if (!record) {
      return res.status(404).send("Record not found");
    }
    res.render("update", { record });
  } catch (err) {
    console.error("Error fetching record for update:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/update/dns/:id", async (req, res) => {
  const { id } = req.params;
  const { dns } = req.body;

  try {
    const existingRecord = await Record.findOne({ dns });
    if (existingRecord) {
      return res.send(`Unable to assign DNS (${dns}) to IP address as it is already assigned.`);
    }

    await Record.findByIdAndUpdate(id, { dns });
    console.log("DNS updated for record:", { id, dns });
    res.redirect("/view-all");
  } catch (err) {
    console.error("Error updating DNS:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/update/ip/:id", async (req, res) => {
  const { id } = req.params;
  const { ip } = req.body;

  // Validate IP address format
  if (!isValidIp(ip)) {
    return res.send("Invalid IP address format");
  }

  try {
    const existingRecord = await Record.findOne({ ip });
    if (existingRecord) {
      return res.send(`Unable to assign IP (${ip}) to DNS as it is already assigned.`);
    }

    // calculate class based on IP
    const ipClass = getIpClass(ip);

    await Record.findByIdAndUpdate(id, { ip, class: ipClass });
    console.log("IP updated for record:", { id, ip });
    res.redirect("/view-all");
  } catch (err) {
    console.error("Error updating IP:", err);
    res.status(500).send("Internal Server Error");
  }
});


/****************** DELETE *******************/

app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Record.findByIdAndDelete(id);
    console.log("Record deleted:", id);
    res.redirect("/view-all");
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).send("Internal Server Error");
  }
});


/********************************** DELETE ROUTE ******************************/

app.get("/delete", (req, res) => {
  res.render("delete",{error:null,success:null});
});

app.post("/delete", async (req, res) => {
  const { dns, ip } = req.body;

  try {
    let record;

    // Attempt to delete by DNS or IP
    if (dns) {
      record = await Record.findOneAndDelete({ dns });
    } else if (ip) {
      record = await Record.findOneAndDelete({ ip });
    }

    if (record) {
      // Redirect to the "View All" page on success
      return res.redirect("/view-all");
    } else {
      // Show an error message if no record found
      return res.render("delete", { error: "No record found to delete. Please check the DNS or IP entered." });
    }
  } catch (err) {
    console.error("Error deleting record:", err);
    return res.render("delete", { error: "An error occurred while trying to delete the record. Please try again." });
  }
});


// Server listener
app.listen(3000, () => {
  console.log("Server started on port 3000");
});


/***************************** FUNCTIONS ****************************** */

// Function to validate the IP address format using a regex
function isValidIp(ip) {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}


// Function to determine IP class
function getIpClass(ip) {
  const firstOctet = parseInt(ip.split('.')[0]);

  
  if (firstOctet >= 0 && firstOctet <= 127) {
    return 'Class A';
  } else if (firstOctet >= 128 && firstOctet <= 191) {
    return 'Class B';
  } else if (firstOctet >= 192 && firstOctet <= 223) {
    return 'Class C';
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    return 'Class D';
  } else {
    return 'Class E';
  }
}



//function to check IP
function isValidIP1(ip) {
  // Split the IP by '.'
  const parts = ip.split(".");
  
  // An IP address must have exactly 4 parts
  if (parts.length !== 4) return false;

  // Check each part
  for (const part of parts) {
      // Convert the part to a number
      const num = Number(part);

      // Check if the part is a valid number and in the range 0-255
      if (isNaN(num) || num < 0 || num > 255) return false;

      // Check for leading zeros (e.g., "01" is invalid)
      if (part.length > 1 && part[0] === "0") return false;
  }

  return true;
}