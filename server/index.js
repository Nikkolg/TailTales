const express = require('express')

const app = express()

const PORT = 3001

const start = () => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}


start()