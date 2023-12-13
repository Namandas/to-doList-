import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  database : "permalist",
  password : "naman918",
  port : 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


async function getItems(){
  const response = await db.query("SELECT * FROM items");
  var items = [];
  for(var i = 0;i<response.rows.length;i++){
    const obj = {
      id : response.rows[i].id,
      title : response.rows[i].title
    }
    items.push(obj);
  }
  return items;
}
var items = await getItems();
app.get("/", async(req, res) => {
   items = await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES($1)",[item]);
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  await db.query("UPDATE items SET title = $1 WHERE id = $2",[req.body.updatedItemTitle,req.body.updatedItemId])
  res.redirect("/");
});

app.post("/delete", async(req, res) => {
  await db.query("DELETE FROM items WHERE id = $1",[req.body.deleteItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
