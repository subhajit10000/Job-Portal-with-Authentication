const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

require("dotenv").config();
const app = require("./app.js");
const connectDB = require("./config/db.js")

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
});
