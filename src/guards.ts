import type { NavigationGuard, Router } from 'vue-router';
import { loggedIn } from './auth';

export function createAuthGuard(
  options: { redirectOnUnauthenticated: string } = {
    redirectOnUnauthenticated: '/login',
  },
): NavigationGuard {
  return (to) => {
    if (to.matched.some((route) => route.meta.auth) && !loggedIn.value) {
      return {
        path: options.redirectOnUnauthenticated,
        query: to.query,
      };
    }
  };
}

export function createGuestGuard(
  options: { redirectOnAuthenticated: string } = {
    redirectOnAuthenticated: '/',
  },
): NavigationGuard {
  return (to) => {
    if (to.matched.some((route) => route.meta.guest) && loggedIn.value) {
      return options.redirectOnAuthenticated;
    }
  };
}

export function registerGuards(
  router: Router,
  options: {
    redirectOnUnauthenticated: string;
    redirectOnAuthenticated: string;
  },
) {
  router.beforeEach(
    createAuthGuard({
      redirectOnUnauthenticated: options.redirectOnUnauthenticated,
    }),
  );
  router.beforeEach(
    createGuestGuard({
      redirectOnAuthenticated: options.redirectOnAuthenticated,
    }),
  );
}
