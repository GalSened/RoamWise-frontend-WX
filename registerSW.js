if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/roamwise-app/sw.js', { scope: '/roamwise-app/' });
  });
}
