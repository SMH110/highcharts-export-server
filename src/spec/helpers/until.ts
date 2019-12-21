import { unlinkSync } from "fs";
export function unlinkFile(path: string) {
  try {
    unlinkSync(path);
  } catch (error) {}
}
