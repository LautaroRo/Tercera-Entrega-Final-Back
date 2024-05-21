import dotenv from "dotenv"

dotenv.config()

export const entorno = {
    PORT: process.env.PORT,
    MONGOURL: process.env.MONGOURL,
    PERSISTENCIA: process.env.PERSISTENCIA,
    SECRETO: process.env.SECRETO
}