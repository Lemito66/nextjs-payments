"use client";

import { Button, Card, Input, Label } from "@/components/ui";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return;
    }

    const resSignin = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (resSignin?.error) {
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <Card>
      <form onSubmit={onSubmit} className="flex flex-col gap-y-2">
        <h3 className="text-2xl font-bold text-center mb-4">Register</h3>

        <div className="flex gap-x-2">
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Name"
              {...register("name")}
              autoFocus
            />
            {errors.name && (
              <p className="text-red-500 text-xs">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div>
            <Label>Lastname</Label>
            <Input
              type="text"
              placeholder="Lastname"
              {...register("lastname")}
            />
            {errors.lastname && (
              <p className="text-red-500 text-xs">
                {errors.lastname.message as string}
              </p>
            )}
          </div>
        </div>

        <Label>Email</Label>
        <Input type="email" placeholder="Email" {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-xs">
            {errors.email.message as string}
          </p>
        )}

        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-xs">
            {errors.password.message as string}
          </p>
        )}

        <Button className="block mt-2 w-full" type="submit">
          Register
        </Button>
      </form>

      <p className="mt-4">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-500">
          Login
        </Link>
      </p>
    </Card>
  );
}

export default RegisterForm;
