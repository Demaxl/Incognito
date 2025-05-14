<template>
    <Transition
        enter-active-class="animate__animated animate__fadeIn animate__faster"
        leave-active-class="animate__animated animate__fadeOut animate__faster"
    >
        <div
            v-show="modelValue"
            class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            @click="close"
        >
            <OnClickOutside @trigger="close">
                <img
                    :src="sanitizedSrc"
                    class="max-w-full max-h-[90vh] object-contain"
                    :alt="sanitizedAlt"
                />
            </OnClickOutside>
            <button
                @click="close"
                class="absolute top-4 z-50 right-4 cursor-pointer text-white hover:text-gray-300 transition-colors"
            >
                <Icon name="material-symbols:close-rounded" size="24px" />
            </button>
        </div>
    </Transition>
</template>

<script setup>
import { OnClickOutside } from "@vueuse/components";
import { sanitizeUrl, sanitizeText } from "~/utils/sanitize";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    src: {
        type: String,
        required: true,
    },
    alt: {
        type: String,
        default: "Full Screen Image",
    },
});

const emit = defineEmits(["update:modelValue"]);

// Sanitize content and text
const sanitizedSrc = computed(() => sanitizeUrl(props.src));
const sanitizedAlt = computed(() => sanitizeText(props.alt));

const close = () => {
    emit("update:modelValue", false);
};
</script>
