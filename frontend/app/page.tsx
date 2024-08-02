import { CardDemo } from "@/components/PostCard";
import { api } from "@/lib/axios";
import { Post } from "@/lib/types";
import React from "react";

async function fetchPost() {
  const res = await api.get("/post/posts");
  console.log(res.data.res);

  return res.data.res;
}

export default async function Home() {
  const data = await fetchPost();
  return (
    <>
      <div className="m-6 p-4">
        {data.map((post: Post) => (
          <CardDemo testPost={post}></CardDemo>
        ))}
      </div>
    </>
  );
}
