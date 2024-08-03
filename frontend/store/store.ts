import { User } from "@/lib/types";
import { atom } from "recoil";

const profileState = atom({
  key: "profileState",
  default: {} as User | null,
});

export { profileState };
