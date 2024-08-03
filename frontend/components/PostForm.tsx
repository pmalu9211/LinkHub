"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { set, z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingComp from "./LoadingComp";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  link: z
    .string()
    .min(8, {
      message: "Link must be at least 8 characters.",
    })
    .url("Link must be a valid URL."),
});

const FormFieldWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full min-h-screen   justify-center items-center">
      <div className="sm:p-8 p-3 m-4 sm:min-w-[400px] border h-full border-gray-700 rounded-xl">
        {children}
      </div>
    </div>
  );
};

export function PostForm() {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      link: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      console.log("Form Data:", data);
      const response = await api.post("/post/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Post created");
      push("/");
      console.log(response);
      setLoading(false);
    } catch (e: any) {
      toast.error(e.response.data.message);
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingComp />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormFieldWrapper>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl ml-3">Title</FormLabel>
                  <FormControl className="text-md">
                    <Input placeholder="Mastercard Hackthon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="text-2xl ml-3 ">Link</FormLabel>
                  <FormControl className="text-md">
                    <Input
                      placeholder="https://careers.mastercard.com/us/en/mastercard-india-campus-code-for-change-hackathon"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full">
              <Button
                className="block mx-auto w-20 text-lg h-10 mt-4"
                type="submit"
              >
                Post
              </Button>
            </div>
          </FormFieldWrapper>
        </form>
      </Form>
    </>
  );
}
