<template>
    <div class="border-b border-b-gray-200 py-4 px-4 sm:px-6">
        <div class="flex flex-row items-center justify-between">
            <!-- Logo -->
            <nuxt-link class="flex items-center gap-2" to="/">
                <!-- <UIcon name="i-custom-logo" size="40" /> -->
                <img
                    src="/images/logo_icon_colored.png"
                    alt="Incognito logo"
                    class="w-10 h-10"
                />
                <span
                    class="text-2xl font-bold tracking-widest bg-gradient-to-r from-secondary to-primary-500 bg-clip-text text-transparent"
                    >Incognito</span
                >
            </nuxt-link>

            <!-- Mobile Toggle Button -->
            <button
                class="sm:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                @click="isMenuOpen = !isMenuOpen"
                aria-label="Toggle menu"
            >
                <UIcon v-if="!isMenuOpen" name="i-heroicons-bars-3" size="24" />
                <UIcon v-else name="i-heroicons-x-mark" size="24" />
            </button>

            <!-- Desktop Buttons (always visible on sm and up) -->
            <ClientOnly>
                <div class="hidden sm:flex sm:flex-row sm:gap-4">
                    <template v-if="!isAuthenticated">
                        <UButton
                            class="px-3 py-2 font-medium"
                            color="neutral"
                            variant="outline"
                            size="xl"
                            to="/login"
                            label="Login"
                        />
                        <UButton
                            class="px-3 py-2 font-medium"
                            size="xl"
                            to="/signup"
                            label="Create your inbox"
                        />
                    </template>
                    <template v-else>
                        <UButton
                            class="px-3 py-2 font-medium"
                            size="xl"
                            to="/dashboard"
                            label="View your inbox"
                        />
                        <UButton
                            class="px-3 py-2 font-medium"
                            color="neutral"
                            variant="outline"
                            size="xl"
                            to="/logout"
                            label="Logout"
                        />
                    </template>
                </div>
            </ClientOnly>
        </div>

        <!-- Mobile Menu (collapsible) -->
        <ClientOnly>
            <Transition
                name="expand"
                @enter="startTransition"
                @after-enter="endTransition"
                @before-leave="startTransition"
                @after-leave="endTransition"
            >
                <div
                    v-show="isMenuOpen"
                    class="sm:hidden overflow-hidden"
                    ref="mobileMenu"
                >
                    <div class="flex flex-col gap-2 py-2">
                        <template v-if="!isAuthenticated">
                            <UButton
                                class="px-3 py-2 font-medium w-full"
                                color="neutral"
                                variant="outline"
                                size="xl"
                                to="/login"
                                label="Login"
                            />
                            <UButton
                                class="px-3 py-2 font-medium w-full"
                                size="xl"
                                to="/signup"
                                label="Sign up"
                            />
                        </template>
                        <template v-else>
                            <UButton
                                class="px-3 py-2 font-medium w-full"
                                size="xl"
                                to="/dashboard"
                                label="View your inbox"
                            />
                            <UButton
                                class="px-3 py-2 font-medium w-full"
                                color="neutral"
                                variant="outline"
                                size="xl"
                                to="/logout"
                                label="Logout"
                            />
                        </template>
                    </div>
                </div>
            </Transition>
        </ClientOnly>
    </div>
</template>

<script setup>
const isMenuOpen = ref(false);
const mobileMenu = ref(null);

const isAuthenticated = computed(() => useAuthStore().isAuthenticated());

// Custom height transition that respects document flow
function startTransition(element) {
    // Set explicit height for transition
    element.style.height = "auto";
    const height = element.scrollHeight;
    element.style.height = "0px";

    // Force repaint
    element.offsetHeight;

    // Transition to the actual height
    element.style.height = `${height}px`;
}

function endTransition(element) {
    // Remove explicit height after transition
    element.style.height = "";
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
    transition: height 0.3s ease;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    height: 0 !important;
    overflow: hidden;
}
</style>
