"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "./elements/icons";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { profileState } from "@/store/store";
import { useRecoilState, useRecoilValue } from "recoil";
import { api } from "@/lib/axios";
import { useState } from "react";
import { toast } from "sonner";
import { ModeToggle } from "./toggle";

export default function Navbar() {
  const { push } = useRouter();
  const pathname = usePathname().split("/")[1];
  const [user, setUser] = useRecoilState(profileState);
  const [loading, setLoading] = useState(false);
  return (
    <nav className="fixed h-20 inset-x-0 top-0 z-30 bg-white dark:bg-gray-950/90 flex items-center shadow-lg dark:shadow-zinc-800">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex  h-14 items-center">
          <Link
            href={"/"}
            className="flex items-center mx-2 sm:mx-8"
            prefetch={false}
          >
            <LinkIcon height="45px" />
          </Link>
          {!pathname && (
            <div className="ml-auto">
              <Link
                href={"/post"}
                className="font-semibold text-md sm:text-xl transition-colors hover:bg-blue-200 hover:shadow-lg bg-blue-400 px-4 py-2 rounded-lg "
                prefetch={false}
              >
                Post
              </Link>
            </div>
          )}
          <div className="ml-auto items-center gap-4 flex">
            {user ? (
              <Button
                size="md"
                onClick={() => {
                  setUser(null);
                  try {
                    setLoading(true);
                    api.post("/user/logout");
                    toast.success("Logged out successfully");
                    push("/signin");
                    setLoading(false);
                  } catch (e) {
                    toast.error("Unable to logout");
                    console.log(e);
                    setLoading(false);
                  }
                }}
              >
                Log out
              </Button>
            ) : (
              <Button size="md" onClick={() => push("/signin")}>
                Sign In
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
