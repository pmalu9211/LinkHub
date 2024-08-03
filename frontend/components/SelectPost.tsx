"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectPost({
  setSortBy,
  setOrderBy,
}: {
  setSortBy: (value: string) => void;
  setOrderBy: (value: string) => void;
}) {
  return (
    <>
      <div className=" flex gap-2 w-screen justify-start mt-8 ml-6  ">
        <Select onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="votes">Votes</SelectItem>
              <SelectItem value="time">Time</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setOrderBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Order by</SelectLabel>
              <SelectItem value="descending">Ascending</SelectItem>
              <SelectItem value="ascending">Descending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
