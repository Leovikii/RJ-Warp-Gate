<template>
  <div class="dlsite-plus-rjcode-chain">
    <span class="bracket">[</span>
    <span v-if="isParent" class="arrow-up">↑</span>
    
    <template v-if="chain && chain.length > 0">
      <span v-for="(rj, index) in chain" :key="rj" class="chain-item">
        <span 
          class="rj-text" 
          :class="{ 'is-active': index === 0 }"
        >
          {{ rj }}
        </span>
        <span v-if="index < chain.length - 1" class="arrow-right">→</span>
      </span>
    </template>
    
    <template v-else>
      <span class="rj-text is-active">{{ currentRj }}</span>
    </template>
    
    <span class="bracket">]</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  chain: string[];
  currentRj: string;
  isParent?: boolean;
}>();
</script>

<style scoped>
.dlsite-plus-rjcode-chain {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
}

.bracket {
  color: rgba(255, 255, 255, 0.4);
}

.arrow-up, .arrow-right {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9em;
}

.rj-text {
  transition: color 0.2s;
}

.rj-text.is-active {
  color: #fff;
  font-weight: bold;
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 0.4);
  text-underline-offset: 2px;
}
</style>
