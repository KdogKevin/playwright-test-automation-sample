import { expect, type APIRequestContext } from '@playwright/test';

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
};

// Admin credentials published in the Restful Booker docs; that API is a public practice target.
const ADMIN = { username: 'admin', password: 'password123' };

export function newBooking(overrides: Partial<Booking> = {}): Booking {
  const stamp = Date.now().toString().slice(-6);
  return {
    firstname: `Ada${stamp}`,
    lastname: 'Tester',
    totalprice: 240,
    depositpaid: true,
    bookingdates: { checkin: '2027-03-10', checkout: '2027-03-14' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  async token(): Promise<string> {
    const res = await this.request.post('/auth', { data: ADMIN });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.token, 'auth should return a token').toBeTruthy();
    return body.token as string;
  }

  async create(booking: Booking): Promise<number> {
    const res = await this.request.post('/booking', { data: booking });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.booking).toMatchObject(booking);
    return body.bookingid as number;
  }

  get(id: number) {
    return this.request.get(`/booking/${id}`);
  }

  async update(id: number, booking: Booking, token?: string) {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }

  async remove(id: number, token: string) {
    return this.request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
  }
}
