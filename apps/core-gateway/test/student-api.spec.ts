
import * as request from 'supertest';
import * as express from 'express';
import studentProfileRouter from '../src/routes/students/profile';
import studentHackathonsRouter from '../src/routes/students/hackathons';
import studentTeamsRouter from '../src/routes/students/teams';

const app = express();
app.use(express.json());
app.use('/api/v1/students', studentProfileRouter);
app.use('/api/v1/students/hackathons', studentHackathonsRouter);
app.use('/api/v1/students/teams', studentTeamsRouter);

describe('Student API Routes', () => {
  test('GET /api/v1/students/profile should return 401 without auth', async () => {
    const res = await request(app).get('/api/v1/students/profile');
    expect(res.status).toBe(401); 
  });

  test('GET /api/v1/students/hackathons should return 401 without auth', async () => {
    const res = await request(app).get('/api/v1/students/hackathons');
    expect(res.status).toBe(401);
  });
});
