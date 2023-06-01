import '@/config/mongodb';
import cors from 'cors';
import express from 'express';

import {
  ClassRoutes,
  GradeRoutes,
  StudentRoutes,
  SubjectRoutes,
  TeacherRoutes,
} from './routes';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.status(200).send('Hello World!'));

app.use('/classes', ClassRoutes);
app.use('/grades', GradeRoutes);
app.use('/students', StudentRoutes);
app.use('/subjects', SubjectRoutes);
app.use('/teachers', TeacherRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));
