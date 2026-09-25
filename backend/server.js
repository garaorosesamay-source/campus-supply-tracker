const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let names = [
    {
        name: "Jason",
        lastname: "Casanares"
    },
    {
        name: "Heart",
        lastname: "Lanugo"
    },
    {
        name: "Sherwin",
        lastname: "Macaspac"
    },
    {
        name: "Kreshia",
        lastname: "Mortel"
    }
];

app.get('/api/product', (req, res) => {
    res.json(names);
});

app.post('/api/product', (req, res) => {
    console.log(req.body);

    names.push(req.body);
    res.json(req.body);
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});   