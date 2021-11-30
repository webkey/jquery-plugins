app.scrollClasses = {
  name: 'scrollClasses',
  description: 'toggle classes on scroll',
  init() {
    let position = pageYOffset;
    const html = document.documentElement;

    const toggleScrolled = () => {
      html.classList.toggle('scrolled', pageYOffset > 5);
    }

    toggleScrolled();

    window.addEventListener('scroll', function () {
      toggleScrolled();
      html.classList.toggle('scrolldown', pageYOffset > position);
      html.classList.toggle('scrollup', pageYOffset < position);
      position = pageYOffset;
    });
  },
};
