/**
 * Creates an admin account (or promotes / resets the password of an existing user).
 *
 *   npm run create-admin -- --username admin --password 'Str0ng!Pass' [--email admin@example.com]
 *
 * Admins log in on the normal /login page and are sent to /admin by their role.
 */
import bcrypt from "bcryptjs";
import { parseArgs } from "node:util";
import { pool } from "../config/db.js";
import { EMAIL_REGEX, SALT_ROUNDS, USERNAME_REGEX } from "../constants/auth.js";
import { upsertAdmin } from "../models/user.model.js";
import { getPasswordErrors } from "../utils/validators.js";

const { values } = parseArgs({
  options: {
    username: { type: "string" },
    password: { type: "string" },
    email: { type: "string" },
  },
});

const username = values.username?.trim() ?? "";
const password = values.password ?? "";
const email = values.email?.trim().toLowerCase() || null;

const problems: string[] = [];
if (!USERNAME_REGEX.test(username))
  problems.push("--username must be 3–30 characters: letters, numbers, _ or .");
const pwErrors = getPasswordErrors(password);
if (pwErrors.length) problems.push(`--password needs ${pwErrors.join(", ")}`);
if (email && !EMAIL_REGEX.test(email))
  problems.push("--email is not a valid email address");

if (problems.length) {
  console.error(problems.map((p) => `  • ${p}`).join("\n"));
  console.error(
    "\nUsage: npm run create-admin -- --username admin --password 'Str0ng!Pass' [--email you@example.com]",
  );
  process.exit(1);
}

try {
  const { user, created } = await upsertAdmin(
    username,
    await bcrypt.hash(password, SALT_ROUNDS),
    email,
  );
  console.log(
    `${created ? "Created" : "Updated"} admin "${user.username}" (id ${user.id}). Log in at /login.`,
  );
} catch (err) {
  console.error(
    "Could not create admin:",
    err instanceof Error ? err.message : err,
  );
  process.exitCode = 1;
} finally {
  try {
    await pool.end();
  } catch (err) {
    console.error(
      "Could not close the database pool:",
      err instanceof Error ? err.message : err,
    );
  }
}
