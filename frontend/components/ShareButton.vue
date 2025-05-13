<template>
    <UButton
        :color="color"
        :variant="variant"
        :ui="{
            base: 'hover:!bg-inverted/90',
        }"
        class="flex flex-col cursor-pointer text-white items-center justify-center gap-1 p-3 h-auto"
        :aria-label="ariaLabel"
        @click="shareFunction"
        :style="
            bgColor
                ? {
                      backgroundColor: bgColor,
                  }
                : {}
        "
    >
        <UIcon :name="icon" size="24" />
        <span class="text-sm hidden sm:block">{{ label }}</span>
    </UButton>
</template>

<script setup>
const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: "neutral",
    },
    variant: {
        type: String,
        default: "solid",
    },
    bgColor: {
        type: String,
    },
    ariaLabel: {
        type: String,
        default: (props) => `Share on ${props.label}`,
    },
    shareFunction: {
        type: Function,
        required: true,
    },
});
</script>
