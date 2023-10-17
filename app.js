/**
 * Load environment variables
 */
require("dotenv").config();

/**
 * Database connection
 */
require("./api/models/db.js");

/**
 * Swagger and OpenAPI
 */
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = swaggerJsDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "FillMoreGraves",
      version: "0.1.0",
      description:
          "REST API za aplikacijo FillMoreGraves"
    },
    tags: [
      {
        name: "Administratorji",
        description: "",
      }, {
        name: "Dokumenti",
        description: "",
      }, {
        name: "Dokumenti-tipi",
        description: "",
      }, {
        name: "Navadni-uporabniki",
        description: "",
      }, {
        name: "Sprozilci",
        description: "",
      }

    ],
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Strežnik za razvoj in testiranje",
      },
      {
        url: "https://fillmore-graves.onrender.com/api",
        description: "Produkcijski strežnik gostovan na oblaku Render",
      },
    ],
    components: {
      schemas: {
        SporočiloNapake: {
          type: "object",
          properties: {
            sporočilo: {
              type: "string",
              description: "Napaka o sporočilu",
            },
          },
          required: ["sporočilo"],
        },
      },
    },
  },
  apis: ["./api/models/schemas.js", "./api/controllers/*.js"],
});

/**
 * Strežba
 */
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/', indexRouter);

app.get("/", function (req, res) {
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");
  app.set('views', path.join(__dirname, 'public'));
  res.render("dokumenti.html");
});

app.get("/db", function (req, res) {
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");
  app.set('views', path.join(__dirname, 'public'));
  res.render("db.html");
});

/**
 * API routing
 */
var indexApi = require("./api/routes/index"); // usmerjevalnik za API
app.use('/api', indexApi);

/**
 * Swagger file and explorer
 */
indexApi.get("/swagger.json", (req, res) =>
    res.status(200).json(swaggerDocument)
);
indexApi.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      customCss: ".swagger-ui .topbar { display: none }",
    })
);

/**
 * Start server
 */
app.listen(port, () => {
  console.log(
      `App started in '${
          process.env.NODE_ENV || "development"
      } mode' listening on port ${port}!`
  );
});

module.exports = app;
