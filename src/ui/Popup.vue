<template>
  <Transition name="fade">
    <div 
      v-if="state.display"
      ref="popupRef" 
      class="dlsite-plus-popup"
      :class="[isGirls ? 'theme-girls' : 'theme-maniax']"
      :style="positionStyle"
    >
      <div class="popup-close-btn" @click="closePopup">✕</div>

      <div v-if="loading" class="popup-loader">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>

      <div v-else-if="!workFound" class="popup-not-found">
        <div class="error-icon">?</div>
        <div>Work Not Found</div>
        <div class="error-sub">{{ state.rjCode }}</div>
      </div>

      <div v-else class="popup-content">
        <div class="header-section">
          <span 
            class="header-rjcode" 
            @click="onCopyRjCode"
            title="点击复制 RJ 号"
          >
            {{ state.rjCode.toUpperCase() }}
          </span>
          <span 
            class="work-title" 
            :title="titleHint"
            @click="onCopyTitle"
          >
            {{ title || 'Loading...' }}
          </span>
        </div>

        <div class="panel-container">
          <!-- Left Panel: Cover Image and DLsite Link -->
          <div class="panel-left">
            <div class="dlsite-cover-container">
              <CoverImage :src="imgLink" />
            </div>
            <LinkButton 
              :href="'https://www.dlsite.com/maniax/work/=/product_id/' + state.rjCode.toUpperCase() + '.html'"
              theme="dlsite"
            />
            
            <LinkButton 
              v-if="asmrOneUrl"
              :href="asmrOneUrl"
              theme="asmrone"
              style="margin-top: 10px;"
            />
          </div>

          <!-- Right Panel: Information -->
          <div class="panel-right">

          <WorkTags :tags="tags" />

          <div class="info-container primary-info">
            <InfoRow 
              v-for="row in primaryRows" 
              :key="row.id"
              :title="row.title"
              :items="row.items"
              :separator="row.separator"
              :copyHint="copyHint"
            />
          </div>

          <!-- Secondary Grid Layout -->
          <div class="info-container secondary-info-grid">
            <InfoRow 
              v-for="row in secondaryRows" 
              :key="row.id"
              :title="row.title"
              :items="row.items"
              :separator="row.separator"
              :copyHint="copyHint"
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import type { PopupState } from '../types';
import { WorkPromise } from '../core/scraper';
import { localizePopup, localizationMap } from '../config/localization';
import { VOICELINK_CLASS } from '../config/constants';

import CoverImage from './components/CoverImage.vue';
import WorkTags from './components/WorkTags.vue';
import InfoRow from './components/InfoRow.vue';
import LinkButton from './components/LinkButton.vue';

const props = defineProps<{
  state: PopupState;
}>();

const popupRef = ref<HTMLElement | null>(null);

// State variables
const workFound = ref(true);
const loading = ref(true);
const title = ref('');
const imgLink = ref('');
const tags = ref<any[]>([]);
const primaryRows = ref<any[]>([]);
const secondaryRows = ref<any[]>([]);
const isGirls = ref(false);
const asmrOneUrl = ref<string | null>(null);

const titleHint = computed(() => localizePopup(localizationMap.click_to_copy_title));
const copyHint = computed(() => localizePopup(localizationMap.click_to_copy));

// Calculate position based on mouse click coordinates
const positionStyle = computed(() => {
  // Use fixed positioning relative to viewport
  // Fallback widths
  const width = 650;
  const height = 400; // estimated
  
  let left = props.state.x + 15;
  let top = props.state.y + 15;
  
  // Keep within bounds
  if (typeof window !== 'undefined') {
    if (left + width > window.innerWidth) {
      left = props.state.x - width - 15;
      if (left < 0) left = 10;
    }
    // Very rough height bounding
    if (top + height > window.innerHeight) {
      top = window.innerHeight - height - 10;
      if (top < 0) top = 10;
    }
  }
  
  return {
    left: `${left}px`,
    top: `${top}px`
  };
});

const closePopup = () => {
  props.state.display = false;
};

const onCopyTitle = (e: MouseEvent) => {
  if (title.value && typeof GM_setClipboard !== 'undefined') {
    GM_setClipboard(title.value, 'text');
    const target = e.target as HTMLElement;
    const oldColor = target.style.color;
    target.style.color = '#4ade80';
    setTimeout(() => {
      target.style.color = oldColor;
    }, 500);
  }
};

const onCopyRjCode = (e: MouseEvent) => {
  if (props.state.rjCode && typeof GM_setClipboard !== 'undefined') {
    GM_setClipboard(props.state.rjCode.toUpperCase(), 'text');
    const target = e.target as HTMLElement;
    const oldColor = target.style.color;
    target.style.color = '#4ade80';
    setTimeout(() => {
      target.style.color = oldColor;
    }, 500);
  }
};

