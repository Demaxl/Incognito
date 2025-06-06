<template>
    <main class="flex flex-1 items-center justify-center p-4 md:p-6">
        <UCard class="mx-auto w-full max-w-md py-2">
            <div class="flex flex-col space-y-2">
                <h2 class="text-3xl font-semibold leading-none tracking-tight">
                    Welcome back
                </h2>
                <p class="text-gray-500 text-sm">
                    Login to your account to view your messages
                </p>
            </div>
            <Form
                @submit="onSubmit"
                :validation-schema="schema"
                :initial-values="initialValues"
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
                                size="lg"
                                placeholder="Enter your username"
                                autofocus
                            />
                        </Field>

                        <ErrorMessage
                            name="username"
                            class="text-red-500 text-start block text-sm -mt-2"
                        />
                    </div>
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
                                placeholder="Enter your password"
                                :type="showPassword ? 'text' : 'password'"
                                :ui="{ trailing: 'pe-1' }"
                            >
                                <template #trailing>
                                    <UButton
                                        color="neutral"
                                        variant="link"
                                        size="sm"
                                        :icon="
                                            showPassword
                                                ? 'i-lucide-eye-off'
                                                : 'i-lucide-eye'
                                        "
                                        :aria-label="
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        "
                                        :aria-pressed="showPassword"
                                        aria-controls="password"
                                        @click="showPassword = !showPassword"
                                    />
                                </template>
                            </UInput>
                        </Field>
                        <ErrorMessage
                            name="password"
                            class="text-red-500 text-start block text-sm -mt-2"
                        />
                    </div>
                    <!-- <div class="text-right">
                        <ULink
                            href="/forgot-password"
                            class="text-sm text-primary-500 underline"
                            >Forgot password?</ULink
                        >
                    </div> -->
                </div>
                <div class="items-center mt-6 flex flex-col space-y-4">
                    <UButton
                        loading-auto
                        type="submit"
                        size="lg"
                        class="w-full block text-center"
                        label="Login"
                        :disabled="
                            !meta.dirty ||
                            !(meta.touched && meta.valid) ||
                            isSubmitting
                        "
                    />

                    <p class="text-center text-sm text-gray-500">
                        Don't have an account?
                        <ULink href="/signup" class="text-primary-500 underline"
                            >Sign up</ULink
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
    title: "Login",
    description:
        "Login to your Incognito account to manage your anonymous inbox and view your messages.",
    ogTitle: "Login to Incognito - Anonymous Messaging Platform",
    ogDescription:
        "Login to your Incognito account to manage your anonymous inbox and view your messages.",
    ogType: "website",
    ogImageAlt: "Login to Incognito - Anonymous Messaging Platform",
    twitterTitle: "Login to Incognito - Anonymous Messaging Platform",
    twitterDescription:
        "Login to your Incognito account to manage your anonymous inbox and view your messages.",
    twitterImageAlt: "Login to Incognito - Anonymous Messaging Platform",
    robots: "noindex, follow", // Prevent login page from being indexed
});

definePageMeta({
    middleware: ["no-auth"],
});
import { object, string } from "yup";

const showPassword = ref(false);

const initialValues = {
    username: "",
    password: "",
};

const schema = object({
    username: string().required("Required"),
    password: string().required("Required"),
});

async function onSubmit({ username, password }, { setErrors }) {
    const response = await useAuthStore().login(username, password);

    switch (response.status) {
        case 200:
        case 409:
            navigateTo("/dashboard");
            break;
        case 400:
            setErrors({
                username: "Invalid username or password",
            });
            break;
        default:
            break;
    }
}
</script>
