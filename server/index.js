const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const authRouter = require('./routes/authRoutes')

require('dotenv').config()

const app = express()

app.use(cors({}));
app.use(express.json());
app.use('/', authRouter);

const PORT = process.env.PORT || 3005

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        app.listen(PORT, () => console.log(`Сервер запущен - PORT ${PORT}`))
    } catch (e) {
        console.error('Ошибка подключения к базеданных:', e);
    }
}

start()