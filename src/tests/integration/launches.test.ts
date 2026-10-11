import request from "supertest";
import { app } from "../../app";

describe('GET /launches', () => {

    it('returns all Rocket Launches', async () => {

        const response = await request(app)
            .get('/api/v1/launches');

        expect(response.status).toBe(200);

    });

});
