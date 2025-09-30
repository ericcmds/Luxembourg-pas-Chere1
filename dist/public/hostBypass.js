// Host-Umgehungsskript
// Dieses Skript wird vor der Vite-Initialisierung ausgeführt

(function() {
  console.log('🚀 Host-Umgehungsskript wird ausgeführt...');
  
  if (typeof window !== 'undefined') {
    // Host-Überprüfungsvariablen festlegen
    window.VITE_ALLOWED_HOSTS = '*';
    window.VITE_DISABLE_HOST_CHECK = true;
    window.VITE_HOST_CHECK = false;
    window.VITE_ALLOW_ALL_HOSTS = true;
    
    // Vite-Plugin-Timeouts erhöhen
    window.__vite_plugin_react_timeout = 180000;
    window.__vite_plugin_react_preamble_installed__ = true;
    
    // Lokalen Speicher aktualisieren
    try {
      localStorage.setItem('vite:allow-host-check', 'false');
      localStorage.setItem('vite:allowed-hosts', '*');
    } catch (e) {
      console.error('Konnte lokalen Speicher nicht aktualisieren:', e);
    }
    
    // Ursprünglichen fetch überschreiben, um Host zu ersetzen
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      console.log('🔄 Fetch Request to:', url);
      if (typeof url === 'string' && url.includes('/@vite/client')) {
        console.log('🛠️ Modifiziere Vite-Client-Anfrage');
        url = url + '?t=' + Date.now();
      }
      return originalFetch(url, options);
    };
    
    // WebSocket-Verbindungen überwachen
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
      console.log('🔌 WebSocket-Verbindung zu:', url);
      return new originalWebSocket(url, protocols);
    };
    
    console.log('✅ Host-Umgehung aktiviert und Verbindungsbeschränkungen entfernt');
  }
})();