import express from 'express';
import {
  getAllusers,
  getuserById,
  createuser,
  updateuser,
  patchuser,
  deleteuser
} from '../controllers/user.controller.js';

import validateuser, { validatePutuser, validatePatchuser } from '../middlewares/user.middleware.js';

const router = express.Router();

router.get('/', getAllusers);
router.get('/:id', getuserById);
router.post('/', validateuser, createuser);
router.put('/:id', validatePutuser, updateuser);
router.patch('/:id', validatePatchuser, patchuser);
router.delete('/:id', deleteuser);

export default router;
