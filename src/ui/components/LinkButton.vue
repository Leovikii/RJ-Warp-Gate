<template>
  <a 
    class="dlsite-plus-link-btn"
    :class="`theme-${theme}`"
    :href="href"
    target="_blank" 
    rel="noreferrer"
  >
    <!-- Left: External Link Icon -->
    <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>

    <div class="divider"></div>

    <!-- Right: Website Logo -->
    <template v-if="theme === 'dlsite'">
      <svg class="site-logo dlsite-logo" viewBox="0 0 118.45 33.65" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-98.55,-10.36)">
          <path d="m 169.31,18.34 a 3.6,3.6 0 0 0 3.56,-3.82 3.74,3.74 0 0 0 -6.34,-2.73 3.82,3.82 0 0 0 -1.07,2.75 3.94,3.94 0 0 0 1.12,2.78 3.81,3.81 0 0 0 2.73,1.02 z" class="logo-dot" />
          <path d="M 104.93,10.36 H 98.55 V 44 h 7.68 a 15.43,15.43 0 0 0 10.93,-4.59 17.58,17.58 0 0 0 5.06,-12.34 c -0.04,-9.2 -7.81,-16.71 -17.29,-16.71 z m 7.76,23.49 a 11,11 0 0 1 -7,3 h -0.23 v -19.4 c 1.75,0.23 9.58,1.75 9.74,9.55 a 9.17,9.17 0 0 1 -2.51,6.85 z M 131.76,10.39 H 125 V 44 h 17.48 V 36.82 H 131.76 Z M 153,22.3 c -1.4,2.06 -1.59,3.79 -1.86,6.18 v 0.14 c -0.06,0.59 -0.08,1.17 -0.1,1.74 -0.06,1.91 -0.11,3.55 -1.38,5 -1,1.2 -2,1.18 -3.48,1.51 l -0.4,0.08 V 44 h 0.5 A 10.08,10.08 0 0 0 155,39.75 c 2.16,-2.73 2.34,-4.7 2.49,-8.53 v -1.14 c 0,-1.58 0,-2.7 1,-3.9 a 4.88,4.88 0 0 1 3.11,-2 l 0.39,-0.09 v -6.76 h -0.54 A 10.14,10.14 0 0 0 153,22.3 Z m 35.82,15.37 h -1.46 A 3.48,3.48 0 0 1 184.73,36.52 3.41,3.41 0 0 1 183.61,34 V 23.71 h 3.72 V 17 h -3.76 v -6.53 h -6.4 v 23.7 a 9.67,9.67 0 0 0 3.33,7.28 12.67,12.67 0 0 0 7,2.55 c 0.27,0 1.31,-0.1 1.31,-0.1 z M 166,18.94 V 44 h 6.55 V 18.94 Z m 42.5,16.54 a 6.71,6.71 0 0 1 -5.07,2.13 6.92,6.92 0 0 1 -7.09,-6.3 v -0.73 a 7.11,7.11 0 0 1 7,-6.9 6.85,6.85 0 0 1 6.74,4.49 L 198,28.1 v 5.33 h 18.79 l 0.06,-0.44 a 16.46,16.46 0 0 0 0.15,-1.86 14,14 0 0 0 -4.27,-9.9 13.29,13.29 0 0 0 -9.55,-3.94 13.36,13.36 0 0 0 0.28,26.71 12,12 0 0 0 9.46,-4 l 0.34,-0.35 -4.39,-4.58 z" class="logo-text" />
        </g>
      </svg>
    </template>

    <template v-else-if="theme === 'asmrone'">
      <svg class="site-logo asmrone-logo" viewBox="0 0 120 34" xmlns="http://www.w3.org/2000/svg">
        <!-- Mock ASMR.one logo mirroring DLsite's structure (Text + Dot) -->
        <text x="0" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="28" class="logo-text" letter-spacing="-1">ASMR</text>
        <circle cx="74" cy="22" r="3.5" class="logo-dot" />
        <text x="81" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="28" class="logo-text" letter-spacing="-1">one</text>
      </svg>
    </template>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  href: string;
  theme: 'dlsite' | 'asmrone';
}>();
</script>

<style scoped>
.dlsite-plus-link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 12px;
  border-radius: 8px;
  padding: 12px 0;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border-bottom: 4px solid rgba(0, 0, 0, 0.2);
}

.dlsite-plus-link-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  filter: brightness(1.1);
}

.dlsite-plus-link-btn:active {
  transform: translateY(2px);
  border-bottom-width: 0px;
  margin-bottom: 4px; /* compensate for lost border to keep layout stable */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  filter: brightness(0.9);
}

.external-icon {
  height: 20px;
  width: 20px;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 1px;
}

.site-logo {
  height: 22px;
  width: auto;
}

/* --- Theme: DLsite --- */
.theme-dlsite {
  background-color: #0044cc; /* DLsite vivid blue */
}
.theme-dlsite .external-icon {
  color: #ffffff;
}
.theme-dlsite .logo-dot {
  fill: #fbc600; /* Yellow dot */
}
.theme-dlsite .logo-text {
  fill: #ffffff; /* White text */
}
.theme-dlsite .divider {
  background-color: rgba(255, 255, 255, 0.2);
}

/* --- Theme: ASMR.one --- */
.theme-asmrone {
  background-color: #f8c300; /* ASMR.one vivid yellow */
  border-bottom-color: #c79c00;
}
.theme-asmrone .external-icon {
  color: #1e293b; /* Dark icon */
}
.theme-asmrone .logo-dot {
  fill: #ffffff; /* White dot */
}
.theme-asmrone .logo-text {
  fill: #1e293b; /* Dark text */
}
.theme-asmrone .divider {
  background-color: rgba(30, 41, 59, 0.2);
}
</style>
