const path = require("path");
const express = require("express");
const router = express.Router();

// client side static assets
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
router.get("/client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./client.js"))
);
router.get("/style.css", (_, res) =>
  res.sendFile(path.join(__dirname, "./style.css"))
);

/**
 * Student code starts here
 */
const pg = require("pg");
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "foodguru",
  password: "lol",
  port: 5432,
});

router.get("/type", async (req, res) => {
  const { type } = req.query;
  console.log("get ingredients", type);
  const { rows } = await pool.query(
    "SELECT * FROM ingredients WHERE type = $1",
    [type]
  );
  res.json({ rows }).end();
});

router.get("/search", async (req, res) => {
  let { term, page } = req.query;
  page = page ? page : 0;
  console.log("search ingredients", term, page);

  let whereClause;
  const params = [page * 5];
  if (term) {
    whereClause = `WHERE concat(title, type) ILIKE $2`;
    params.push(`%${term}%`);
  }

  let { rows } = await pool.query(
    `SELECT *, COUNT(*) OVER ()::int AS total_count FROM ingredients ${whereClause} OFFSET $1 LIMIT 5`,
    params
  );
  res.json({ rows }).end();
  // res.status(501).json({ status: "not implemented", rows: [] });
});

router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  console.log("delete ingredient", id);
  res.status(501).json({ status: "not implemented" });
});

/**
 * Student code ends here
 */

module.exports = router;
