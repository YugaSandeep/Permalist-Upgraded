import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = new express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Practice ToDoList",
    password: "Sandeep@123",
    port: 5433
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let items = [];
let weeklyItems = [];
let monthlyItems = [];

// db.query("SELECT * FROM items", (err, res) => {
//     if(err) {
//         console.log("Error occurred", err);
//     } else {
//         // console.log(res);
//         items = res.rows;
//         // console.log(items);
//     }
// });

//we can simply write the above code 
//look the 1st line in app.get broo

app.get("/", async(req, res) => {
    const result = await db.query("SELECT * FROM items ORDER BY id");
    items = result.rows;
    res.render("index.ejs", {
        listTitle: "Today",
        listItems: items
    });
});

app.get("/weekly", async(req, res) => {
    const result = await db.query("SELECT * FROM week_items ORDER BY id");
    // console.log(result.rows);
    weeklyItems = result.rows;
    res.render("index1.ejs", {
        listTitle: "This Week",
        listItems: weeklyItems
    });
});

app.get("/monthly", async(req, res) => {
    const result = await db.query("SELECT * FROM month_items ORDER BY id");
    monthlyItems = result.rows;
    res.render("index2.ejs", {
        listTitle: "This Month",
        listItems: monthlyItems
    });
});

app.post("/add", async(req, res) => {
    const addedItem = req.body["newItem"];
    try {
        await db.query("INSERT INTO items (title) VALUES ($1)", [addedItem]);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/");
});

app.post("/addWeekly", async(req, res) => {
    const addedItem = req.body["newItem"];
    try {
        await db.query("INSERT INTO week_items (title) VALUES ($1)", [addedItem]);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/weekly");
});

app.post("/addMonthly", async(req, res) => {
    const addedItem = req.body["newItem"];
    try {
        await db.query("INSERT INTO month_items (title) VALUES ($1)", [addedItem]);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/monthly");
});

app.post("/delete", async(req, res) => {
    const theId = req.body.deletedItemId;
    try {
        await db.query("DELETE FROM items WHERE id = $1", [theId]);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/");
});

app.post("/deleteWeekly", async(req, res) => {
    const deletedItemId = req.body["deletedItemId"];
    // console.log(deletedItemId);
    try {
        await db.query("DELETE FROM week_items WHERE id = ($1)", [deletedItemId]);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/weekly")
});

app.post("/deleteMonthly", async(req, res) => {
    const deletedItemId = req.body.deletedItemId;
    try {
        await db.query("DELETE FROM month_items where id = ($1)", [deletedItemId]);
    } catch (err) {
        console.log(err);
    }
    res.redirect("/monthly");
});

app.post("/edit", async(req, res) => {
    const updatedItemId = req.body.updatedItemId;
    // console.log(updatedItemId);
    const updatedItemTitle = req.body.updatedItemTitle;
    console.log(updatedItemTitle);
    try {
        await db.query("UPDATE items SET title = ($1) WHERE id = ($2)", [updatedItemTitle, updatedItemId]);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/");
});

app.post("/editWeekly", async(req, res) => {
    const updatedItemId = req.body["updatedItemId"];
    const updatedItemTitle = req.body["updatedItemTitle"];
    try {
        await db.query("UPDATE week_items SET title = ($1) WHERE id = ($2)", [updatedItemTitle, updatedItemId]);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/weekly");
});

app.post("/editMonthly", async(req, res) => {
    const updatedItemId = req.body.updatedItemId;
    const updatedItemTitle = req.body.updatedItemTitle;
    try {
        await db.query("UPDATE month_items SET title = ($1) WHERE id = ($2)", [updatedItemTitle, updatedItemId]);
    } catch(err) {
        console.log(err);
    }
    res.redirect("/monthly");
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});