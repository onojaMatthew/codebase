const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const winston = require("winston");
const db = require("./config/db");
const path = require("path");

require("dotenv").config();

const swaggerDocument = require("./swagger");
const {
  PORT,
} = process.env;

const port = PORT || 4200

//===========================================================================
// Instantiating the express application
const app = express();

//===========================================================================
// Connecting to the database
db();

// app.use(express.static(path.join(__dirname, '/client/build')));

//============================================================================
// Setting up middlewares
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true , parameterLimit: 500000 }));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(cookieParser());

//==================================================
// Setting up Cross Origin Resource Sharing
//==================================================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept, X-Auth-Token");

  next();
});



require("./middleware/prod")(app);
//=============================================================================
// Custom route configuration
require("./middleware/routes")(app);

app.get('/', (req, res) => {
  res.json({ message: "Welcome to EXPRESS API" });
});

//=============================================================================
// error logger
require("./config/error-log")();


//=============================================================================
// Starting the server and listening on a port address
app.listen(port, () => {
  winston.info(`🚀 Server ready at http://localhost:${ port }`);
});

// Metamask pass phrase
// duck quarter word sausage calm glare area winter sure execute recipe nothing
