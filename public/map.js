/* Maintained orientation map. Existing approximate coordinates retained;
   circles and polylines are schematic, not surveyed boundaries or connections. */
(() => {
  const container = document.querySelector('#impact-map');
  if (!container) return;
  const controls = [...document.querySelectorAll('[data-map-layer]')];
  const fitButton = document.querySelector('[data-map-fit]');
  if (typeof window.L === 'undefined') {
    container.innerHTML = '<p class="map-loading">The interactive basemap could not load. Locations, qualifications and original sources remain available below.</p>';
    [...controls, fitButton].filter(Boolean).forEach(b => b.disabled = true);
    return;
  }
  container.replaceChildren();
  const map = L.map(container, {scrollWheelZoom:false, zoomControl:true});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:18, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  const projects = L.layerGroup().addTo(map), places = L.layerGroup().addTo(map), corridors = L.layerGroup().addTo(map);
  const region = L.latLngBounds([[41.58,-105.02],[42.27,-104.49]]);
  const fit = () => {map.invalidateSize();map.fitBounds(region,{padding:[38,20],maxZoom:10,animate:false});};
  function accessible(layer, label) {
    layer.on('add', () => {
      const el = layer.getElement();
      if (!el) return;
      el.setAttribute('tabindex','0');el.setAttribute('role','button');el.setAttribute('aria-label',label);
      el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();layer.openPopup();}};
    });
    return layer;
  }
  const site = L.circle([42.1,-104.71],{radius:4000,color:'#6d3fb0',weight:3,fillColor:'#8d67c6',fillOpacity:.24})
    .bindPopup('<strong>Site Layer 4 · approximate</strong><span>Rezoning approval reported; final conditions and project permits require verification.</span><small>Orientation symbol, not a parcel boundary or surveyed centroid. Based on the county legal description and earlier site research. <a href="https://www.plattecountywyoming.com/events/100544/">County notice and legal description</a>.</small>')
    .bindTooltip('Site Layer 4<br><small>approximate</small>',{permanent:true,direction:'top',offset:[0,-15],className:'map-place-label'});
  accessible(site,'Site Layer 4: open approximate-location and source notes').addTo(projects);
  const chug = L.circle([41.79,-104.62],{radius:8000,color:'#0f766e',weight:3,dashArray:'8 6',fillColor:'#37a69b',fillOpacity:.2})
    .bindPopup('<strong>Chugwater Energy · generalized</strong><span>The March 3, 2026 state notice describes an approved permit for approximately 300 MW wind, 150 MW solar and 150 MW four-hour battery storage.</span><small>East-of-Chugwater orientation symbol, not a permit boundary; this notice does not establish current construction progress. <a href="https://content.govdelivery.com/accounts/WYDEQ/bulletins/40c7354">Corrected state permit notice</a>.</small>')
    .bindTooltip('Chugwater Energy<br><small>generalized</small>',{permanent:true,direction:'top',offset:[0,-24],className:'map-place-label'});
  accessible(chug,'Chugwater Energy: open generalized-location and source notes').addTo(projects);
  for (const [point,name] of [[[42.055,-104.953],'Wheatland'],[[41.756,-104.821],'Chugwater']]) {
    L.circleMarker(point,{radius:5,color:'#10233b',weight:2,fillColor:'#fff',fillOpacity:1})
      .bindTooltip(name,{permanent:true,direction:'bottom',offset:[0,9],className:'map-place-label community-label'}).addTo(places);
  }
  L.polyline([[42.27,-105.02],[42.06,-104.96],[41.92,-104.9],[41.76,-104.82],[41.58,-104.75]],{color:'#344a62',weight:4,opacity:.72})
    .bindTooltip('I-25 · schematic reference alignment',{sticky:true}).addTo(corridors);
  L.polyline([[41.756,-104.82],[41.78,-104.72],[41.8,-104.6],[41.82,-104.49]],{color:'#a64b08',weight:3,dashArray:'10 8'})
    .bindTooltip('Schematic direction of access roads named in the DEQ notice—not a surveyed route',{sticky:true}).addTo(corridors);
  L.polyline([[42.055,-104.95],[42.08,-104.84],[42.1,-104.72]],{color:'#6d3fb0',weight:3,dashArray:'10 8'})
    .bindTooltip('Wheatland-to-project orientation only—not a verified road or utility connection',{sticky:true}).addTo(corridors);
  const layers={projects,places,corridors};
  controls.forEach(button=>button.addEventListener('click',()=>{
    const layer=layers[button.dataset.mapLayer],active=button.getAttribute('aria-pressed')==='true';
    button.setAttribute('aria-pressed',String(!active));button.classList.toggle('active',!active);
    if(active)map.removeLayer(layer);else layer.addTo(map);
  }));
  fitButton?.addEventListener('click',fit);
  // Reframe on a genuine container-size change, not ordinary map pan/zoom.
  let size='';
  new ResizeObserver(()=>{const next=container.clientWidth+'x'+container.clientHeight;if(next!==size){size=next;fit();}}).observe(container);
  fit();
})();
