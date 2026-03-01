import { Router } from 'express';
import { referenceController } from '../controllers/reference.controller.js';

const router = Router();

router.get('/airports', referenceController.getAirports);
router.get('/cities', referenceController.getCities);
router.get('/countries', referenceController.getCountries);
router.get('/airlines', referenceController.getAirlines);
router.get('/autocomplete', referenceController.autocomplete);

export default router;
