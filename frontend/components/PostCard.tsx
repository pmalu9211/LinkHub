"use client";

import date from "date-and-time";
import { cn } from "@/lib/utils";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Post } from "@/lib/types";
import { DownIcon, UpIcon } from "./elements/icons";
import { useState } from "react";
import { api } from "@/lib/axios";
import { date as zodDate } from "zod";
import convert from "@/lib/time";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const selectedVote = "bg-black text-white border-from-blue-600 ";

type CardProps = React.ComponentProps<typeof Card>;

export function CardDemo(
  { testPost }: { testPost: Post },
  { className, ...props }: CardProps
) {
  const { push } = useRouter();
  const [votes, setVotes] = useState(testPost.voteCount);
  const [upVoted, setUpVoted] = useState(testPost.userVote == 1);
  const [downVoted, setDownVoted] = useState(testPost.userVote == -1);

  async function voteHandler(value: number, id: number) {
    try {
      await api.put("/post/vote/" + id, { value: value });
    } catch (e: any) {
      toast.error(e.response.data.message);
      push("/signin");
      console.log(e);
    }
  }

  return (
    <Card className={cn("w-full my-4 ", className)} {...props}>
      <div className="flex flex-col sm:flex-row w-full justify-between">
        <CardHeader>
          <div className="text-xs text-slate-500">
            {" "}
            {convert(testPost.createdAt)}
          </div>
          <CardTitle>{testPost.title}</CardTitle>
          <div className=" max-w-[80vw] sm:max-w-[55vw] md:max-w-[62vw] overflow-hidden text-ellipsis max-h-[250px] text-sm text-blue-600 underline">
            <a href={testPost.link} target="_blank" className="break-words">
              {testPost.link}
            </a>
          </div>
          {/* {testPost.link}
          </a> */}
        </CardHeader>
        <div className="w-full  border-t-2 border-stone-300 sm:border-white mb-4"></div>
        <CardFooter className="">
          <div className=" flex gap-2 items-center  ml-auto">
            <span
              onClick={() => {
                if (downVoted) {
                  voteHandler(1, testPost.id);
                  setDownVoted(false);
                  setUpVoted(true);
                  setVotes((e) => {
                    ++e;
                    return ++e;
                  });
                } else if (upVoted) {
                  voteHandler(0, testPost.id);
                  setUpVoted(false);
                  setVotes((e) => {
                    return --e;
                  });
                } else {
                  voteHandler(1, testPost.id);
                  setUpVoted(true);
                  setVotes((e) => {
                    return ++e;
                  });
                }
              }}
              className={`border-2 border-blue-400 p-1 rounded-lg flex cursor-pointer ${
                upVoted && selectedVote
              } `}
            >
              <UpIcon />
            </span>
            <span
              onClick={() => {
                if (upVoted) {
                  setUpVoted(false);
                  setDownVoted(true);
                  voteHandler(-1, testPost.id);
                  setVotes((e) => {
                    --e;
                    return --e;
                  });
                } else if (downVoted) {
                  voteHandler(0, testPost.id);
                  setDownVoted(false);
                  setVotes((e) => {
                    return ++e;
                  });
                } else {
                  voteHandler(-1, testPost.id);
                  setDownVoted(true);
                  setVotes((e) => {
                    return --e;
                  });
                }
              }}
              className={`border-2 border-blue-400 p-1 rounded-lg flex  
                 cursor-pointer ${downVoted && selectedVote} `}
            >
              <DownIcon />
            </span>
            <span className="w-6">{votes}</span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
