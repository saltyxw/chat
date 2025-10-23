"use client"
import { LoginUserType, RegisterUserType } from "@/types/auth"
import { useForm, SubmitHandler } from "react-hook-form"
import { loginUser, registerUser } from "@/api/auth/auth"
import { useRouter } from "next/navigation"
import { Form } from "@/components/Form"

export default function Page() {
    const router = useRouter()

    const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors },
    } = useForm<LoginUserType>()

    const onLogin: SubmitHandler<LoginUserType> = async (data) => {
        try {
            await loginUser(data)
            router.replace('/chats')
        } catch (err: any) {
            alert(err.response?.data?.message || err)
        }
    }


    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors },
    } = useForm<RegisterUserType>()

    const onRegister: SubmitHandler<RegisterUserType> = async (data) => {
        try {
            await registerUser(data)
            router.replace('/chats')

        } catch (err: any) {
            alert(err.response?.data?.message || err)
        }
    }

    return (
        <main className="min-h-screen flex justify-center items-center flex-col gap-5 ">
            <h1 className="text-6xl">Welcome to Chat!</h1>
            <div className="bg-neutral-900 p-10 rounded-2xl flex gap-10 border-violet-800 border-1 ">
                <Form
                    title="Create new account"
                    onSubmit={onRegister}
                    handleSubmit={handleRegisterSubmit}
                    register={registerRegister}
                    errors={registerErrors}
                    submitText="Sign in"
                    fields={[
                        { name: "name", type: "text", placeholder: "John Doe" },
                        { name: "email", type: "email", placeholder: "Email" },
                        { name: "password", type: "password", placeholder: "Password" },
                    ]}
                />
                <Form
                    title="Or Sign in"
                    onSubmit={onLogin}
                    handleSubmit={handleLoginSubmit}
                    register={loginRegister}
                    errors={loginErrors}
                    submitText="Sign in"
                    fields={[
                        { name: "email", type: "email", placeholder: "Email" },
                        { name: "password", type: "password", placeholder: "Password" },
                    ]}
                />
            </div>
        </main>
    )
}
