// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
 
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ todos: [] })
  .write()

var todoLists = ["Đi chợ", "Nấu cơm", "Rửa bát", "Học code tại CodersX"];

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.render('index');
});

app.get("/todos", (req, res) => {
  var q = req.query.q;
  if (!q) {
    res.render("todos", {
      todos: db.get('todos').value()
    });
  } else {
    var matchedLists = db.get('todos').value().filter(function(todo) {
      return todo['text'].toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });
    res.render("todos", {
      todos: matchedLists
    });
  }
});

app.post('/todos/create', function(req, res) {
  var newTodo = req.body.todo;
  db.get('todos').push({id: db.get('todos').value().id + 1, text: newTodo}).write();
  res.redirect('back');
});

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
