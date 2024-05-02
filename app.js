import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRoute.js';
import blogRouter from './routes/blogRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/IST256Solo2', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoCreate: true
}).then(() =>  {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("error connecting to MongoDB",err);

});

app.use('/users',userRouter);
app.use('/blogs',blogRouter);
app.use(express.static(path.join(__dirname,'frontend'),{
    setHeaders: (res ,filePath) => {
        if(filePath.endsWith('.js')){
            res.setHeader('Content-Type','Application/javascript');
        }
    }
}));

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
}); 

app.listen(port, () => {
    console.log("Server is running");
})