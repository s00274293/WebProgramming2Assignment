import request from "supertest";
import { app } from "../../app";

const launchesEndpoint = "/api/v1/launches";

describe("GET /launches", () => {
    it("returns all rocket launches as an array", async () => {
        const response = await request(app).get(launchesEndpoint);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        for (const launch of response.body) {
            expect(launch).toEqual(
                expect.objectContaining({
                    _id: expect.any(String),
                    missionName: expect.any(String),
                    rocketName: expect.any(String),
                }),
            );
        }
    });

    it("returns 404 when the launch does not exist", async () => {
        const response = await request(app).get(
            `${launchesEndpoint}/000000000000000000000001`,
        );

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Launch not found" });
    });
});

describe("launch validation", () => {
    it("rejects a launch with an empty mission name", async () => {
        const response = await request(app)
            .post(launchesEndpoint)
            .send({ missionName: "", rocketName: "Falcon 9" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.errors).toEqual(expect.any(Array));
    });

    it("rejects an update missing the rocket name", async () => {
        const response = await request(app)
            .put(`${launchesEndpoint}/000000000000000000000001`)
            .send({ missionName: "Test Mission" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.errors).toEqual(expect.any(Array));
    });

    it("rejects a favorite update with a non-boolean value", async () => {
        const response = await request(app)
            .patch(`${launchesEndpoint}/000000000000000000000001/favorite`)
            .send({ favorite: "yes" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.errors).toEqual(expect.any(Array));
    });
});