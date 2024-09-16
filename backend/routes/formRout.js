import express from 'express';
import { submitCandidate } from '../controller/formController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/submit', upload.array('documents', 5), submitCandidate);

export default router;
