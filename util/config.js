require("dotenv").config();

const PORT = process.env.PORT
const secret = process.env.SECRET
const DATABASE_URL = process.env.DATABASE_URL
module.exports = {
    secret,
    PORT,
    DATABASE_URL
}