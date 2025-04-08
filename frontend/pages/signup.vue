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
            <form>
                <div class="pt-8 space-y-4">
                    <div class="space-y-2 flex flex-col">
                        <label
                            for="username"
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >Username</label
                        >
                        <UInput
                            class="block h-10"
                            color="primary"
                            variant="outline"
                            id="username"
                            size="lg"
                            placeholder="Choose a username"
                            autofocus
                        />
                    </div>
                    <div class="space-y-2 flex flex-col">
                        <label
                            for="email"
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >Email</label
                        >
                        <UInput
                            class="block h-10"
                            color="primary"
                            variant="outline"
                            id="email"
                            size="lg"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div class="space-y-2 flex flex-col">
                        <label
                            for="password"
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >Password</label
                        >
                        <UInput
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
                                        show ? 'Hide password' : 'Show password'
                                    "
                                    :aria-pressed="show"
                                    aria-controls="password"
                                    @click="show = !show"
                                />
                            </template>
                        </UInput>
                    </div>
                </div>
                <div class="items-center mt-6 flex flex-col space-y-4">
                    <UButton
                        type="submit"
                        size="lg"
                        class="w-full block text-center"
                        label="Create account"
                    />

                    <p class="text-center text-sm text-gray-500">
                        Already have an account?
                        <ULink
                            href="/login"
                            class="text-primary underline text-black"
                            >Login</ULink
                        >
                    </p>
                </div>
            </form>
        </UCard>
    </main>
</template>

<script setup>
const show = ref(false);
</script>
