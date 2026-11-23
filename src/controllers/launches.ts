import { Request, Response } from 'express';
import { LaunchService } from '../services/launches';
import { createLaunchZSchema } from '../models/launches';

const launchService = new LaunchService();

export class LaunchController {

  /**
 * @openapi
 * /launches:
 *   get:
 *     summary: Retrieve all rocket launches
 *     tags:
 *       - Launches
 *     responses:
 *       200:
 *         description: Successfully retrieved launches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Launch'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
  getLaunches = async (_req: Request, res: Response): Promise<void> => {
  try {
    const launches = await launchService.getAllLaunches();
    res.status(200).json(launches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching launches', error });
  }
};


/**
 * @openapi
 * /launches/{id}:
 *   get:
 *     summary: Get a launch by ID
 *     tags:
 *       - Launches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB launch identifier.
 *         schema:
 *           type: string
 *           example: "65a1b2c3d4e5f67890123456"
 *     responses:
 *       200:
 *         description: Launch found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Launch'
 *       404:
 *         description: Launch not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
  getLaunchById = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const launch = await launchService.getLaunchById(id);
    res.status(200).json(launch);
};


/**
 * @openapi
 * /launches:
 *   post:
 *     summary: Create a new launch
 *     tags:
 *       - Launches
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLaunchInput'
 *     responses:
 *       201:
 *         description: Successfully created Rocket Launch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Launch'
 *       400:
 *         description: Request body failed validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
  createLaunch = async (req: Request, res: Response): Promise<void> => {
  try {
    const newLaunch = await launchService.createLaunch(req.body);
    res.status(201).json(newLaunch);
  } catch (error) {
    res.status(500).json({ message: 'Error inserting launch into MongoDB', error });
  }
};

/**
 * @openapi
 * /launches/{id}:
 *   put:
 *     summary: Replace a launch by ID
 *     tags:
 *       - Launches
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB launch identifier.
 *         schema:
 *           type: string
 *         example: "65a1b2c3d4e5f67890123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLaunchInput'
 *     responses:
 *       200:
 *         description: Launch updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Launch'
 *       400:
 *         description: Request body failed validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       404:
 *         description: Launch not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServerErrorResponse'
 */
  updateLaunch = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updatedLaunch = await launchService.updateLaunch(id, req.body);
    res.status(200).json(updatedLaunch);
};


/**
* @openapi
* /launches/{id}:
*   delete:
*     summary: Delete a Rocket Launch by ID
*     tags:
*       - Launches
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: MongoDB launch identifier.
*         schema:
*           type: string
*           example: "65a1b2c3d4e5f67890123456"
*     responses:
*       200:
*         description: Launch deleted
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/DeleteLaunchResponse'
*       404:
*         description: Launch not found
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/MessageResponse'
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/ServerErrorResponse'
*/
  deleteLaunch = async (_req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(_req.params.id) ? _req.params.id[0] : _req.params.id;
    await launchService.deleteLaunch(id);
    
    res.status(200).json({
      success: true,
      data: `Launch with id ${_req.params.id} deleted successfully`
    });

};

getUpcomingLaunches = async (_req: Request, res: Response): Promise<void> => {
  try {
    const launches = await launchService.getUpcomingLaunches();
    res.status(200).json(launches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming launches', error });
  }
};

setFavorite = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updatedLaunch = await launchService.setFavorite( id, req.body.favorite );


    res.status(200).json({
      success: true,
      data: `Launch with id ${req.params.id} favorite status updated`
    });
  }
  
};

