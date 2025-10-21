"use client"
import { LoginUserType, RegisterUserType } from "@/types/auth"
import { useForm, SubmitHandler } from "react-hook-form"
import { loginUser, registerUser } from "@/api/auth/auth"
import { useRouter } from "next/navigation"

export default function Page() {
    const router = useRouter()

    const {
        register: loginRegister,
        handleSubmit: handleLoginSubmit,
        watch: loginWatch,
        formState: { errors: loginErrors },
    } = useForm<LoginUserType>()
    const onLogin: SubmitHandler<LoginUserType> = async (data) => {
        try {
            await loginUser(data)
            router.replace('/')
        } catch (err: any) {
            alert(err.response?.data?.message || "Something went wrong")
        }
    }



    const {
        register: registerRegister,
        handleSubmit: handleRegisterSubmit,
        watch: registerWatch,
        formState: { errors: registerErrors },
    } = useForm<RegisterUserType>()
    const onRegister: SubmitHandler<RegisterUserType> = async (data) => {
        try {
            await registerUser(data)

        } catch (err: any) {
            alert(err.response?.data?.message || "Something went wrong")
        }
    }


    return (
        <main className="min-h-screen flex justify-center items-center flex-col gap-5">
            <h1 className="text-6xl">Welcome to Chat!</h1>
            <div className="bg-neutral-900 p-10 rounded-2xl flex gap-10 shadow-xl">

                <form onSubmit={handleRegisterSubmit(onRegister)} className="flex flex-col gap-4 w-80">
                    <h2 className="text-3xl text-violet-300 font-bold mb-4">Create account</h2>
                    <input
                        type="text"
                        {...registerRegister('name', { required: 'Name is required' })}
                        placeholder='John Doe'
                        className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400"
                    />
                    {registerErrors.name && <p className="text-red-500 text-sm">{registerErrors.name.message}</p>}
                    <input
                        type="email"
                        {...registerRegister('email', { required: 'Email is required' })}
                        placeholder='Email'
                        className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400"
                    />
                    {registerErrors.email && <p className="text-red-500 text-sm">{registerErrors.email.message}</p>}
                    <input
                        type="password"
                        {...registerRegister('password', { required: 'Password is required' })}
                        placeholder='Password'
                        className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400"
                    />
                    {registerErrors.password && <p className="text-red-500 text-sm">{registerErrors.password.message}</p>}
                    <button disabled={registerErrors.isSubmitting} className="mt-2 bg-violet-700 hover:bg-violet-600 text-white font-bold py-3 rounded-lg transition-colors" type="submit">
                        Sign up
                    </button>
                </form>

                <form onSubmit={handleLoginSubmit(onLogin)} className="flex flex-col gap-4 w-80">
                    <h2 className="text-3xl text-violet-300 font-bold mb-4">Or Sign in</h2>
                    <input
                        type="email"
                        {...loginRegister('email', { required: 'Email is required' })}
                        placeholder='Email'
                        className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400"
                    />
                    {loginErrors.email && <p className="text-red-500 text-sm">{loginErrors.email.message}</p>}
                    <input
                        type="password"
                        {...loginRegister('password', { required: 'Password is required' })}
                        placeholder='Password'
                        className="p-3 rounded-lg bg-neutral-800 text-white placeholder-gray-400"
                    />
                    {loginErrors.password && <p className="text-red-500 text-sm">{loginErrors.password.message}</p>}
                    <button disabled={loginErrors.isSubmitting} className="mt-2 bg-violet-700 hover:bg-violet-600 text-white font-bold py-3 rounded-lg transition-colors" type="submit">
                        Sign in
                    </button>
                </form>

            </div>
        </main>
    )
}
