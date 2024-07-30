"use client";

import React from "react";
import { Button } from "./ui/button";

export const HelloButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const handleClick = () => {
    console.log("hello");
  };

  return <Button onClick={handleClick}>{children}</Button>;
};

export const GoodbyeButton: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const handleClick = () => {
    console.log("goodbye");
  };

  return <Button onClick={handleClick}>{children}</Button>;
};
