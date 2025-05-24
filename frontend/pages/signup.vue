<template>
    <main class="flex flex-1 items-center justify-center p-4 md:p-6">
        <UCard class="mx-auto w-full max-w-md py-2">
            <div class="flex flex-col space-y-2">
                <h2 class="text-3xl font-semibold leading-none tracking-tight">
                    Create your account
                </h2>
                <p class="text-gray-500 text-sm">
                    Sign up to create your anonymous inbox and start receiving
                    messages
                </p>
            </div>
            <Form
                @submit="onSubmit"
                :validation-schema="schema"
                :initial-values="initialValues"
                class="mt-8"
                v-slot="{ isSubmitting, meta }"
            >
                <div class="pt-8 space-y-4">
                    <div class="space-y-2 flex flex-col">
                        <label
                            for="username"
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >Username</label
                        >
                        <Field name="username" v-slot="{ field }">
                            <UInput
                                v-bind="field"
                                class="block h-10"
                                color="primary"
                                variant="outline"
                                id="username"
                                size="lg"
                                placeholder="Choose a username"
                                autofocus
                            />
                        </Field>
                        <ErrorMessage
                            name="username"
                            class="text-red-500 text-start block text-sm -mt-2"
                        />
                    </div>
                    <!-- <div class="space-y-2 flex flex-col">
                        <label
                            for="email"
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >Email</label
                        >
                        <Field name="email" v-slot="{ field }">
                            <UInput
                                v-bind="field"
                                class="block h-10"
                                color="primary"
                                variant="outline"
                                id="email"
                                size="lg"
                                placeholder="Enter your email"
                            />
                        </Field>
                        <ErrorMessage
                            name="email"
                            class="text-red-500 text-start block text-sm -mt-2"
                        />
                    </div> -->
                    <div class="space-y-2 flex flex-col">
                        <label
                            for="password"
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >Password</label
                        >
                        <Field name="password" v-slot="{ field }">
                            <UInput
                                v-bind="field"
                                class="block h-10"
                                color="primary"
                                variant="outline"
                                id="password"
                                size="lg"
                                placeholder="Create a password"
                                :type="show ? 'text' : 'password'"
                                :ui="{ trailing: 'pe-1' }"
                            >
                                <template #trailing>
                                    <UButton
                                        color="neutral"
                                        variant="link"
                                        size="sm"
                                        :icon="
                                            show
                                                ? 'i-lucide-eye-off'
                                                : 'i-lucide-eye'
                                        "
                                        :aria-label="
                                            show
                                                ? 'Hide password'
                                                : 'Show password'
                                        "
                                        :aria-pressed="show"
                                        aria-controls="password"
                                        @click="show = !show"
                                    />
                                </template>
                            </UInput>
                        </Field>
                        <ErrorMessage
                            name="password"
                            class="text-red-500 text-start block text-sm -mt-2"
                        />
                    </div>
                    <div class="space-y-2 flex flex-col">
                        <label
                            for="password2"
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >Confirm Password</label
                        >
                        <Field name="password2" v-slot="{ field }">
                            <UInput
                                v-bind="field"
                                class="block h-10"
                                color="primary"
                                variant="outline"
                                id="password2"
                                size="lg"
                                placeholder="Confirm Password"
                                :type="show ? 'text' : 'password'"
                                :ui="{ trailing: 'pe-1' }"
                            >
                                <template #trailing>
                                    <UButton
                                        color="neutral"
                                        variant="link"
                                        size="sm"
                                        :icon="
                                            show
                                                ? 'i-lucide-eye-off'
                                                : 'i-lucide-eye'
                                        "
                                        :aria-label="
                                            show
                                                ? 'Hide password'
                                                : 'Show password'
                                        "
                                        :aria-pressed="show"
                                        aria-controls="password"
                                        @click="show = !show"
                                    />
                                </template>
                            </UInput>
                        </Field>
                        <ErrorMessage
                            name="password2"
                            class="text-red-500 text-start block text-sm -mt-2"
                        />
                    </div>
                </div>
                <div class="items-center mt-6 flex flex-col space-y-4">
                    <UButton
                        type="submit"
                        size="lg"
                        class="w-full block text-center"
                        label="Create account"
                        loading-auto
                        :disabled="
                            !meta.dirty ||
                            !(meta.touched && meta.valid) ||
                            isSubmitting
                        "
                    />

                    <p class="text-center text-sm text-gray-500">
                        Already have an account?
                        <ULink href="/login" class="text-primary-500 underline"
                            >Login</ULink
                        >
                    </p>
                </div>
            </Form>
        </UCard>
    </main>
</template>

<script setup>
// Add SEO metadata
useSeoMeta({
    title: "Create Account",
    description:
        "Create your Incognito account to start receiving anonymous messages. Sign up in seconds and get your personal anonymous inbox.",
    ogTitle: "Create Your Incognito Account - Anonymous Messaging Platform",
    ogDescription:
        "Create your Incognito account to start receiving anonymous messages. Sign up in seconds and get your personal anonymous inbox.",
    ogType: "website",
    robots: "noindex, follow", // Prevent signup page from being indexed
});

definePageMeta({
    middleware: ["no-auth"],
});
const show = ref(false);

import { object, string, ref as yupRef } from "yup";

const initialValues = {
    username: "",
    password: "",
    password2: "",
};

const schema = object({
    username: string()
        .required("Username is required")
        .matches(
            /^[a-zA-Z0-9_-]+$/,
            "Username can only contain letters, numbers, dashes, and underscores"
        )
        .min(3, "Username must be at least 3 characters")
        .max(10, "Username cannot be more than 10 characters"),
    // email: string().required("Email is required").email("Invalid email"),
    password: string()
        .required()
        .min(8, "Password must be at least 8 characters")
        .matches(/.*[^0-9].*/, "Password cannot be entirely numeric"),
    password2: string()
        .oneOf([yupRef("password"), null], "Passwords must match")
        .required("Confirm password is required"),
});

async function onSubmit({ username, password }, { setFieldError }) {
    const response = await useAuthStore().signup(username, password);

    switch (response.status) {
        case 200:
            navigateTo("/dashboard");
            break;
        case 400:
            for (const error of response.data.errors) {
                setFieldError(error.param, error.message);
            }
            break;
        default:
            break;
    }
}
</script>
