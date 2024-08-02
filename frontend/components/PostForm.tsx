"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  link: z.string().min(8, {
    message: "Link must be at least 8 characters.",
  }),
});

const FormFieldWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full min-h-screen   justify-center items-center">
      <div className="p-8 m-4 min-w-[400px] border h-full border-gray-700 rounded-xl">
        {children}
      </div>
    </div>
  );
};

export function PostForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      link: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log("Form Data:", data);
    const response = await api.post("/post/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
  };

  return (
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
                {/* <FormDescription>
                This is your public display name.
                </FormDescription> */}
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
  );
}
