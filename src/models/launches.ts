import { Schema, model } from 'mongoose';
import { z } from 'zod';

export interface ILaunch {
    missionName: string;
    rocketName: string;
    date: Date;
    favorite: boolean;
    notes: string;
}

export const launchSchema = new Schema<ILaunch>(
    {
        missionName: { type: String, required: true },
        rocketName: { type: String, required: true },
        date: { type: Date, required: false, 
            validate: {
                validator: (value: Date) => !isNaN(value.getTime()),
                message: 'Invalid date format'
            }
        },
        favorite: { type: Boolean, required: false },
        notes: { type: String, required: false, maxlength: [100, 'Notes cannot exceed 100 characters'] }
    }, 
    { timestamps: true }
);

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateLaunchInput:
 *       type: object
 *       description: Launch data supplied when creating a launch.
 *       required:
 *         - missionName
 *         - rocketName
 *       properties:
 *         missionName:
 *           type: string
 *           minLength: 1
 *           example: "Starlink Group 7-3"
 *         rocketName:
 *           type: string
 *           minLength: 1
 *           example: "Falcon 9"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2026-01-01T00:00:00Z"
 *         favorite:
 *           type: boolean
 *           example: false
 *         notes:
 *           type: string
 *           maxLength: 100
 *           example: "Successful booster landing."
 *     UpdateLaunchInput:
 *       type: object
 *       description: Launch data supplied when replacing a launch.
 *       required:
 *         - missionName
 *         - rocketName
 *       properties:
 *         missionName:
 *           type: string
 *           minLength: 1
 *           example: "Starlink Group 7-3"
 *         rocketName:
 *           type: string
 *           minLength: 1
 *           example: "Falcon 9"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2026-01-01T00:00:00Z"
 *         favorite:
 *           type: boolean
 *           example: false
 *         notes:
 *           type: string
 *           maxLength: 100
 *           example: "Successful booster landing."
 *     Launch:
 *       type: object
 *       description: A persisted rocket launch.
 *       required:
 *         - _id
 *         - missionName
 *         - rocketName
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB document identifier.
 *           example: "65a1b2c3d4e5f67890123456"
 *         missionName:
 *           type: string
 *           example: "Starlink Group 7-3"
 *         rocketName:
 *           type: string
 *           example: "Falcon 9"
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2026-01-01T00:00:00.000Z"
 *         favorite:
 *           type: boolean
 *           example: false
 *         notes:
 *           type: string
 *           maxLength: 100
 *           example: "Successful booster landing."
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         __v:
 *           type: integer
 *           description: Mongoose document version.
 *     MessageResponse:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           example: "Launch not found"
 *     ValidationErrorResponse:
 *       type: object
 *       required:
 *         - message
 *         - errors
 *       properties:
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             description: A Zod validation issue.
 *             additionalProperties: true
 *     ServerErrorResponse:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           example: "Error fetching launches"
 *         error:
 *           description: Optional error details.
 *           oneOf:
 *             - type: object
 *               additionalProperties: true
 *             - type: string
 *     DeleteLaunchResponse:
 *       type: object
 *       required:
 *         - success
 *         - data
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: string
 *           example: "Launch with id 65a1b2c3d4e5f67890123456 deleted successfully"
 */

export const createLaunchZSchema = z.object({
  missionName: z.string().min(1),
  rocketName: z.string().min(1),
  date: z
    .string()
    .datetime()
    .optional(),
  favorite: z.boolean().optional(),
  notes: z.string().max(100).optional()
});

export const updateLaunchZSchema = z.object({
  missionName: z.string().min(1),
  rocketName: z.string().min(1),
  date: z
    .string()
    .datetime()
    .optional(),
  favorite: z.boolean().optional(),
  notes: z.string().max(100).optional()
});

export const favoriteLaunchZSchema = z.object({
  favorite: z.boolean()
});

export const LaunchModel = model<ILaunch>('Launch', launchSchema);
