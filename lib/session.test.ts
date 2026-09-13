import test from 'node:test';
import assert from 'node:assert/strict';

import { reconcileUserSession } from './session';

test('prefers the user matching the email cookie when uid is stale', () => {
  const result = reconcileUserSession({
    uid: 'old-user',
    email: 'paid@example.com',
    userByEmail: { 'paid@example.com': 'new-user' },
  });

  assert.equal(result, 'new-user');
});

test('keeps the current uid when there is no email cookie to reconcile', () => {
  const result = reconcileUserSession({
    uid: 'existing-user',
    email: null,
    userByEmail: {},
  });

  assert.equal(result, 'existing-user');
});
