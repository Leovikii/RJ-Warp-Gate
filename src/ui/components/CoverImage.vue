<template>
  <div class="dlsite-plus-img-container">
    <img 
      v-if="src" 
      :src="src" 
      @mouseenter="isHovered = true" 
      @mouseleave="isHovered = false"
      :class="{ 'is-hovered': isHovered }"
    />
    <div v-else class="dlsite-plus-img-placeholder">
      <div class="dlsite-plus-img-skeleton"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  src?: string;
}>();

const isHovered = ref(false);
</script>

<style scoped>
.dlsite-plus-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 150px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

.dlsite-plus-img-container img {
  max-width: 100%;
  max-height: 350px;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.dlsite-plus-img-container img.is-hovered {
  transform: scale(1.05);
}

.dlsite-plus-img-placeholder {
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dlsite-plus-img-skeleton {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
