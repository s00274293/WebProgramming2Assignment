import request from "supertest";
import { app } from "../../app";
import { LaunchModel } from "../../models/launches";
import { AuthService } from "../../services/auth";

const launchesEndpoint = "/api/v1/launches";
const testToken = new AuthService().createToken({
    sub: "launch-test-user",
    email: "launch-test@example.com",
});
const authHeader = { Authorization: `Bearer ${testToken}` };

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
        expect(response.body).toEqual({ error: "NotFoundError", message: "Launch not found" });
    });
});

describe("launch validation", () => {
    it("rejects a launch with an empty mission name", async () => {
        const response = await request(app)
            .post(launchesEndpoint)
            .set(authHeader)
            .send({ missionName: "", rocketName: "Falcon 9" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.errors).toEqual(expect.any(Array));
    });

    it("rejects an update missing the rocket name", async () => {
        const response = await request(app)
            .put(`${launchesEndpoint}/000000000000000000000001`)
            .set(authHeader)
            .send({ missionName: "Test Mission" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.errors).toEqual(expect.any(Array));
    });

    it("rejects a favorite update with a non-boolean value", async () => {
        const response = await request(app)
            .patch(`${launchesEndpoint}/000000000000000000000001/favorite`)
            .set(authHeader)
            .send({ favorite: "yes" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.errors).toEqual(expect.any(Array));
    });


    //JWT tests
    describe("launch write authorization", () => {
    it("rejects create without a token", async () => {
        const response = await request(app)
            .post(launchesEndpoint)
            .send({ missionName: "Test Mission", rocketName: "Falcon 9" });

        expect(response.status).toBe(401);
    });

    it("rejects update without a token", async () => {
        const response = await request(app)
            .put(`${launchesEndpoint}/000000000000000000000001`)
            .send({ missionName: "Test Mission", rocketName: "Falcon 9" });

        expect(response.status).toBe(401);
    });

    it("rejects favorite changes without a token", async () => {
        const response = await request(app)
            .patch(`${launchesEndpoint}/000000000000000000000001/favorite`)
            .send({ favorite: true });

        expect(response.status).toBe(401);
    });

    it("rejects deletion without a token", async () => {
        const response = await request(app)
            .delete(`${launchesEndpoint}/000000000000000000000001`);

        expect(response.status).toBe(401);
    });
});

describe("launch lifecycle", () => {
    it("creates, reads, updates, favorites, and deletes a launch", async () => {
        const createResponse = await request(app)
            .post(launchesEndpoint)
            .set(authHeader)
            .send({ missionName: "Integration Test Mission", rocketName: "Falcon 9" });

        expect(createResponse.status).toBe(201);
        const id = createResponse.body._id as string;

        const getResponse = await request(app).get(`${launchesEndpoint}/${id}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.missionName).toBe("Integration Test Mission");

        const updateResponse = await request(app)
            .put(`${launchesEndpoint}/${id}`)
            .set(authHeader)
            .send({
                missionName: "Updated Test Mission",
                rocketName: "Falcon Heavy",
            });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.missionName).toBe("Updated Test Mission");

        const favoriteResponse = await request(app)
            .patch(`${launchesEndpoint}/${id}/favorite`)
            .set(authHeader)
            .send({ favorite: true });

        expect(favoriteResponse.status).toBe(200);

        const deleteResponse = await request(app)
            .delete(`${launchesEndpoint}/${id}`)
            .set(authHeader);

        expect(deleteResponse.status).toBe(200);

        const missingResponse = await request(app).get(`${launchesEndpoint}/${id}`);
        expect(missingResponse.status).toBe(404);
    });
});

describe("GET /launches/upcoming", () => {
    it("excludes past launches and sorts upcoming launches by date", async () => {
        const prefix = `upcoming-test-${Date.now()}`;
        const now = Date.now();

        const [past, sooner, later] = await LaunchModel.create([
            {
                missionName: `${prefix}-past`,
                rocketName: "Test Rocket",
                date: new Date(now - 24 * 60 * 60 * 1000),
            },
            {
                missionName: `${prefix}-sooner`,
                rocketName: "Test Rocket",
                date: new Date(now + 24 * 60 * 60 * 1000),
            },
            {
                missionName: `${prefix}-later`,
                rocketName: "Test Rocket",
                date: new Date(now + 48 * 60 * 60 * 1000),
            },
        ]);

        try {
            const response = await request(app).get(`${launchesEndpoint}/upcoming`);
            expect(response.status).toBe(200);

            const ids = response.body.map((launch: { _id: string }) => launch._id);
            expect(ids).not.toContain(String(past._id));
            expect(ids).toContain(String(sooner._id));
            expect(ids).toContain(String(later._id));
            expect(ids.indexOf(String(sooner._id))).toBeLessThan(
                ids.indexOf(String(later._id)),
            );
        } finally {
            await LaunchModel.deleteMany({
                _id: { $in: [past._id, sooner._id, later._id] },
            });
        }
    });
});

});