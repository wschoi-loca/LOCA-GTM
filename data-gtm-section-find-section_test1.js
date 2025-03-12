document.addEventListener('click', (event) => {
    setTimeout(() => {
    const target = event.target.closest('.a-selector');
    if (target) {
          window.dataLayer.push({
            event: 'clickEvent',
            elementA: target.getAttribute('data-info')
          });
        }
      }, 0);
});

