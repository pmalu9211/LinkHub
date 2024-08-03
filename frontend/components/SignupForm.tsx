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
import Link from "next/link";
import LoadingComp from "./LoadingComp";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string(),
  username: z.string().min(4, {
    message: "username must be at least 4 characters.",
  }),
  password: z.string().min(8, {
    message: "a strong password, minimum 8 characters",
  }),
});

const FormFieldWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full min-h-screen   justify-center items-center">
      <div className="p-3 sm:p-6 m-4 sm:min-w-[400px] border h-full border-gray-700 rounded-xl">
        {children}
      </div>
    </div>
  );
};

export function SignupForm() {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log("Form Data:", data);
    try {
      setLoading(true);
      const response = await api.post("/user/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Account created successfully.");
      push("/signin");
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl ml-3">name</FormLabel>
                  <FormControl className="text-md">
                    <Input placeholder="Not required" {...field} />
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
              name="username"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="text-2xl ml-3 ">username</FormLabel>
                  <FormControl className="text-md">
                    <Input placeholder="pmalu9211" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel className="text-2xl ml-3">password</FormLabel>
                  <FormControl className="text-md">
                    <Input type="password" placeholder="shushhhh" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
                </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link
              href={"/signin"}
              className="ml-4 mt-1 inline-block text-gray-300 cursor-pointer underline"
            >
              already registered?
            </Link>
            <div className="w-full">
              <Button
                className="block mx-auto w-[120px] text-lg h-10 mt-2"
                type="submit"
              >
                Sign Up
              </Button>
            </div>
          </FormFieldWrapper>
        </form>
      </Form>
    </>
  );
}
