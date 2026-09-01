import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  _expiresAt,
  _loggedIn,
  accessToken,
  expiresAt,
  init,
  loggedIn,
  login,
  logout,
  meta,
  user,
  isExpired,
  _user,
  setCurrentUser,
  _meta,
} from './auth';

beforeEach(() => {
  vi.resetAllMocks();
  _loggedIn.value = false;
  _expiresAt.value = 0;
  _user.value = null;
  _meta.value = null;
});

describe('login', () => {
  describe('set logged in state', () => {
    test('sets in memory', () => {
      login('test', {});

      expect(loggedIn.value).toBe(true);
    });

    test('sets in local storage', () => {
      login('test', {});

      expect(localStorage.getItem('logged_in')).toBe('true');
    });
  });

  test('sets access token state', () => {
    const newAccessToken = 'test';

    login(newAccessToken, {});

    expect(accessToken.value).toBe(newAccessToken);
  });

  test('sets expiry state', () => {
    const newExpiry = Date.now() + 10000;

    login('test', {}, newExpiry);

    expect(expiresAt.value).toEqual(newExpiry);
  });

  test('sets user state', () => {
    const newUser = { id: 1, name: 'test' };

    login('test', newUser);

    expect(user.value).toEqual(newUser);
  });

  test('sets meta state', () => {
    const newMeta = { permissions: ['*'] };

    login('test', {}, 0, newMeta);

    expect(meta.value).toEqual(newMeta);
  });
});

describe('init', () => {
  test('sets logged in state from localstorage', () => {
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => 'true');

    init();

    expect(loggedIn.value).toEqual(true);
  });
});

describe('logout', () => {
  test('resets all states', () => {
    login('test', { id: 1 }, 0, { menus: [] });

    logout();

    expect(loggedIn.value).toBe(false);
    expect(user.value).toBe(null);
    expect(meta.value).toBe(null);
  });
  test('resets logged in local storage', () => {
    login('test', {});

    logout();

    expect(localStorage.getItem('logged_in')).toBe('false');
  });
});

describe('isExpired', () => {
  test('returns true when expired', () => {
    _expiresAt.value = Date.now() - 24 * 60 * 60 * 1000;

    expect(isExpired()).toBe(true);
  });
  test('returns false when not expired', () => {
    _expiresAt.value = Date.now() + 24 * 60 * 60 * 1000;

    expect(isExpired()).toBe(false);
  });
});

describe('setCurrentUser', () => {
  test('sets user state only', () => {
    login('test', { id: 1 }, 0, { menus: [] });

    const newUser = { name: 'test' };

    setCurrentUser(newUser);

    expect(user.value).toEqual(newUser);
    expect(meta.value).toEqual({ menus: [] });
  });
  test('sets user state and meta state', () => {
    login('test', { id: 1 }, 0, { menus: [] });

    const newUser = { name: 'test' };
    const newMeta = { menus: ['admin'] };

    setCurrentUser(newUser, newMeta);

    expect(user.value).toEqual(newUser);
    expect(meta.value).toEqual(newMeta);
  });
});
