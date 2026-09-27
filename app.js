const express = require("express");
const sequelize = require("./models");
const Todo = require("./models/todo");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll({
      order: [["id", "ASC"]],
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = [];
    const dueToday = [];
    const dueLater = [];

    todos.forEach((todo) => {
      if (!todo.dueDate) {
        dueLater.push(todo);
        return;
      }

      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        overdue.push(todo);
      } else if (dueDate.getTime() === today.getTime()) {
        dueToday.push(todo);
      } else {
        dueLater.push(todo);
      }
    });

    res.render("index", {
      overdue,
      dueToday,
      dueLater,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = { app, sequelize };