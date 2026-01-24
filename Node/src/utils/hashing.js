import { hash, compare } from "bcryptjs";
import { createHmac } from "crypto";

const doHashing = (value, saltValue) => {
  const result = hash(value, saltValue);
  return result;
};

const doHashValidation = (value, hashedValue) => {
  const result = compare(value, hashedValue);
  return result;
};

const hmacProcess = (value, key) => {
  const result = createHmac("sha256", key).update(value).digest("hex");
  return result;
};
export { doHashing, doHashValidation, hmacProcess };
