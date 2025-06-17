import express from 'express';
import {
  getAllcompanies,
  getcompanyById,
  createcompany,
  updatecompany,
  patchcompany,
  deletecompany
} from '../controllers/company.controller.js';

import validatecompany, { validatePutcompany, validatePatchcompany } from '../middlewares/company.middleware.js';

const router = express.Router();

router.get('/', getAllcompanies);
router.get('/:id', getcompanyById);
router.post('/', validatecompany, createcompany);
router.put('/:id', validatePutcompany, updatecompany);
router.patch('/:id', validatePatchcompany, patchcompany);
router.delete('/:id', deletecompany);

export default router;