const updatePopupData = async () => {
  if (!props.state.display || !props.state.rjCode) return;
  const rjCode = props.state.rjCode;
  
  loading.value = true;
  workFound.value = false;
  title.value = '';
  imgLink.value = '';
  primaryRows.value = [];
  secondaryRows.value = [];
  tags.value = [];
  isGirls.value = false;
  asmrOneUrl.value = null;

  try {
    let found = await WorkPromise.getFound(rjCode);
    if (!found) {
      // Logic for fallback is in linkage.ts (to be refactored) but for now we'll call getParentRJ
      // Wait, currently scraper.ts is not fully rewritten.
      // I'll keep the logic using the current WorkPromise structure.
    }
    workFound.value = found;
    if (!found) {
      loading.value = false;
      return;
    }
  } catch (e) {
    console.error(e);
  }

  // Fetch parallel data
  Promise.allSettled([
    WorkPromise.getWorkTitle(rjCode).then(t => { if (rjCode === props.state.rjCode) title.value = t; }),
    WorkPromise.getImgLink(rjCode).then(link => {
      if (rjCode === props.state.rjCode && typeof link === 'string') imgLink.value = link;
    }),
    WorkPromise.getGirls(rjCode).then(g => { if (rjCode === props.state.rjCode) isGirls.value = !!g; }),
    WorkPromise.checkAsmrOne(rjCode).then(url => { if (rjCode === props.state.rjCode) asmrOneUrl.value = url; }),
  ]);

  try {
    if (!props.state.display || rjCode !== props.state.rjCode) return;

    // Tags
    const newTags = [];
    const typeText = await WorkPromise.getWorkTypeText(rjCode).catch(() => '');
    if (typeText) newTags.push({ text: typeText, class: `voicelink-tag-orange` });

    const rateAvg = await WorkPromise.getRateAvg(rjCode).catch(() => 0);
    const rateCount = await WorkPromise.getRateCount(rjCode).catch(() => 0);
    if (rateAvg > 0) newTags.push({ text: `${rateAvg.toFixed(2)}★ (${rateCount})`, class: `voicelink-tag-yellow` });
    
    tags.value = newTags;

    // Rows
    const primaryOrder = ["circle_name", "voice_actor", "genre", "file_size"];
    const secondaryOrder = ["dl_count", "release_date", "age_rating", "scenario", "illustration", "music"];
    const order = [...primaryOrder, ...secondaryOrder];
    
    const rowPromises = order.map(async (id: string) => {
      try {
        if (id === 'circle_name') {
            const val = await WorkPromise.getCircle(rjCode);
            if (val) return { id, title: localizePopup(localizationMap.circle_name), items: [{ text: val }] };
        } else if (id === 'dl_count') {
            const val = await WorkPromise.getDLCount(rjCode);
            if (val) return { id, title: localizePopup(localizationMap.dl_count), items: [{ text: val }] };
        } else if (id === 'voice_actor') {
            const vas = await WorkPromise.getCV(rjCode);
            if (vas && vas.length) return { id, title: localizePopup(localizationMap.voice_actor), items: vas.map((v: string) => ({ text: v })), separator: ' / ' };
        } else if (id === 'age_rating') {
            const val = await WorkPromise.getAgeRating(rjCode);
            if (val) return { id, title: localizePopup(localizationMap.age_rating), items: [{ text: val, class: val.includes('18') ? `voicelink-age-18` : `voicelink-age-all` }] };
        } else if (id === 'file_size') {
            const val = await WorkPromise.getFileSize(rjCode);
            if (val) return { id, title: localizePopup(localizationMap.file_size), items: [{ text: val }] };
        } else if (id === 'release_date') {
            const val = await WorkPromise.getReleaseDate(rjCode);
            if (val && val[0]) return { id, title: localizePopup(localizationMap.release_date), items: [{ text: val[0] }] };
        } else if (id === 'scenario') {
            const val = await WorkPromise.getScenario(rjCode);
            if (val && val.length) return { id, title: localizePopup(localizationMap.scenario), items: val.map((v: string) => ({ text: v })), separator: ' / ' };
        } else if (id === 'illustration') {
            const val = await WorkPromise.getIllustrator(rjCode);
            if (val && val.length) return { id, title: localizePopup(localizationMap.illustration), items: val.map((v: string) => ({ text: v })), separator: ' / ' };
        } else if (id === 'genre') {
            const val = await WorkPromise.getTags(rjCode);
            if (val && val.length) return { id, title: localizePopup(localizationMap.genre), items: val.map((v: string) => ({ text: v })), separator: ' ' };
        }
      } catch(e) { }
      return null;
    });

    const results = await Promise.all(rowPromises);
    if (!props.state.display || rjCode !== props.state.rjCode) return;
    
    const validRows = results.filter(Boolean) as any[];
    
    const pRows = [];
    for (const id of primaryOrder) {
      const matched = validRows.find(r => r.id === id);
      if (matched) pRows.push(matched);
    }
    primaryRows.value = pRows;

    const sRows = [];
    for (const id of secondaryOrder) {
      const matched = validRows.find(r => r.id === id);
      if (matched) sRows.push(matched);
    }
    secondaryRows.value = sRows;
    
  } catch (e) {
    console.error(e);
  } finally {
    if (rjCode === props.state.rjCode) {
      loading.value = false;
    }
  }
};

