"use client";

import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Post } from "@/lib/types";
import { DownIcon, UpIcon } from "./elements/icons";
import { useState } from "react";
import useUpdateEffect from "@/hooks/useUpdateEffect";

// const testPost: Post = {
//   title: "test",
//   description: "more description",
//   link: "https://www.example.com",
//   votes: 9,
// };

const selectedVote = "bg-black text-white border-green-500 ";

type CardProps = React.ComponentProps<typeof Card>;

async function updateVotes(postId: number) {
  const res = await fetch(`/post/vote/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  console.log(data);
}

export function CardDemo(
  { testPost }: { testPost: Post },
  { className, ...props }: CardProps
) {
  const [votes, setVotes] = useState(testPost.votesVal);
  const [upVoted, setUpVoted] = useState(false);
  const [downVoted, setDownVoted] = useState(false);

  useUpdateEffect(() => {}, [votes]);

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
                    setDownVoted(false);
                    setUpVoted(true);
                    ++e;
                    return ++e;
                  } else if (upVoted) {
                    setUpVoted(false);
                    return --e;
                  } else {
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
                    --e;
                    return --e;
                  } else if (downVoted) {
                    setDownVoted(false);
                    return ++e;
                  } else {
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
