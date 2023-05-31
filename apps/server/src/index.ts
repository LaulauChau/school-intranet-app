import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.status(200).send('Hello World!'));

app.listen(3000, () => console.log('Server running on port 3000'));
