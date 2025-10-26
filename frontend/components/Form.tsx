"use client";

import { UseFormRegister, FieldErrors, UseFormHandleSubmit } from "react-hook-form";

interface FormProps<T> {
    title: string;
    onSubmit: (data: T) => void;
    handleSubmit: UseFormHandleSubmit<T>;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    fields: {
        name: keyof T;
        type: string;
        placeholder: string;
    }[];
    submitText: string;
}

export function Form<T>({
    title,
    onSubmit,
    handleSubmit,
    register,
    errors,
    fields,
    submitText,
}: FormProps<T>) {
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80 ">
            <h2 className="text-3xl  font-bold mb-4">{title}</h2>

            {fields.map((field) => (
                <div key={String(field.name)}>
                    <input
                        type={field.type}
                        {...register(field.name as any, { required: `${field.name} is required` })}
                        placeholder={field.placeholder}
                        className="p-3 rounded-lg bg-neutral-800 outline-violet-700  placeholder-gray-400 w-full"
                    />
                    {errors[field.name] && (
                        <p className="text-red-500 text-sm">{(errors[field.name] as any)?.message}</p>
                    )}
                </div>
            ))}

            <button
                className="mt-2 bg-violet-700 hover:bg-gradient-to-r from-violet-600 to-violet-400 text-white font-bold py-3 rounded-lg cursor-pointer  transition-all duration-1000"
                type="submit"
            >
                {submitText}
            </button>
        </form>
    );
}
