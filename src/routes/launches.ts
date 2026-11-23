import { Router } from 'express';
import { LaunchController } from '../controllers/launches';
import { validate } from '../middleware/validate.middleware';
import { createLaunchZSchema, updateLaunchZSchema, favoriteLaunchZSchema } from '../models/launches';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();
const launchController = new LaunchController();

router.get('/', launchController.getLaunches);

//no way to login via application yet. Remove all use of authenticateJWT until then
router.get('/upcoming', launchController.getUpcomingLaunches);
router.get('/:id', launchController.getLaunchById);
router.post('/', validate(createLaunchZSchema), launchController.createLaunch);
router.put('/:id',  validate(updateLaunchZSchema), launchController.updateLaunch);
router.delete('/:id', launchController.deleteLaunch);
router.patch('/:id/favorite', validate(favoriteLaunchZSchema),launchController.setFavorite);

export default router;
