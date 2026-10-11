import request from "supertest";
import { app } from "../../app";

describe("GET /ping", () => {
    it("should return This is the Web Programming 2 assignment!", async () => {
        const response = await request(app)
            .get("/ping");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message: "This is the Web Programming 2 assignment!"
        });
    });
});
