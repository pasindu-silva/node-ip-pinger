const express = require("express");
const fs = require("fs");
const os = require("os");
const app = express();

// Function to get the server's IP address
function getServerIp() {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let alias of interfaces[iface]) {
      if (alias.family === "IPv4" && !alias.internal) {
        return alias.address;
      }
    }
  }
  return "Unable to determine server IP";
}

// Function to get the Docker container ID
function getContainerId() {
  try {
    const cgroup = fs.readFileSync("/proc/self/cgroup", "utf8");
    const containerId = cgroup.split("\n")[0].split("/").pop().substring(0, 20); // Get first 12 chars of container ID
    return containerId;
  } catch (err) {
    return "Not running in a container";
  }
}

// Route to log and return the server's IP address and container ID
app.get("/", (req, res) => {
  const serverIp = getServerIp();
  const containerId = getContainerId();
  res.send(
    `<h1>Receiving from Server IP: ${serverIp}</h1> <br/> <h1>Container ID: ${containerId}</h1>`
  );
});

app.get("/health", (req, res) => {
  res.send("Healthy");
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
