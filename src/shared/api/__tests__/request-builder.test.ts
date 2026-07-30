import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../http-client';

beforeEach(() => {
  vi.restoreAllMocks();
});

function mockFetch(response: unknown) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(response),
  } as Response);
}

describe('api.get', () => {
  it('builds query string with non-empty values', async () => {
    const fetchSpy = mockFetch([]);
    await api.get('/test', { page: 1, status: 'Active', empty: '', nullVal: null });

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain('page=1');
    expect(calledUrl).toContain('status=Active');
    expect(calledUrl).not.toContain('empty=');
    expect(calledUrl).not.toContain('nullVal=');
  });

  it('omits query string when all params are empty', async () => {
    const fetchSpy = mockFetch([]);
    await api.get('/test', { a: undefined, b: null, c: '' });

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).not.toContain('?');
  });

  it('handles boolean params', async () => {
    const fetchSpy = mockFetch([]);
    await api.get('/test', { is_available: true });

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toBe('/test?is_available=true');
  });

  it('sends GET by default', async () => {
    const fetchSpy = mockFetch([]);
    await api.get('/test');

    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe('GET');
  });
});

describe('api.post', () => {
  it('sends POST with JSON body', async () => {
    const fetchSpy = mockFetch({ id: 1 });
    const body = { price: 1000 };
    await api.post('/test', body);

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('/test');
    expect((init as RequestInit).method).toBe('POST');
    expect((init as RequestInit).headers).toEqual({ 'Content-Type': 'application/json' });
    expect((init as RequestInit).body).toBe(JSON.stringify(body));
  });

  it('returns parsed response', async () => {
    mockFetch({ id: 1, price: 1000 });
    const result = await api.post<{ id: number }>('/test', { price: 1000 });
    expect(result.id).toBe(1);
  });
});

describe('error handling', () => {
  it('throws structured error on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ detail: [{ field: 'price', message: 'Error' }] }),
    } as Response);

    await expect(api.get('/test')).rejects.toMatchObject({
      status: 422,
      body: { detail: [{ field: 'price', message: 'Error' }] },
    });
  });

  it('throws with empty body if json parsing fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('Not JSON')),
    } as Response);

    await expect(api.get('/test')).rejects.toMatchObject({
      status: 500,
      body: {},
    });
  });
});