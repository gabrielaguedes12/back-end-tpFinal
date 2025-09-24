import express from 'express';

import { listarUsuarios } from '../Controllers/analiseController.js'; 

const router = express.Router();

router.get('/usuarios', listarUsuarios);

export default router;