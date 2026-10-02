import test from "node:test";
import assert from "node:assert/strict";

import {
  readRegisteredUsers,
  saveRegisteredUsers,
  updateUserPassword,
} from "./authStorage.mjs";

test("readRegisteredUsers returns stored users", async () => {
  const storage = {
    async getItem() {
      return JSON.stringify([
        { email: "demo@example.com", password: "oldpass" },
      ]);
    },
    async setItem() {},
  };

  const users = await readRegisteredUsers(storage);

  assert.deepEqual(users, [{ email: "demo@example.com", password: "oldpass" }]);
});

test("updateUserPassword replaces the saved password for an email", async () => {
  const storage = {
    data: JSON.stringify([
      { email: "demo@example.com", password: "oldpass" },
      { email: "other@example.com", password: "keepme" },
    ]),
    async getItem() {
      return this.data;
    },
    async setItem(key, value) {
      this.data = value;
    },
  };

  const updated = await updateUserPassword("demo@example.com", "newpass", storage);

  assert.equal(updated, true);
  const users = await readRegisteredUsers(storage);
  assert.equal(users[0].password, "newpass");
  assert.equal(users[1].password, "keepme");
});

test("saveRegisteredUsers stores users in order", async () => {
  const storage = {
    data: "[]",
    async getItem() {
      return this.data;
    },
    async setItem(key, value) {
      this.data = value;
    },
  };

  const users = [{ email: "a@test.com", password: "123456" }];
  const result = await saveRegisteredUsers(users, storage);

  assert.equal(result, true);
  assert.deepEqual(await readRegisteredUsers(storage), users);
});
