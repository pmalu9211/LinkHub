"use client";

import { PaginationDemo } from "@/components/Pagination";
import { CardDemo } from "@/components/PostCard";
import { SelectPost } from "@/components/SelectPost";
import { api } from "@/lib/axios";
import { serverApi } from "@/lib/clientApi";
import { Post } from "@/lib/types";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [sortBy, setSortBy] = useState("top");
  const [orderBy, setOrderBy] = useState("descending");
  const [data, setData] = useState([] as Post[]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchPost() {
      const res = await api.get(
        "/post/posts?page=" + page + "&sortBy=" + sortBy + "&orderBy=" + orderBy
      );
      console.log(res.data.totalPages);
      setTotalPages(res.data.totalPages);
      return res.data.posts;
    }
    fetchPost().then((data) => setData(data));
  }, [page, sortBy, orderBy]);
  return (
    <>
      <SelectPost setSortBy={setSortBy} setOrderBy={setOrderBy}></SelectPost>
      <div className="m-6 p-4">
        {data != null ? (
          data.map((post: Post) => (
            <CardDemo key={post.id} testPost={post}></CardDemo>
          ))
        ) : (
          <div> No posts yet</div>
        )}
      </div>
      <div className="mb-8">
        <PaginationDemo
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        ></PaginationDemo>
      </div>
    </>
  );
}
