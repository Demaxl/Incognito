<template>
    <main class="flex-1 p-4 md:p-6">
        <div class="mx-auto max-w-md">
            <UCard>
                <div class="flex flex-col items-center text-center space-y-4">
                    <!-- Error Icon -->
                    <div
                        class="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10"
                    >
                        <Icon
                            name="lucide:alert-circle"
                            class="h-8 w-8 text-primary-500"
                        />
                    </div>

                    <!-- Error Title -->
                    <div class="space-y-2">
                        <h1
                            class="text-2xl font-semibold leading-none tracking-tight"
                        >
                            {{
                                error.statusCode === 404
                                    ? "Page Not Found"
                                    : "Something went wrong"
                            }}
                        </h1>
                        <p class="text-sm text-gray-500">
                            {{
                                error.statusMessage ||
                                "An unexpected error occurred"
                            }}
                        </p>
                    </div>

                    <!-- Action Buttons -->
                    <div
                        class="flex flex-col gap-2 w-full sm:flex-row sm:justify-center"
                    >
                        <UButton
                            color="primary"
                            size="lg"
                            class="w-full sm:w-auto"
                            @click="handleError"
                        >
                            Try again
                        </UButton>
                        <UButton
                            variant="outline"
                            size="lg"
                            to="/"
                            class="w-full sm:w-auto"
                        >
                            Go home
                        </UButton>
                    </div>
                </div>
            </UCard>
        </div>
    </main>
</template>

<script setup>
const error = useError();

function handleError() {
    clearError({ redirect: "/" });
}

// Add SEO metadata
useSeoMeta({
    title: error.value?.statusCode === 404 ? "Page Not Found" : "Error",
    description: error.value?.statusMessage || "An unexpected error occurred",
    ogTitle:
        error.value?.statusCode === 404
            ? "Page Not Found | Incognito"
            : "Error | Incognito",
    ogDescription: error.value?.statusMessage || "An unexpected error occurred",
    ogType: "website",
    ogImageAlt:
        error.value?.statusCode === 404
            ? "Page Not Found | Incognito"
            : "Error | Incognito",
    twitterTitle:
        error.value?.statusCode === 404
            ? "Page Not Found | Incognito"
            : "Error | Incognito",
    twitterDescription:
        error.value?.statusMessage || "An unexpected error occurred",
    twitterImageAlt:
        error.value?.statusCode === 404
            ? "Page Not Found | Incognito"
            : "Error | Incognito",
    robots: "noindex, follow", // Prevent error pages from being indexed
});
</script>
