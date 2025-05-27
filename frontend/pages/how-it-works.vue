<template>
    <main class="flex-1">
        <!--\ Hero Section -->
        <section
            class="py-12 md:py-16 flex items-center flex-col justify-center"
        >
            <div class="container px-4">
                <div class="mx-auto max-w-3xl text-center">
                    <h1
                        class="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                    >
                        How Incognito Works
                    </h1>
                    <p class="mb-8 text-xl text-gray-500">
                        A simple guide to anonymous messaging with complete
                        privacy
                    </p>
                    <!-- <div class="mx-auto max-w-2xl">
                        <div
                            class="aspect-video overflow-hidden rounded-xl border bg-card shadow-sm"
                        >
                            <div
                                class="flex h-full w-full items-center justify-center bg-black/5 p-4"
                            >
                                <div
                                    class="flex flex-col items-center gap-4 text-gray-500"
                                >
                                    <Icon
                                        name="lucide:play-circle"
                                        size="48"
                                        class="text-primary"
                                    />
                                    <span class="text-sm"
                                        >Watch how Incognito works</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>
        </section>

        <!-- Step by Step Process -->
        <section
            class="py-16 md:py-24 flex items-center flex-col justify-center"
        >
            <div class="container px-4">
                <h2 class="mb-12 text-center text-3xl font-bold">
                    Simple 3-Step Process
                </h2>
                <div
                    class="mx-auto grid max-w-5xl gap-12 md:grid-cols-3 items-start"
                >
                    <div
                        v-for="(step, index) in steps"
                        :key="index"
                        class="relative flex flex-col items-center text-center"
                    >
                        <div
                            class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-white"
                        >
                            <span class="text-2xl font-bold block">{{
                                index + 1
                            }}</span>
                        </div>
                        <h3 class="mb-2 text-xl font-medium">
                            {{ step.title }}
                        </h3>
                        <p class="text-gray-500 h-[72px]">
                            {{ step.description }}
                        </p>
                        <div
                            class="mt-6 rounded-lg border bg-card p-4 shadow-sm"
                        >
                            <img
                                :src="step.image"
                                :alt="step.title"
                                class="mx-auto rounded-md"
                            />
                        </div>
                        <template v-if="index < steps.length - 1">
                            <!-- Arrow connector (visible on mobile only) -->
                            <div
                                class="mt-8 flex h-8 w-8 items-center justify-center rounded-full border border-gray-3 00 bg-background md:hidden"
                            >
                                <Icon
                                    name="lucide:arrow-down"
                                    class="h-4 w-4"
                                />
                            </div>
                            <!-- Arrow connector (visible on desktop only) -->
                            <div
                                class="absolute -right-[7.5%] top-4 hidden translate-x-1/2 md:block"
                            >
                                <Icon
                                    name="lucide:arrow-right"
                                    class="h-8 w-8 text-gray-500"
                                />
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </section>

        <!-- Interactive Diagram -->
        <section
            class="py-16 md:py-24 flex items-center flex-col justify-center bg-gray-100/30"
        >
            <div class="container px-4">
                <div class="mx-auto max-w-3xl">
                    <h2 class="mb-4 text-center text-3xl font-bold">
                        How Anonymous Messaging Works
                    </h2>
                    <p class="mb-12 text-center text-gray-500">
                        Our platform ensures complete anonymity while delivering
                        your messages securely
                    </p>

                    <UCard class="p-6">
                        <div class="mx-auto max-w-2xl">
                            <!-- Simplified diagram of how the anonymity works -->
                            <div class="flex flex-col gap-8 justify-center">
                                <!-- Sender -->
                                <div class="flex items-center gap-4">
                                    <div
                                        class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10"
                                    >
                                        <Icon
                                            name="lucide:user"
                                            class="h-6 w-6 text-primary-500"
                                        />
                                    </div>
                                    <div
                                        class="flex-1 rounded-lg border border-gray-300 bg-background p-4"
                                    >
                                        <h4 class="font-medium">
                                            Message Sender
                                        </h4>
                                        <p class="text-sm text-gray-500">
                                            Sends a message through the
                                            anonymous link
                                        </p>
                                    </div>
                                </div>

                                <!-- Arrow down -->
                                <div class="flex justify-center">
                                    <Icon
                                        name="lucide:arrow-down"
                                        class="h-6 w-6 text-primary-500"
                                    />
                                </div>

                                <!-- Incognito Platform -->
                                <div class="flex items-center gap-4">
                                    <div
                                        class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10"
                                    >
                                        <Icon
                                            name="lucide:message-square"
                                            class="h-8 w-8 text-primary-500"
                                        />
                                    </div>
                                    <div
                                        class="flex-1 rounded-lg border border-gray-300 bg-background p-4"
                                    >
                                        <h4 class="font-medium">
                                            Incognito Platform
                                        </h4>
                                        <div
                                            class="mt-2 flex items-center gap-2 text-sm text-gray-500"
                                        >
                                            <Icon
                                                name="lucide:lock"
                                                class="h-4 w-4 text-primary-500"
                                            />
                                            <span
                                                >Strips identifying
                                                information</span
                                            >
                                        </div>
                                        <div
                                            class="mt-1 flex items-center gap-2 text-sm text-gray-500"
                                        >
                                            <Icon
                                                name="lucide:shield"
                                                class="h-4 w-4 text-primary-500"
                                            />
                                            <span
                                                >Encrypts message content</span
                                            >
                                        </div>
                                    </div>
                                </div>

                                <!-- Arrow down -->
                                <div class="flex justify-center">
                                    <Icon
                                        name="lucide:arrow-down"
                                        class="h-6 w-6 text-primary-500"
                                    />
                                </div>

                                <!-- Recipient -->
                                <div class="flex items-center gap-4">
                                    <div
                                        class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10"
                                    >
                                        <Icon
                                            name="lucide:user"
                                            class="h-6 w-6 text-primary-500"
                                        />
                                    </div>
                                    <div
                                        class="flex-1 rounded-lg border border-gray-300 bg-background p-4"
                                    >
                                        <h4 class="font-medium">
                                            Message Recipient
                                        </h4>
                                        <p class="text-sm text-gray-500">
                                            Receives the anonymous message in
                                            their inbox
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>
        </section>

        <!-- Features and Benefits -->
        <section
            class="py-16 md:py-24 flex items-center flex-col justify-center"
        >
            <div class="container px-4">
                <h2 class="mb-12 text-center text-3xl font-bold">
                    Features & Benefits
                </h2>
                <div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
                    <UCard class="p-0">
                        <div class="flex gap-4 p-6">
                            <div
                                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-500/10"
                            >
                                <Icon
                                    name="lucide:shield"
                                    class="h-6 w-6 text-primary-500"
                                />
                            </div>
                            <div>
                                <h3 class="mb-2 text-xl font-medium">
                                    Complete Anonymity
                                </h3>
                                <p class="text-gray-500">
                                    We never store IP addresses, device
                                    information, or any data that could identify
                                    message senders.
                                </p>
                            </div>
                        </div>
                    </UCard>

                    <UCard class="p-0">
                        <div class="flex gap-4 p-6">
                            <div
                                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-500/10"
                            >
                                <Icon
                                    name="lucide:lock"
                                    class="h-6 w-6 text-primary-500"
                                />
                            </div>
                            <div>
                                <h3 class="mb-2 text-xl font-medium">
                                    End-to-End Encryption
                                </h3>
                                <p class="text-gray-500">
                                    All messages are encrypted in transit and at
                                    rest, ensuring only you can read them.
                                </p>
                            </div>
                        </div>
                    </UCard>

                    <UCard class="p-0">
                        <div class="flex gap-4 p-6">
                            <div
                                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-500/10"
                            >
                                <Icon
                                    name="material-symbols:media-link-outline"
                                    class="h-6 w-6 text-primary-500"
                                />
                            </div>
                            <div>
                                <h3 class="mb-2 text-xl font-medium">
                                    Multimedia Messages
                                </h3>
                                <p class="text-gray-500">
                                    Receive anonymous text, voice, image, and
                                    video messages — because emotions aren’t
                                    always just words.
                                </p>
                            </div>
                        </div>
                    </UCard>

                    <UCard class="p-0">
                        <div class="flex gap-4 p-6">
                            <div
                                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-500/10"
                            >
                                <Icon
                                    name="material-symbols:delivery-truck-speed-outline-rounded"
                                    class="h-6 w-6 text-primary-500"
                                />
                            </div>
                            <div>
                                <h3 class="mb-2 text-xl font-medium">
                                    Fast & Simple Setup
                                </h3>
                                <p class="text-gray-500">
                                    Sign up in seconds. No friction, no
                                    confusion — just your inbox and your link.
                                </p>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section
            class="bg-gray-100 py-16 md:py-24 flex items-center flex-col justify-center"
        >
            <div class="container px-4">
                <div class="mx-auto max-w-3xl">
                    <h2 class="mb-12 text-center text-3xl font-bold">
                        Frequently Asked Questions
                    </h2>

                    <div class="space-y-6">
                        <UCard class="p-6">
                            <h3 class="mb-2 text-xl font-medium">
                                Is it really anonymous?
                            </h3>
                            <p class="text-gray-500">
                                Yes, we've designed our platform to ensure
                                complete anonymity. We don't collect or store
                                any identifying information from message
                                senders, including IP addresses, device
                                information, or cookies.
                            </p>
                        </UCard>

                        <UCard class="p-6">
                            <h3 class="mb-2 text-xl font-medium">
                                Can I reply to anonymous messages?
                            </h3>
                            <p class="text-gray-500">
                                Currently, direct replies aren't possible since
                                messages are completely anonymous. However, you
                                can post public responses on your profile that
                                everyone can see.
                            </p>
                        </UCard>

                        <UCard class="p-6">
                            <h3 class="mb-2 text-xl font-medium">
                                How do I prevent inappropriate messages?
                            </h3>
                            <p class="text-gray-500">
                                We are working on automatic content filtering
                                using AI to block offensive content.
                                Additionally, you can enable manual approval of
                                messages before they appear in your inbox, or
                                block specific words and phrases.
                            </p>
                        </UCard>

                        <UCard class="p-6">
                            <h3 class="mb-2 text-xl font-medium">
                                Can I delete my account and all data?
                            </h3>
                            <p class="text-gray-500">
                                Yes, you can delete your account and all
                                associated data at any time from your account
                                settings. Once deleted, all your data is
                                permanently removed from our servers.
                            </p>
                        </UCard>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section
            class="py-16 md:py-24 flex items-center flex-col justify-center"
        >
            <div class="container px-4">
                <div class="mx-auto max-w-3xl text-center">
                    <h2 class="mb-4 text-3xl font-bold">
                        Ready to get started?
                    </h2>
                    <p class="mb-8 text-xl text-gray-500">
                        Create your anonymous inbox in seconds and start
                        receiving messages
                    </p>
                    <div
                        class="flex flex-col gap-4 sm:flex-row sm:justify-center"
                    >
                        <NuxtLink to="/signup">
                            <UButton
                                size="xl"
                                class="gap-2 px-8 h-11"
                                to="/signup"
                            >
                                Create your inbox
                                <Icon
                                    name="lucide:arrow-right"
                                    class="h-4 w-4"
                                />
                            </UButton>
                        </NuxtLink>
                        <NuxtLink to="/login">
                            <UButton
                                variant="outline"
                                size="xl"
                                class="px-8 h-11"
                            >
                                Login to your account
                            </UButton>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
