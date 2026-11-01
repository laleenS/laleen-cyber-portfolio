export function initFieldStationLauncher() {
  let module;
  let pending = false;
  for (const id of ['open-field-station','dock-station']) {
    document.getElementById(id).addEventListener('click', async event => {
      if (pending) return;
      pending = true;
      const trigger = event.currentTarget;
      trigger.setAttribute('aria-busy','true');
      try {
        module ||= await import('./field-station.js');
        module.openFieldStation(trigger);
      } catch {
        document.getElementById('garden-announcement').textContent = 'The field station could not load. The garden map and project links remain available.';
      } finally {
        pending = false;
        trigger.removeAttribute('aria-busy');
      }
    });
  }
}
