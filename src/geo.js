// Hjálparföll utan um Geolocation API

export function isSecureContextOK() {
  // Geolocation krefst secure context (https) eða localhost í flestum vöfrum.
  return window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

export function getCurrentPosition(options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation ekki studd í þessum vafra.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, (err) => {
      reject(new Error('Tókst ekki að sækja staðsetningu: ' + err.message));
    }, options);
  });
}

export function startWatching(onUpdate, onError, options = { enableHighAccuracy: true, maximumAge: 0 }) {
  if (!('geolocation' in navigator)) {
    onError(new Error('Geolocation ekki studd.'));
    return { stop() {} };
  }
  const id = navigator.geolocation.watchPosition(onUpdate, (err) => {
    onError(new Error('Villa í watchPosition: ' + err.message));
  }, options);

  return {
    stop() {
      navigator.geolocation.clearWatch(id);
    }
  };
}
