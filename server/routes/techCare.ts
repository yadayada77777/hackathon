import express = require('express');
import { Request } from 'express';
import { Response } from 'express';
import { userToMesseges }  from '../scarp/db';

const router = express.Router();

// get layers
router.get(
    '/techCare',
    async (request: Request, response: Response): Promise<void> => {
        
        const res = userToMesseges.getAllRecords();

        response.type('application/json').send(res);
    }
);

export default router;