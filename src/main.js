import './styles.scss';
import { setStatus, mountUI, renderPosition, appendLog } from './ui.js';
import { isSecureContextOK, getCurrentPosition, startWatching } from './geo.js';

function warnIfInsecure() {
  if (!isSecureContextOK()) {
    setStatus(' Ath: Geolocation virkar aðeins á https eða localhost. Settu á Netlify eða keyrðu með Vite dev server.');
  }
}

let watcher = null;

async function onLocate() {
  setStatus('Sæki núverandi staðsetningu…');
  try {
    const pos = await getCurrentPosition();
    renderPosition(pos);
    setStatus('✔️ Niðurstaða uppfærð');
  } catch (e) {
    setStatus(e.message);
  }
}

function onWatchStart() {
  setStatus('▶️ Fylgist með hreyfingu… (hreyfðu símann eða fartölvu)');
  watcher = startWatching(
    (pos) => {
      renderPosition(pos);
      appendLog(pos);
    },
    (err) => setStatus(err.message)
  );
}

function onWatchStop() {
  if (watcher) {
    watcher.stop();
    watcher = null;
  }
  setStatus('⏹️ Eftirfylgni stöðvuð');
}

mountUI({ onLocate, onWatchStart, onWatchStop });
warnIfInsecure();
