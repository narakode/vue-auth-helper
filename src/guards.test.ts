import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createAuthGuard, createGuestGuard } from './guards';
import type { RouteLocationNormalized } from 'vue-router';
import { _loggedIn } from './auth';

beforeEach(() => (_loggedIn.value = false));

describe('auth', () => {
  describe('when require auth', () => {
    describe('when not logged in', () => {
      test('return unauthenticated path', () => {
        const to = {
          matched: [
            {
              meta: {
                auth: true,
              },
            },
          ],
        };

        const auth = createAuthGuard({ redirectOnUnauthenticated: '/login' });

        expect(
          auth(
            to as unknown as RouteLocationNormalized,
            {} as RouteLocationNormalized,
            vi.fn(),
          ),
        ).toEqual({ path: '/login' });
      });
      test('return unauthenticated path with query params', () => {
        const query = { a: 'xxx' };
        const to = {
          query,
          matched: [
            {
              meta: {
                auth: true,
              },
            },
          ],
        };

        const auth = createAuthGuard({ redirectOnUnauthenticated: '/login' });

        expect(
          auth(
            to as unknown as RouteLocationNormalized,
            {} as RouteLocationNormalized,
            vi.fn(),
          ),
        ).toEqual({ path: '/login', query });
      });
    });

    test('continue when logged in', () => {
      _loggedIn.value = true;

      const to = {
        matched: [
          {
            meta: {
              auth: true,
            },
          },
        ],
      };

      const auth = createAuthGuard();

      expect(
        auth(
          to as unknown as RouteLocationNormalized,
          {} as RouteLocationNormalized,
          vi.fn(),
        ),
      ).toBeUndefined();
    });
  });

  test('continue when not require auth', () => {
    const to = {
      matched: [],
    };

    const auth = createAuthGuard();

    expect(
      auth(
        to as unknown as RouteLocationNormalized,
        {} as RouteLocationNormalized,
        vi.fn(),
      ),
    ).toBeUndefined();
  });
});

describe('guest', () => {
  describe('when require guest', () => {
    test('return authenticated path when logged in', () => {
      _loggedIn.value = true;

      const to = {
        matched: [
          {
            meta: {
              guest: true,
            },
          },
        ],
      };

      const guest = createGuestGuard({ redirectOnAuthenticated: '/home' });

      expect(
        guest(
          to as unknown as RouteLocationNormalized,
          {} as RouteLocationNormalized,
          vi.fn(),
        ),
      ).toEqual('/home');
    });

    test('continue when not logged in', () => {
      const to = {
        matched: [
          {
            meta: {
              guest: true,
            },
          },
        ],
      };

      const guest = createGuestGuard();

      expect(
        guest(
          to as unknown as RouteLocationNormalized,
          {} as RouteLocationNormalized,
          vi.fn(),
        ),
      ).toBeUndefined();
    });
  });

  test('continue when not require guest', () => {
    _loggedIn.value = true;

    const to = {
      matched: [],
    };

    const guest = createGuestGuard();

    expect(
      guest(
        to as unknown as RouteLocationNormalized,
        {} as RouteLocationNormalized,
        vi.fn(),
      ),
    ).toBeUndefined();
  });
});
