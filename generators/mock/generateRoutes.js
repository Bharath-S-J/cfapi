import path from 'node:path';
import pluralize from 'pluralize';
import { safeWrite } from '../../utils/fileUtils.js';
import logger from '../../utils/logger.js';

const generateRoutes = async (modelName, outputDir) => {
  const plural = pluralize(modelName);

  const content = `import express from 'express';
import {
  getAll${plural},
  get${modelName}ById,
  create${modelName},
  update${modelName},
  patch${modelName},
  delete${modelName}
} from '../controllers/${modelName}.controller.js';
import validate${modelName}, { validatePut${modelName}, validatePatch${modelName} } from '../middlewares/${modelName}.middleware.js';

const router = express.Router();

router.get('/', getAll${plural});
router.get('/:id', get${modelName}ById);
router.post('/', validate${modelName}, create${modelName});
router.put('/:id', validatePut${modelName}, update${modelName});
router.patch('/:id', validatePatch${modelName}, patch${modelName});
router.delete('/:id', delete${modelName});

export default router;
`;

  const filePath = path.join(outputDir, 'routes', `${modelName}.routes.js`);
  await safeWrite(filePath, content);
  logger.info(`Created routes: ${modelName}`);
};

export default generateRoutes;
