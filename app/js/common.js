window.onload = function () {
  const emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const forms = document.querySelectorAll('form');

  for (let i = 0; i < forms.length; ++i) {
    const form = forms[i];
    const email = form.querySelector('input[name=email]');

    if (typeof email.setCustomValidity === 'function') {
      email.setCustomValidity('Введите корректный email');

      function onChange() {
        if (email.value == '') {
          email.setCustomValidity('Введите email');
        } else if (!emailRe.test(email.value)) {
          email.setCustomValidity('Неправельный email');
        } else {
          email.setCustomValidity('');
        }
      }

      function onInvalid() {
        if (email.value === '') {
          email.setCustomValidity('Введите email');
        } else {
          email.setCustomValidity('Неправельный email');
        }
      }

      email.addEventListener('change', onChange);
      email.addEventListener('input', onChange);
      email.addEventListener('invalid', onInvalid);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const xhr = new XMLHttpRequest();

      xhr.open('POST', '/api/subscribe/');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ email: email.value }));

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 204) {
          ga('send', 'event', {
            eventCategory: 'Subscriptions',
            eventAction: 'subscribe',
            eventLabel: 'Testing'
          });

          const success = document.createElement('div');
          const h3 = document.createElement('h3');
          h3.innerText = 'Мы напишем!';
          success.className = 'success';
          success.appendChild(h3);

          for (let j = 0; j < forms.length; ++j) {
            const el = forms[j];
            el.parentNode.insertBefore(success.cloneNode(true), el);
            el.parentNode.removeChild(el);
          }
        }
      };
    });
  }
};
