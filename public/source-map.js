/* PDF Figures 2–3, displayed without invented geometry or georeferencing. */
(() => {
  const container = document.querySelector('#impact-map');
  if (!container) return;
  const buttons = [...document.querySelectorAll('[data-map-view]')];
  const reset = document.querySelector('[data-map-fit]');
  const status = document.querySelector('#map-view-status');
  const views = {
    regional: {file:'maps/application-figure-3.jpg', name:'Regional view: Figure 3, PDF page 16. Dashed line: 13-mile context buffer.'},
    detail: {file:'maps/application-figure-2.jpg', name:'Project-area detail: Figure 2, PDF page 15. Dashed line: 2-mile context buffer.'}
  };
  if (typeof window.L === 'undefined') {
    buttons.forEach(b => b.disabled = true); reset.disabled = true;
    status.textContent = 'The zoom viewer could not load. Open either source map using the links below.';
    return;
  }
  container.replaceChildren();
  const map = L.map(container, {crs:L.CRS.Simple, scrollWheelZoom:false, minZoom:-4, maxZoom:1, zoomSnap:0.25});
  const bounds = [[0,0],[1720,1280]];
  let overlay;
  const fit = () => {map.invalidateSize();map.fitBounds(bounds,{padding:[8,8],animate:false});};
  function show(key) {
    const view = views[key];
    if (overlay) map.removeLayer(overlay);
    overlay = L.imageOverlay(view.file,bounds,{alt:view.name+' Red outline: applicant-mapped project area; not a surveyed construction footprint.'}).addTo(map);
    overlay.on('error', () => {status.textContent='The source image could not load. Use the application PDF links below.';});
    buttons.forEach(b => b.setAttribute('aria-pressed',String(b.dataset.mapView===key)));
    status.textContent = view.name; fit();
  }
  buttons.forEach(b => b.addEventListener('click',()=>show(b.dataset.mapView)));
  reset.addEventListener('click',fit);
  map.attributionControl.setPrefix(false);
  map.attributionControl.addAttribution('SWCA / Site Layer 4 application · Figures 2–3');
  let size='';
  new ResizeObserver(()=>{const next=container.clientWidth+'x'+container.clientHeight;if(next!==size){size=next;fit();}}).observe(container);
  show('regional');
})();
