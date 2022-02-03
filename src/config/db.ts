import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const dbConnect = () => {
    mongoose.connect(String(process.env.DB_URL)).then(()=>{console.log('mongo connected')})
    .catch((err) => {
          console.log(err.message)
    })
}

export = dbConnect