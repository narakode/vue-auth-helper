# Vue Auth Helper

A package that provides a ready-to-use authentication system for API-based applications.

> This package works seamlessly with [**Laravel FineAuth**](https://github.com/narakode/fineauth).

## What This Package Does

- Stores your authentication state in a global reactive state.
- Provides `auth` and `guest` route guards.
- Provides `login` and `logout` helpers.
- Tracks access token expiration.

## What This Package Does Not Do

- Create a login page.
- Implement the authentication request to your API server.
- Automatically attach the access token to request headers.
- Automatically refresh the access token.
- Automatically fetch the current user.

## Installation

Install the package.

```bash
npm install vue-auth-helper
```

Install it into your Vue application.

```js
import { createApp } from 'vue';
import vAuth from 'vue-auth-helper';

const app = createApp();

app.use(vAuth);
```

Register the route guards with your router instance.

- `redirectOnUnauthenticated` specifies the path to redirect unauthenticated users to.
- `redirectOnAuthenticated` specifies the path to redirect authenticated users to.

```js
import { createRouter } from 'vue-router';
import { registerGuards } from 'vue-auth-helper';

const router = createRouter();

registerGuards(router, {
  redirectOnUnauthenticated: '/login',
  redirectOnAuthenticated: '/',
});
```

## Guide

### Login

You must implement your own API login flow.

After a successful login, your API should return the following values, then call the `login` helper.

- `token` — a string.
- `user` — an object.
- `expires_at` _(optional)_ — a `Date`, date string, or timestamp.
- `meta` _(optional)_ — an object.

```js
import { login } from 'vue-auth-helper';

login(token, user, expires_at, meta);
```

> After logging in, you must manually redirect the user to the home or dashboard page.

### Protect Routes for Guests and Authenticated Users

Add `auth: true` to routes that require authentication.

```js
const router = createRouter([
  {
    path: '/',
    name: 'dashboard',
    meta: {
      auth: true,
    },
  },
]);
```

Add `guest: true` to routes that should only be accessible to guests.

```js
const router = createRouter([
  {
    path: '/login',
    name: 'login',
    meta: {
      guest: true,
    },
  },
]);
```

### Load Current User

The current user and meta are stored in memory, so they are cleared when the page is refreshed.

You need to call your API's **Get Current User** endpoint when the application loads, then call the `setCurrentUser` function the with new user and meta values.

```vue
<script setup>
import { setCurrentUser } from 'vue-auth-helper';

async function loadCurrentUser() {
  const { user, meta } = await functionToGetCurrentUser();

  setCurrentUser(user, meta);
}

loadCurrentUser();
</script>
```

### Refresh Token

The access token is stored in memory, so it is cleared when the page is refreshed.

You need to call your API's **Refresh Token** endpoint whenever the application loads, then call the `login` function the with new access token, user, expires at and meta values.

```vue
<script setup>
import { login } from 'vue-auth-helper';

async function refreshToken() {
  const { accessToken, user, meta } = await functionToRefreshToken();

  login(accessToken, user, expires_at, meta);
}

refreshToken();
</script>
```

### Check the Login State

```js
import { loggedIn } from 'vue-auth-helper';

loggedIn.value; // true | false
```

### Check Whether the Access Token Has Expired

```js
import { isExpired } from 'vue-auth-helper';

isExpired(); // true | false
```

### Access Token

```js
import { accessToken } from 'vue-auth-helper';

accessToken.value; // 'jdaosjdosa' | null
```

### Current User and Meta

Access the current user through the read-only `user` computed value.

Access the meta object through the read-only `meta` computed value.

```js
import { user, meta } from 'vue-auth-helper';

console.log(user.value);
console.log(meta.value);
```

### Logout

```js
import { logout } from 'vue-auth-helper';

logout();
```

> After logging out, you must manually redirect the user to `/login`.
