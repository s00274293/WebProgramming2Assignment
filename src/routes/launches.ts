import { Router } from 'express';
import { LaunchController } from '../controllers/launches';
import { validate } from '../middleware/validate.middleware';
import { createLaunchZSchema, updateLaunchZSchema, favoriteLaunchZSchema } from '../models/launches';

const router = Router();
const launchController = new LaunchController();

router.get('/', launchController.getLaunches);

router.get('/upcoming', launchController.getUpcomingLaunches);
router.get('/:id', launchController.getLaunchById);
router.post('/', validate(createLaunchZSchema), launchController.createLaunch);
router.put('/:id', validate(updateLaunchZSchema), launchController.updateLaunch);
router.delete('/:id', launchController.deleteLaunch);
router.put('/:id/favorite', validate(favoriteLaunchZSchema),launchController.setFavorite);

export default router;
