export function init() {
  if ('serviceWorker' in navigator) {
    const swUrl = new URL('sw.js', import.meta.url);
    navigator.serviceWorker
      .register(swUrl, { type: 'module', scope: '/' })
      .then(registration => console.log('[ServiceWorker] Register:', registration))
      .catch(error => console.error('[ServiceWorker] Register failed:', error));
  }

  if ('BeforeInstallPromptEvent' in window) {
    showResult("⏳ BeforeInstallPromptEvent supported but not fired yet");
  } else {
    showResult("❌ BeforeInstallPromptEvent NOT supported");
  }

  window.addEventListener('appinstalled', (e) => {
    showResult("✅ AppInstalled fired", true);
  });

  // This variable will save the event for later use.
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevents the default mini-infobar or install dialog from appearing on mobile
    e.preventDefault();
    // Save the event because you'll need to trigger it later.
    deferredPrompt = e;
    // Show your customized install prompt for your PWA
    // Your own UI doesn't have to be a single element, you
    // can have buttons in different locations, or wait to prompt
    // as part of a critical journey.
    document.querySelector("#install").style.display = 'block';  
    showResult("✅ BeforeInstallPromptEvent fired", true);
  });

  document.querySelector("#install").addEventListener("click", installApp);
  
  async function installApp() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      showResult("🆗 Installation Dialog opened");
      // Find out whether the user confirmed the installation or not
      const { outcome } = await deferredPrompt.userChoice;
      // The deferredPrompt can only be used once.
      deferredPrompt = null;
      // Act on the user's choice
      if (outcome === 'accepted') {
        showResult('😀 User accepted the install prompt.', true);
      } else if (outcome === 'dismissed') {
        showResult('😟 User dismissed the install prompt');
      }
      // We hide the install button
      document.querySelector("#install").style.display = 'none';
    }
  }
}

window.addEventListener('load', init);

function showResult(text, append = false) {
  if (append) {
      document.querySelector("output").innerHTML += "<br>" + text;
  } else {
     document.querySelector("output").innerHTML = text;    
  }
}