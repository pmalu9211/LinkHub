import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Post } from "@/lib/types";
import { DownIcon, UpIcon } from "./elements/icons";

const testPost: Post = {
  title: "test",
  description: "more description",
  link: "https://www.example.com",
};

type CardProps = React.ComponentProps<typeof Card>;

export function CardDemo({ className, ...props }: CardProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <div className="flex w-full justify-between">
        <CardHeader>
          <CardTitle>{testPost.title}</CardTitle>
          <a className="text-lg" href={testPost.link} target="_blank">
            {testPost.link}
          </a>
        </CardHeader>
        <CardFooter>
          <span className="border border-gray-500 p-1 rounded-lg flex ">
            <UpIcon />
            10
          </span>
          <span className="border border-gray-500 p-1 rounded-lg flex">
            <DownIcon />
            -10
          </span>
        </CardFooter>
      </div>
    </Card>
  );
}
