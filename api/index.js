const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const moment = require("moment");

mongoose
  .connect("mongodb+srv://oumoudiallo7540:FhhSDktbgYHqDYYH@todolist.g1gdoow.mongodb.net/")
  .then(() => {
    console.log("Connexion à MongoDB réussie");
  })
  .catch((error) => {
    console.log("Erreur de connexion à MongoDB", error);
  });

app.listen(port, () => {
  console.log("Le serveur fonctionne sur le port 3000");
});

const User = require("./models/user");
const Todo = require("./models/todo");

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    ///vérifier si l'email est déjà enregistré
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email déjà enregistré");
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    res.status(202).json({ message: "Utilisateur enregistré avec succès" });
  } catch (error) {
    console.log("Erreur lors de l'enregistrement de l'utilisateur", error);
    res.status(500).json({ message: "Échec de l'enregistrement" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email invalide" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Mot de passe invalide" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Échec de la connexion", error);
    res.status(500).json({ message: "Échec de la connexion" });
  }
});

app.post("/todos/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, category } = req.body;

    const newTodo = new Todo({
      title,
      category,
      dueDate: moment().format("YYYY-MM-DD"),
    });

    await newTodo.save();

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    user?.todos.push(newTodo._id);
    await user.save();

    res.status(200).json({ message: "Tâche ajoutée avec succès", todo: newTodo });
  } catch (error) {
    res.status(200).json({ message: "Tâche non ajoutée" });
  }
});

app.get("/users/:userId/todos", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate("todos");
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ todos: user.todos });
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite" });
  }
});

app.patch("/todos/:todoId/complete", async (req, res) => {
  try {
    const todoId = req.params.todoId;

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      {
        status: "completed",
      },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    res
      .status(200)
      .json({ message: "Tâche marquée comme terminée", todo: updatedTodo });
  } catch (error) {
    res.status(500).json({ error: "Une erreur s'est produite" });
  }
});

app.get("/todos/completed/:date", async (req, res) => {
  try {
    const date = req.params.date;

    const completedTodos = await Todo.find({
      status: "completed",
      createdAt: {
        $gte: new Date(`${date}T00:00:00.000Z`), // Début de la date sélectionnée
        $lt: new Date(`${date}T23:59:59.999Z`), // Fin de la date sélectionnée
      },
    }).exec();

    res.status(200).json({ completedTodos });
  } catch (error) {
    
    res.status(500).json({ error: "Une erreur s'est produite" });
  }
});

app.get("/todos/count", async (req, res) => {
  try {
    const totalCompletedTodos = await Todo.countDocuments({
      status: "completed",
    }).exec();

    const totalPendingTodos = await Todo.countDocuments({
      status: "pending",
    }).exec();

    res.status(200).json({ totalCompletedTodos, totalPendingTodos });
  } catch (error) {
    res.status(500).json({ error: "Erreur réseau" });
  }
});