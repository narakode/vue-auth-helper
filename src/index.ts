import { init } from './auth';

export {
  accessToken,
  loggedIn,
  user,
  meta,
  login,
  logout,
  isExpired,
  setCurrentUser,
} from './auth';
export { registerGuards } from './guards';

export default {
  install: () => {
    init();
  },
};
