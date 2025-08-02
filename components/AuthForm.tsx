"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import FormField from "./FormField"
import { toast } from "sonner"

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(4)
  })
}

const AuthForm = ({ type } : { type : FormType }) => {
  const router = useRouter()

  const formSchema = authFormSchema(type)

  // 1. Define the form schema using Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Handle form submission
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        // Firebase sign up logic
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password
        });

        if(!result?.success) {
          toast.error(result?.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.")
        router.push("/sign-in")
      } else {
        // Sign in logic
        const { email, password } = data

        // Authenticate user(returns userCredential object if sign-in is successful)
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Retrieves a short-lived ID token for the signed-in user.
        const idToken = await userCredential.user.getIdToken()
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.")
          return;
        }

        await signIn({ email, idToken })

        toast.success('Signed in successfully.')
        // router.refresh(); // Ensures server layout re-reads cookies
        router.push("/")
      }
    } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          toast.error("This email is already in use.");
        } else if (error.code === "auth/invalid-login-credentials") {
          toast.error("Invalid email or password.");
        } else {
          console.error(error);
          toast.error("There was an error. Please try again.");
        }
    }
  }

  const isSignIn = type === 'sign-in'

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">NailIt</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            { !isSignIn && (
              <FormField
                control={form.control}
                name='name'
                label="Name"
                placeholder="Your Name"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
            
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            
            <Button className="btn" type="submit">{ isSignIn ? 'Sign In' : 'Create an Account' }</Button>
          </form>
        </Form>
        
        <p className="text-center">
          { isSignIn ? 'No account yet?' : 'Already have an account?'}
          <Link href={isSignIn ? '/sign-up' : '/sign-in'} className="text-user-primary font-bold ml-1">
            {isSignIn ? 'Create account' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm