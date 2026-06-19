import { createApp } from 'vue';
import DlsiteIntegration from '../ui/DlsiteIntegration.vue';

export function initDLSiteInjector() {
  // Extract RJ code from URL
  const url = window.location.href;
  const match = url.match(/(RJ\d{6,8})/i);
  if (!match) return;

  const rjCode = match[1].toUpperCase();

  // Find injection point (the title area)
  // On DLsite, the title is usually an h1 with id "work_name"
  const titleEl = document.getElementById('work_name');
  if (!titleEl) return;

  // Create mount point
  const mountPoint = document.createElement('div');
  mountPoint.id = 'rj-warp-gate-dlsite-mount';
  
  // Insert mount point right after the title
  titleEl.insertAdjacentElement('afterend', mountPoint);

  // Mount the Vue app
  const app = createApp(DlsiteIntegration, {
    rjCode
  });
  app.mount(mountPoint);
}
