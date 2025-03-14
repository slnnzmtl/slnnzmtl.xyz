<template>
  <GlassMaterial
    v-if="isGridLayout"
    class="project-card flex flex-col relative radius-md overflow-hidden"
    :class="[activeClass, scrollableClass]"
    @click="onCardClick"
  >
    <div class="project-card__image">
      <div v-if="isImageLoading" class="image-loader shimmer"></div>
      <img
        :src="project?.cover"
        :alt="project?.title"
        :class="{ 'image-loaded': !isImageLoading }"
        @load="handleImageLoad"
      />
    </div>

    <div class="project-card__content flex flex-col gap-4 p-4 text-left">
      <h1 class="project-card__title">
        {{ project?.title }}
      </h1>
      <p class="project-card__description text-sm sm:text-base">
        {{ project?.description }}
      </p>

      <TagsBar :tags="project?.tags" :selected-filters="selectedFilters" />

      <div v-if="active" class="mt-6">
        <slot :active="active" />
      </div>

      <div class="flex h-full items-end">
        <span v-if="!active" class="project-card__link">
          Read more
          <span class="project-card__link-arrow">→</span>
        </span>
      </div>
    </div>
  </GlassMaterial>

  <GlassMaterial
    v-else
    :class="`project-card project-card--list relative radius-md overflow-hidden p-4 ${activeClass}`"
    @click="onCardClick"
  >
    <div class="flex gap-4">
      <div class="project-card__image">
        <div v-if="isImageLoading" class="image-loader shimmer"></div>
        <img
          :src="project?.cover"
          :alt="project?.title"
          :class="{ 'image-loaded': !isImageLoading }"
          @load="handleImageLoad"
        />
      </div>

      <div class="flex flex-col gap-2 justify-around flex-grow">
        <h2 class="project-card__title">
          {{ project?.title }}
        </h2>

        <TagsBar :tags="project?.tags" :selected-filters="selectedFilters" />
      </div>
    </div>

    <div class="project-card__content">
      <p class="project-card__description text-sm sm:text-base py-4">
        {{ project?.description }}
      </p>
    </div>
  </GlassMaterial>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import type { Project } from "@/stores/projectTypes";
import GlassMaterial from "@/components/ui/GlassMaterial.vue";
import TagsBar from "@/components/Tags/TagsBar.vue";

export default defineComponent({
  name: "ProjectCard",
  components: {
    GlassMaterial,
    TagsBar,
  },
  props: {
    project: {
      type: Object as () => Project,
      required: true,
    },
    selectedFilters: {
      type: Array<string>,
      required: true,
    },
    layout: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["click", "close"],
  setup(props, { emit }) {
    const isImageLoading = ref(true);

    const isGridLayout = computed(
      () => props.layout === "grid" || props.layout === "scroll",
    );

    const scrollableClass = computed(() => {
      return props.layout === "scroll" ? "scrollable" : "";
    });

    const activeClass = computed(() => {
      return props.active ? "active" : "";
    });

    const handleImageLoad = () => {
      isImageLoading.value = false;
    };

    const onCardClick = () => {
      if (props.active) {
        onClose();
      } else {
        emit("click");
      }
    };

    const onClose = () => {
      emit("close");
    };

    return {
      isImageLoading,
      isGridLayout,
      activeClass,
      handleImageLoad,
      onClose,
      onCardClick,
      scrollableClass,
    };
  },
});
</script>

<style scoped lang="scss">
:root {
  --card-transition: 0.3s ease;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
}

.project-card {
  cursor: pointer;
  height: 100%;

  width: 100%;

  @media (min-width: 768px) {
    width: calc(100% / 2 - 1rem);
  }

  &.scrollable {
    min-width: calc(100% / 3 - 1rem);
    height: max-content;
    flex-shrink: 0;
    max-width: 300px;
  }

  &:hover {
    transform: translateY(-5px);

    .project-card__link-arrow {
      transform: translateX(5px);
    }
  }

  &:active {
    transform: translateY(-10px);
  }

  &.active {
    background: var(--cyan-alpha-10);
    width: 100%;

    @media (max-width: 1024px) {
      .project-card__image {
        height: 400px;
      }
    }
  }

  &__image {
    position: relative;
    width: auto;
    overflow: hidden;
    z-index: 1;
    transition: height 0.5s ease, width 1s ease;
    height: 200px;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      transition: opacity var(--card-transition);
      opacity: 0;

      &.image-loaded {
        opacity: 1;
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    flex-grow: 1;
  }

  &__title {
    transition: font-size 0.3s ease;
    font-size: 1.5rem !important;
    font-weight: 600;
    color: var(--text);
  }

  &__description {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-md);
    line-height: 1.4;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    color: var(--cyan);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--card-transition);

    &:hover {
      color: var(--cyan-dark);
    }

    &-arrow {
      margin-left: 0.5rem;
      transition: transform 0.3s;
    }
  }

  &--list {
    width: 100%;

    &.active {
      background: var(--cyan-alpha-10);

      @media (min-width: 1024px) {
        transform: translateX(20px);
      }
    }

    &:hover:not(.active) {
      @media (min-width: 1024px) {
        transform: translateX(5px);
      }
    }

    .project-card__image {
      height: auto;
      width: 20%;
      max-width: 120px;
      min-width: 80px;
      object-fit: cover;
      overflow: hidden;
      border-radius: var(--radius-lg);
    }

    .project-card__content {
      max-height: 200px;
      overflow: visible;
      opacity: 1;
      transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
    }
  }
}

.image-loader {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