watch(() => props.state.rjCode, (newVal) => {
  if (newVal) updatePopupData();
});

watch(() => props.state.display, (newVal) => {
  if (newVal) updatePopupData();
});
</script>

<style scoped>
.dlsite-plus-popup {
  position: fixed;
  z-index: 2147483646;
  width: 650px;
  max-width: 90vw;
  min-height: 250px;
  max-height: 85vh;
  
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: #f1f5f9;
  
  background-color: rgba(30, 41, 59, 0.85); /* Slate 800 */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
  
  padding: 16px;
  box-sizing: border-box;
  
  display: flex;
  flex-direction: column;
  pointer-events: auto; /* Allow mouse interaction within the popup */
  user-select: text;    /* Allow text selection */
}

.theme-maniax {
  /* Subtle tint for Maniax */
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(59, 30, 52, 0.85) 100%);
  border-top: 1px solid rgba(236, 72, 153, 0.3);
}

.theme-girls {
  /* Subtle tint for Girls */
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(59, 41, 30, 0.85) 100%);
  border-top: 1px solid rgba(249, 115, 22, 0.3);
}

.popup-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  z-index: 10;
  transition: all 0.2s ease;
}

.popup-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.popup-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
}

.header-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.header-rjcode {
  cursor: pointer;
  border-bottom: 2px dashed rgba(244, 114, 182, 0.7);
  background-color: rgba(244, 114, 182, 0.1);
  border-radius: 4px;
  padding: 2px 6px;
  margin-right: 12px;
  color: rgb(244, 114, 182);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-weight: bold;
  font-size: 1.1em;
  transition: all 0.2s;
  white-space: nowrap;
}

.header-rjcode:hover {
  background-color: rgba(244, 114, 182, 0.2);
  color: #fff;
}

.work-title {
  font-size: 1.4em;
  font-weight: 700;
  line-height: 1.3;
  cursor: pointer;
  transition: color 0.2s;
  padding-right: 20px; /* Space for close btn */
  flex: 1;
}

.panel-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 20px;
  min-height: 0; /* Important for scrollable children */
}

.panel-left {
  flex: 0 0 240px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dlsite-cover-container {
  display: block;
  margin-bottom: 12px;
}

.panel-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 8px;
}

/* Custom scrollbar */
.panel-right::-webkit-scrollbar {
  width: 6px;
}
.panel-right::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}
.panel-right::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.work-title:hover {
  color: #93c5fd; /* Blue 300 */
}

.info-container {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.secondary-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
}

.secondary-info-grid :deep(.dlsite-plus-info-row) {
  font-size: 0.95em;
  margin-bottom: 0;
}

.secondary-info-grid :deep(.dlsite-plus-info-title) {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.secondary-info-grid :deep(.dlsite-plus-info-content) {
  color: rgba(255, 255, 255, 0.8);
}

/* Make scenario span 2 columns if it's long, but we'll let it be. If we really want, we can do it via nth-child but it's fine for now. */

/* Loader */
.popup-loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
}

.dot {
  width: 12px;
  height: 12px;
  margin: 0 6px;
  background-color: #fff;
  border-radius: 50%;
  animation: pulse 1.2s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes pulse {
  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
}

/* Not Found */
.popup-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.6);
}

.error-icon {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.2);
}

.error-sub {
  font-family: monospace;
  margin-top: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
  transform-origin: top left;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media screen and (max-width: 600px) {
  .popup-content {
    flex-direction: column;
  }
  .panel-left {
    flex: 0 0 auto;
    width: 100%;
    margin-bottom: 16px;
  }
  .dlsite-plus-popup {
    width: 95vw;
    left: 2.5vw !important;
  }
}
</style>
