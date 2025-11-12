export function setStatus(msg) {
  const el = document.querySelector('#status');
  if (el) el.textContent = msg;
}

export function mountUI({ onLocate, onWatchStart, onWatchStop }) {
  const root = document.querySelector('#app');
  root.innerHTML = `
    <div class="controls">
      <button id="btnLocate">Finna staðsetningu</button>
      <button id="btnWatchStart">Fylgjast með hreyfingu</button>
      <button id="btnWatchStop" disabled>Stöðva eftirfylgni</button>
    </div>

    <section class="card">
      <h2>Núverandi staða</h2>
      <dl id="now">
        <dt>Breidd (lat)</dt><dd id="lat">–</dd>
        <dt>Lengd (lon)</dt><dd id="lon">–</dd>
        <dt>Nákvæmni</dt><dd id="acc">–</dd>
        <dt>Hraði</dt><dd id="spd">–</dd>
        <dt>Tími</dt><dd id="ts">–</dd>
      </dl>
      <p id="linkWrap"></p>
    </section>

    <section class="card">
      <h2>Atburðaskrá (watchPosition)</h2>
      <div class="log" id="log" aria-live="polite"></div>
    </section>
  `;

  root.querySelector('#btnLocate').addEventListener('click', onLocate);
  root.querySelector('#btnWatchStart').addEventListener('click', () => {
    onWatchStart();
    root.querySelector('#btnWatchStart').disabled = true;
    root.querySelector('#btnWatchStop').disabled = false;
  });
  root.querySelector('#btnWatchStop').addEventListener('click', () => {
    onWatchStop();
    root.querySelector('#btnWatchStart').disabled = false;
    root.querySelector('#btnWatchStop').disabled = true;
  });
}

export function renderPosition(pos) {
  const { latitude, longitude, accuracy, speed } = pos.coords;
  const ts = new Date(pos.timestamp);

  document.querySelector('#lat').textContent = latitude.toFixed(6);
  document.querySelector('#lon').textContent = longitude.toFixed(6);
  document.querySelector('#acc').textContent = `${Math.round(accuracy)} m`;
  document.querySelector('#spd').textContent = Number.isFinite(speed) ? `${speed} m/s` : '—';
  document.querySelector('#ts').textContent = ts.toLocaleString();

  }

export function appendLog(pos) {
  const el = document.querySelector('#log');
  const { latitude, longitude } = pos.coords;
  const ts = new Date(pos.timestamp).toLocaleTimeString();
  const row = document.createElement('div');
  row.textContent = `${ts} → (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
  el.prepend(row);
}
