const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.json({ message: "Hello world!" });
});

console.log('Server is running...');

app.listen(3000);