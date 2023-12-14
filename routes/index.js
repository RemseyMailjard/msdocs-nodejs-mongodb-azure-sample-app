var express = require("express");
var Task = require("../models/task");
// Import the JSON data
const jsonData = require("./data.json");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  Task.find()
    .then((tasks) => {
      const currentTasks = tasks.filter((task) => !task.completed);
      const completedTasks = tasks.filter((task) => task.completed === true);

      console.log(
        `Total tasks: ${tasks.length}   Current tasks: ${currentTasks.length}    Completed tasks:  ${completedTasks.length}`
      );

      // Define the welcome message
      const message = "Hello Year Up Class! Welcome to my Demo API.";

      // List of API endpoints and their descriptions
      const apiEndpoints = {
        "All Users": "https://yearupdemo.azurewebsites.net/api/users",
        // ... other endpoints ...
      };

      // Generate HTML list of endpoints
      let endpointsHtml = "<ul>";
      for (const [description, url] of Object.entries(apiEndpoints)) {
        endpointsHtml += `<li>${description}: <a href="${url}">${url}</a></li>`;
      }
      endpointsHtml += "</ul>";

      // Combine message and endpoints list
      const fullMessage = `<p>${message}</p>${endpointsHtml}`;

      // Render the page with tasks and full message
      res.render("index", {
        currentTasks: currentTasks,
        completedTasks: completedTasks,
        fullMessage: fullMessage
      });
    })
    .catch((err) => {
      console.log(err);
      res.send("Sorry! Something went wrong.");
    });
});


router.post("/addTask", function (req, res, next) {
  const taskName = req.body.taskName;
  const createDate = Date.now();

  var task = new Task({
    taskName: taskName,
    createDate: createDate,
  });
  console.log(`Adding a new task ${taskName} - createDate ${createDate}`);

  task
    .save()
    .then(() => {
      console.log(`Added new task ${taskName} - createDate ${createDate}`);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.send("Sorry! Something went wrong.");
    });
});

router.post("/completeTask", function (req, res, next) {
  console.log("I am in the PUT method");
  const taskId = req.body._id;
  const completedDate = Date.now();

  Task.findByIdAndUpdate(taskId, { completed: true, completedDate: Date.now() })
    .then(() => {
      console.log(`Completed task ${taskId}`);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.send("Sorry! Something went wrong.");
    });
});

router.post("/deleteTask", function (req, res, next) {
  const taskId = req.body._id;
  const completedDate = Date.now();
  Task.findByIdAndDelete(taskId)
    .then(() => {
      console.log(`Deleted task $(taskId)`);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.send("Sorry! Something went wrong.");
    });
});

router.get("/api/users", (req, res) => {
  res.json(jsonData);
});

// Get User by ID
router.get("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = jsonData.find((u) => u.ID === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

// Get Users by Group Name
router.get("/api/users/group/:groupname", (req, res) => {
  const groupName = req.params.groupname;
  const groupUsers = jsonData.filter((u) => u.Groupname === groupName);
  res.json(groupUsers);
});

// Get Users by Coding Nickname
router.get("/api/users/nickname/:nickname", (req, res) => {
  const nickname = req.params.nickname;
  const usersWithNickname = jsonData.filter(
    (u) => u.CodingNickname === nickname
  );
  res.json(usersWithNickname);
});

// Update User Information
router.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedInfo = req.body;
  let userIndex = jsonData.findIndex((u) => u.ID === userId);
  if (userIndex !== -1) {
    jsonData[userIndex] = { ...jsonData[userIndex], ...updatedInfo };
    res.json(jsonData[userIndex]);
  } else {
    res.status(404).send("User not found");
  }
});

// Delete a User
router.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = jsonData.findIndex((u) => u.ID === userId);
  if (userIndex !== -1) {
    jsonData.splice(userIndex, 1);
    res.send("User deleted successfully");
  } else {
    res.status(404).send("User not found");
  }
});

module.exports = router;
