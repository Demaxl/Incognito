<template>
    <main class="flex flex-col items-center px-3">
        <section class="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            <div
                class="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center"
            >
                <h1
                    class="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
                >
                    Get honest thoughts.

                    <span
                        class="text-primary-500 underline underline-offset-[12px]"
                        >Anonymously</span
                    >
                </h1>
                <p class="max-w-[700px] text-gray-500 md:text-xl">
                    Create your anonymous inbox, share your link, and receive
                    text, images, audio, or video messages from anyone — all
                    without revealing their identity.
                </p>
                <div class="flex flex-col gap-4 sm:flex-row">
                    <ClientOnly>
                        <UButton
                            size="xl"
                            trailing-icon="i-lucide-arrow-right"
                            :to="
                                useAuthStore().isAuthenticated()
                                    ? '/dashboard'
                                    : '/signup'
                            "
                            class="px-8 h-11"
                        >
                            {{
                                useAuthStore().isAuthenticated()
                                    ? "View"
                                    : "Create"
                            }}
                            your inbox
                        </UButton>
                    </ClientOnly>
                    <UButton
                        variant="outline"
                        size="xl"
                        to="/how-it-works"
                        class="px-8 h-11"
                    >
                        See how it works
                    </UButton>
                </div>
            </div>
        </section>
        <section class="container py-12 md:py-16">
            <div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
                <div class="flex flex-col items-center text-center">
                    <div
                        class="mb-4 rounded-full flex items-center bg-primary-500/10 p-4"
                    >
                        <UIcon name="ic:outline-forward-to-inbox" size="24" />
                    </div>
                    <h3 class="mb-2 text-xl font-medium">Create your inbox</h3>
                    <p class="text-muted-foreground">
                        Sign up in seconds and get your personal anonymous
                        inbox.
                    </p>
                </div>
                <div class="flex flex-col items-center text-center">
                    <div
                        class="mb-4 rounded-full flex items-center bg-primary-500/10 p-4"
                    >
                        <UIcon name="material-symbols:share" size="24" />
                    </div>
                    <h3 class="mb-2 text-xl font-medium">Share your link</h3>
                    <p class="text-muted-foreground">
                        Share your unique link on social media or with friends.
                    </p>
                </div>
                <div class="flex flex-col items-center text-center">
                    <div
                        class="mb-4 rounded-full flex items-center bg-primary-500/10 p-4"
                    >
                        <UIcon
                            name="material-symbols:android-messages-outline"
                            size="24"
                        />
                    </div>
                    <h3 class="mb-2 text-xl font-medium">Get real messages</h3>
                    <p class="text-muted-foreground">
                        Receive anonymous text, voice, image, or video messages
                        from anyone.
                    </p>
                </div>
            </div>
        </section>
    </main>
</template>
