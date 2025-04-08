<template>
    <div class="border-b border-b-gray-200 py-4 px-4 sm:px-6">
        <div class="flex flex-row items-center justify-between">
            <!-- Logo -->
            <nuxt-link class="flex items-center gap-2" to="/">
                <UIcon name="i-custom-logo" size="40" />
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
            <div class="hidden sm:flex sm:flex-row sm:gap-4">
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
                    label="Sign up"
                />
            </div>
        </div>

        <!-- Mobile Menu (collapsible) -->
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
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref } from "vue";

const isMenuOpen = ref(false);
const mobileMenu = ref(null);

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