// Add SEO metadata
useSeoMeta({
    title: "How It Works",
    description:
        "Learn how Incognito works in 3 simple steps. Create your account, share your link, and start receiving anonymous text, images, audio, or video messages from anyone.",
    ogTitle: "How Incognito Works - Anonymous Messaging Platform",
    ogDescription:
        "Learn how Incognito works in 3 simple steps. Create your account, share your link, and start receiving anonymous text, images, audio, or video messages from anyone.",
    ogType: "website",
    ogUrl: `${useRuntimeConfig().public.siteDomain}/how-it-works`,
    ogImageAlt: "How Incognito Works - Anonymous Messaging Platform",
    twitterTitle: "How Incognito Works - Anonymous Messaging Platform",
    twitterDescription:
        "Learn how Incognito works in 3 simple steps. Create your account, share your link, and start receiving anonymous text, images, audio, or video messages from anyone.",
    twitterImageAlt: "How Incognito Works - Anonymous Messaging Platform",
});

const steps = [
    {
        title: "Create Your Account",
        description:
            "Sign up in seconds with just an email and password to get your personal anonymous inbox.",
        image: "/images/create_account.png",
    },
    {
        title: "Share Your Link",
        description:
            "Copy your unique link and share it on social media or directly with friends.",
        image: "/images/share_link.png",
    },
    {
        title: "Receive Messages",
        description:
            "Get notified when someone sends you an anonymous message and view it in your inbox.",
        image: "/images/receive_messages.png",
    },
];
</script>
