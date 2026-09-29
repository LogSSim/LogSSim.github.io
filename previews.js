(() => {
  const videos = [...document.querySelectorAll('.paper-animation video')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();

  function updatePlayback() {
    for (const video of videos) {
      if (reducedMotion.matches || document.hidden || !visible.has(video)) {
        video.pause();
      } else {
        video.play().catch(() => {
          // The poster remains visible when a browser blocks autoplay.
        });
      }
    }
  }

  for (const video of videos) {
    video.muted = true;
    video.addEventListener('error', () => {
      video.closest('.paper-animation').classList.add('is-static');
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      updatePlayback();
    }, { threshold: 0.05 });
    videos.forEach(video => observer.observe(video));
  } else {
    videos.forEach(video => visible.add(video));
  }

  reducedMotion.addEventListener('change', updatePlayback);
  document.addEventListener('visibilitychange', updatePlayback);
  updatePlayback();
})();
