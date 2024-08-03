"use client";

import { cn } from "@/lib/utils";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Post } from "@/lib/types";
import { DownIcon, UpIcon } from "./elements/icons";
import { useState } from "react";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { api } from "@/lib/axios";

// const testPost: Post = {
//   title: "test",
//   description: "more description",
//   link: "https://www.example.com",
//   votes: 9,
// };

const selectedVote = "bg-black text-white border-green-500 ";

type CardProps = React.ComponentProps<typeof Card>;

async function voteHandler(value: number, id: number) {
  await api.put("/post/vote/" + id, { value: value });
}

export function CardDemo(
  { testPost }: { testPost: Post },
  { className, ...props }: CardProps
) {
  const [votes, setVotes] = useState(testPost.voteCount);
  const [upVoted, setUpVoted] = useState(testPost.userVote == 1);
  const [downVoted, setDownVoted] = useState(testPost.userVote == -1);

  return (
    <Card className={cn("w-full my-4", className)} {...props}>
      <div className="flex w-full justify-between">
        <CardHeader>
          <CardTitle>{testPost.title}</CardTitle>
          <a className="text-lg" href={testPost.link} target="_blank">
            {testPost.link}
          </a>
        </CardHeader>
        <CardFooter className="">
          <div className="flex gap-2 items-center m-1">
            <span
              onClick={() =>
                setVotes((e) => {
                  if (downVoted) {
                    voteHandler(1, testPost.id);
                    setDownVoted(false);
                    setUpVoted(true);
                    ++e;
                    return ++e;
                  } else if (upVoted) {
                    voteHandler(0, testPost.id);
                    setUpVoted(false);
                    return --e;
                  } else {
                    voteHandler(1, testPost.id);
                    setUpVoted(true);
                    return ++e;
                  }
                })
              }
              className={`border-2 border-gray-500 p-1 rounded-lg flex cursor-pointer ${
                upVoted && selectedVote
              } `}
            >
              <UpIcon />
            </span>
            <span
              onClick={() =>
                setVotes((e) => {
                  if (upVoted) {
                    setUpVoted(false);
                    setDownVoted(true);
                    voteHandler(-1, testPost.id);
                    --e;
                    return --e;
                  } else if (downVoted) {
                    voteHandler(0, testPost.id);
                    setDownVoted(false);
                    return ++e;
                  } else {
                    voteHandler(-1, testPost.id);
                    setDownVoted(true);
                    return --e;
                  }
                })
              }
              className={`border-2 border-gray-500 p-1 rounded-lg flex  
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
