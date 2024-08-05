"use client";

import { PaginationDemo } from "@/components/Pagination";
import { CardDemo } from "@/components/PostCard";
import { SelectPost } from "@/components/SelectPost";
import { api } from "@/lib/axios";
import { Post } from "@/lib/types";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { profileState } from "@/store/store";
import LoadingComp from "@/components/LoadingComp";
import { Toaster } from "sonner";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("top");
  const [orderBy, setOrderBy] = useState("descending");
  const [data, setData] = useState([] as Post[]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setUser] = useRecoilState(profileState);

  useEffect(() => {
    async function fetchPost(): Promise<Post[]> {
      try {
        setLoading(true);
        const res = await api.get(
          "/post/posts?page=" +
            page +
            "&sortBy=" +
            sortBy +
            "&orderBy=" +
            orderBy
        );
        console.log(res.data.totalPages);
        setTotalPages(res.data.totalPages);
        setLoading(false);
        return res.data.posts;
      } catch (e) {
        setLoading(false);
        console.log(e);
        return [
          {
            id: 0,
            title: "Something is going wrong, please ping me",
            link: "https://github.com/pmalu9211",
            userVote: 1,
            voteCount: 0,
            createdAt: "2020-01-01T00:00:00.000Z",
          },
        ];
      }
    }
    async function fetchUser() {
      try {
        const user = await api.get("/user/profile");

        return user.data.user;
      } catch (e) {
        console.log(e);
        return null;
      }
    }
    fetchUser().then((user) => setUser(user));
    fetchPost().then((data) => setData(data));
  }, [page, sortBy, orderBy]);

  return (
    <>
      {loading && <LoadingComp></LoadingComp>}
      <SelectPost setSortBy={setSortBy} setOrderBy={setOrderBy}></SelectPost>
      <div className="sm:mx-6 p-4">
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
