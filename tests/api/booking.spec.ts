import { test, expect } from '@playwright/test';
import { BookingClient, newBooking } from '../../src/api/bookings';

test.describe('booking api', () => {
  test('a booking can be created and read back', async ({ request }) => {
    const api = new BookingClient(request);
    const booking = newBooking();
    const id = await api.create(booking);

    const res = await api.get(id);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(booking);
  });

  test('a booking can be updated with a valid token', async ({ request }) => {
    const api = new BookingClient(request);
    const id = await api.create(newBooking());
    const token = await api.token();

    const changed = newBooking({ totalprice: 310, additionalneeds: 'Late checkout' });
    const res = await api.update(id, changed, token);
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(changed);
  });

  test('updating without a token is refused', async ({ request }) => {
    const api = new BookingClient(request);
    const id = await api.create(newBooking());

    const res = await api.update(id, newBooking({ totalprice: 1 }));
    expect(res.status()).toBe(403);
  });

  test('a deleted booking can no longer be read', async ({ request }) => {
    const api = new BookingClient(request);
    const id = await api.create(newBooking());
    const token = await api.token();

    const del = await api.remove(id, token);
    expect(del.ok()).toBeTruthy();
    expect((await api.get(id)).status()).toBe(404);
  });

  test('bad credentials do not return a token', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
    const body = await res.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  // Known defect in the practice API, kept as a living bug report:
  // a booking missing a required field should be rejected with 400, but the API returns 500.
  // test.fail() keeps CI green while the bug exists and turns red once it is fixed.
  test('a booking without a first name is rejected with 400', async ({ request }) => {
    test.fail(true, 'Practice API returns 500 instead of 400 for missing fields');
    const { firstname: _omit, ...missingName } = newBooking();
    const res = await request.post('/booking', { data: missingName });
    expect(res.status()).toBe(400);
  });
});
