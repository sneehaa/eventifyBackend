const express = require('express');

const app = express();

const PORT = 5500;
app.listen(5500, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/', (req, res) => {

    res.send('Hello World!');

});