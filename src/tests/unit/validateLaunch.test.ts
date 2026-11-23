import { createLaunchZSchema, updateLaunchZSchema, favoriteLaunchZSchema } from "../../models/launches";

//to handle schema changes wrapping fields in body
const parseCreate = (body: unknown) =>
    createLaunchZSchema.safeParse({ body });

const parseUpdate = (body: unknown) =>
    updateLaunchZSchema.safeParse({ body });

const parseFavorite = (body: unknown) =>
    favoriteLaunchZSchema.safeParse({ body });

const validLaunch = {
  missionName: "Test",
  rocketName: "Test",
  date: "2026-01-01T00:00:00Z",
  favorite: false,
  notes: "Test"
};

describe("create launch validation", () => {
    it("accepts a valid launch with all fields", () => {
        expect(parseCreate(validLaunch).success).toBe(true);
    });

    it("accepts a launch with only required fields", () => {
        expect(
            parseCreate({
                missionName: "Test Mission",
                rocketName: "Test Rocket",
            }).success,
        ).toBe(true);
    });

    it("rejects a missing mission name", () => {
        const result = parseCreate({ rocketName: "Test Rocket" });

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues).toContainEqual(
                expect.objectContaining({ path: ["body", "missionName"] }),
            );
        }
    });

    it("rejects a missing rocket name", () => {
        expect(parseCreate({ missionName: "Test Mission" }).success).toBe(false);
    });

    it("rejects empty required names", () => {
        expect(
            parseCreate({ missionName: "", rocketName: "Test Rocket" }).success,
        ).toBe(false);
        expect(
            parseCreate({ missionName: "Test Mission", rocketName: "" }).success,
        ).toBe(false);
    });

    it("rejects an invalid date", () => {
        expect(
            parseCreate({ ...validLaunch, date: "not-a-date" }).success,
        ).toBe(false);
    });

    it("accepts notes at the 100-character limit", () => {
        expect(parseCreate({ ...validLaunch, notes: "a".repeat(100) }).success)
            .toBe(true);
    });

    it("rejects notes longer than 100 characters", () => {
        expect(parseCreate({ ...validLaunch, notes: "a".repeat(101) }).success)
            .toBe(false);
    });

    it("rejects a non-boolean favorite value", () => {
        expect(parseCreate({ ...validLaunch, favorite: "false" }).success)
            .toBe(false);
    });

    it("rejects a non-string notes value", () => {
        expect(parseCreate({ ...validLaunch, notes: 123 }).success).toBe(false);
    });
});

describe("update launch validation", () => {
    it("accepts a valid update", () => {
        expect(parseUpdate(validLaunch).success).toBe(true);
    });

    it("rejects an update missing a required name", () => {
        expect(parseUpdate({ missionName: "Test Mission" }).success).toBe(false);
    });
});

describe("favorite launch validation", () => {
    it.each([true, false])("accepts favorite=%s", (favorite) => {
        expect(parseFavorite({ favorite }).success).toBe(true);
    });

    it("rejects a non-boolean favorite value", () => {
        expect(parseFavorite({ favorite: "yes" }).success).toBe(false);
    });

    it("rejects a missing favorite value", () => {
        expect(parseFavorite({}).success).toBe(false);
    });
});
