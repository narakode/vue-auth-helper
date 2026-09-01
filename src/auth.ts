import { readonly, ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type User = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Meta = Record<string, any>;

export const _loggedIn = ref(false);
const _accessToken = ref<string | null>();
export const _user = ref<User | null>();
export const _meta = ref<Meta | null>();
export const _expiresAt = ref<number | null>();

export const loggedIn = readonly(_loggedIn);
export const accessToken = readonly(_accessToken);
export const user = readonly(_user);
export const meta = readonly(_meta);
export const expiresAt = readonly(_expiresAt);

export function init() {
  _loggedIn.value = localStorage.getItem('logged_in') === 'true';
}

export function login(
  accessToken: string,
  user: User,
  expiresAt?: number | Date | string,
  meta?: Meta,
) {
  _loggedIn.value = true;
  _accessToken.value = accessToken;
  _user.value = user;
  _meta.value = meta;
  _expiresAt.value = expiresAt ? new Date(expiresAt).valueOf() : null;

  localStorage.setItem('logged_in', `${_loggedIn.value}`);
}

export function logout() {
  _loggedIn.value = false;
  _accessToken.value = null;
  _user.value = null;
  _meta.value = null;

  localStorage.setItem('logged_in', `${_loggedIn.value}`);
}

export function isExpired(): boolean {
  return expiresAt.value ? expiresAt.value <= Date.now() : false;
}

export function setCurrentUser(user: User, meta?: Meta) {
  _user.value = user;

  if (meta) {
    _meta.value = meta;
  }
}
