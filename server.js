// Dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");

const dbDir = path.resolve(__dirname, "db");
const noteFile = fs.readFileSync(path.resolve(dbDir, "db.json"));
const noteJson = JSON.parse(noteFile);


// Express setup
const app = express();
const PORT = process.env.PORT || 8080;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Fuction to create ID for each note
const createId = () => {
    for (let i = 0; i < noteJson.length; i++) {
        noteJson[i].id = i;
    }
}



// ******* API Routes *******

// Get all notes
app.get("/api/notes", (req, res) => {
    createId();
    res.json(noteJson);
    console.log("Retrieving notes...");
});

// Post new note
app.post("/api/notes", (req, res) => {
    const note = req.body;
    noteJson.push(note);

    createId();

    fs.writeFileSync(path.resolve(dbDir, "db.json"), JSON.stringify(noteJson), "utf-8"); // Write updated note to notes file
    res.json(note);
    console.log("New note created successfully.");
});

// Delete existing note
app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;

    createId();
    noteJson.splice(noteId, 1);

    fs.writeFileSync(path.resolve(dbDir, "db.json"), JSON.stringify(noteJson), "utf-8"); // Write updated notes file
    res.json(noteJson);
    console.log("Note deleted successfully.");
});



// ******* HTML Routes *******
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});



// ******* Start Express Server *******
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});