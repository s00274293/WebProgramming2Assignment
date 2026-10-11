import { createLaunchZSchema } from "../../models/launches";

const validLaunch = {
  missionName: "Test",
  rocketName: "Test",
  date: "2026-01-01T00:00:00Z",
  favorite: false,
  notes: "Test"
};

describe('Test Launch Validation', () => {
    it('accepts a valid launch with all fields', () => {
        expect(() => createLaunchZSchema.parse(validLaunch)).not.toThrow();
    });

    it('accepts a launch with only the required fields', () => {
        const launch = {
            missionName: 'Test mission',
            rocketName: 'Test rocket'
        };

        expect(() => createLaunchZSchema.parse(launch)).not.toThrow();
    });

    it('rejects a launch missing missionName', () => {
        expect(() => createLaunchZSchema.parse({ rocketName: 'Test rocket' })).toThrow();
    });

    it('rejects a launch missing rocketName', () => {
        expect(() => createLaunchZSchema.parse({ missionName: 'Test mission' })).toThrow();
    });

    it('rejects a launch with only empty strings in required fields', () => {
        const launch = {
            missionName: '',
            rocketName: 'Test rocket'
        };

        expect(() => createLaunchZSchema.parse(launch)).toThrow();
    });

    it('rejects a launch when the date is not a valid datetime', () => {
        const launch = {
            missionName: "Test mission",
            rocketName: "Test rocket",
            date: "not-a-real-date"
        };

        expect(() => createLaunchZSchema.parse(launch)).toThrow();
    });
    

    it('accepts notes at the 100-character limit', () => {
        const launch = { ...validLaunch, notes: 'a'.repeat(100) };

        expect(() => createLaunchZSchema.parse(launch)).not.toThrow();
    });

    it('rejects notes longer than 100 characters', () => {
        const launch = { ...validLaunch, notes: 'a'.repeat(101) };

        expect(() => createLaunchZSchema.parse(launch)).toThrow();
    });

    it('rejects invalid type for favorite', () => {
        const invalidFavorite = { ...validLaunch, favorite: 'false'};
        expect(() => createLaunchZSchema.parse(invalidFavorite)).toThrow();
    });
    
    it('rejects invalid type for notes', () => {
        const invalidNotes = {...validLaunch, notes: 123};
        expect(() => createLaunchZSchema.parse(invalidNotes)).toThrow();
    });
});
