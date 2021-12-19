require("dotenv").config();

const PORT = process.env.PORT
const SECRET = process.env.SECRET
const DATABASE_URL =  process.env.DATABASE_URL
module.exports = {
    SECRET,
    PORT,
    DATABASE_URL
}