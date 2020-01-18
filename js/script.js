'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // screen keyboard
  {
    const keyboardBtn = document.querySelector('.search-form__keyboard'),
      keyboard = document.querySelector('.keyboard'),
      closeKeyboard = document.getElementById('close-keyboard'),
      searchInput = document.querySelector('.search-form__input');

    const toggleKeyboard = () => keyboard.style.top = keyboard.style.top ? '' : '50%';

    const changeLanguage = (btn, lang) => {
      const langRu = ['ё', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
        'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
        'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
        'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
        'en', ' '
      ];
      const langEn = ['`', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '"',
        'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
        'ru', ' '
      ];

      if (lang === 'en') {
        btn.forEach((elem, i) => {
          elem.textContent = langEn[i];
        })
      } else {
        btn.forEach((elem, i) => {
          elem.textContent = langRu[i];
        })
      }
    };

    const typing = event => {
      const target = event.target;

      if (target.tagName.toLowerCase() === 'button') {
        const buttons = [...keyboard.querySelectorAll('button')]
          .filter(elem => elem.style.visibility !== 'hidden');
        const buttonContent = target.textContent.trim();
        if (target.id === 'keyboard-backspace') {
          searchInput.value = searchInput.value.slice(0, -1);
        } else if (target.id === 'keyboard-space') {
          searchInput.value += ' ';
        } else if (buttonContent === 'en' || buttonContent === 'ru') {
          changeLanguage(buttons, buttonContent);
        } else {
          searchInput.value += buttonContent;
        }
      }
    };

    keyboardBtn.addEventListener('click', toggleKeyboard);
    closeKeyboard.addEventListener('click', toggleKeyboard);
    keyboard.addEventListener('click', typing);

  }

  //menu
  {

    const burger = document.querySelector('.spinner'),
      sidebarMenu = document.querySelector('.sidebarMenu');

    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      sidebarMenu.classList.toggle('rollUp');
    });

    sidebarMenu.addEventListener('click', event => {

      let target = event.target;

      target = target.closest('a[href="#"]');

      if (target) {
        const targetParent = target.parentNode;
        sidebarMenu.querySelectorAll('li').forEach((elem) => {
          if (elem === targetParent) {
            elem.classList.add('active');
          } else {
            elem.classList.remove('active');
          }
        });
      }

    })

  }

  //modal

  const playVideo = () => {

    const youtuberItems = document.querySelectorAll('[data-youtuber]');
    const youTuberModal = document.querySelector('.youTuberModal');
    youTuberModal.style.display = 'block';
    youTuberModal.style.visibility = 'hidden';
    youTuberModal.style.width = '0';
    youTuberModal.style.height = '0';


    const youtuberContainer = document.getElementById('youtuberContainer');

    const qw = [3840, 2560, 1920, 1280, 854, 640, 426, 256];
    const qh = [2160, 1440, 1080, 720, 480, 360, 240, 144];

    const videoSize = () => {
      let ww = document.documentElement.clientWidth;
      let wh = document.documentElement.clientHeight;

      for (let i = 0; i < qw.length; i++) {
        if (ww > qw[i]) {
          youtuberContainer.querySelector('iframe').style.cssText = `
          width: ${qw[i]}px;
          height: ${qh[i]}px;
          `;
          youtuberContainer.style.cssText = `
          width: ${qw[i]}px;
          height: ${qh[i]}px;
          top: ${(wh - qh[i]) / 2}px;
          left: ${(ww - qw[i]) / 2}px;
          `;
          break;
        }
      }
    };

    youtuberItems.forEach(elem => {
      elem.addEventListener('click', () => {
        const idVideo = elem.dataset.youtuber;
        youTuberModal.style.width = '100%';
        youTuberModal.style.height = '100vh';
        youTuberModal.style.visibility = '';

        const youTuberFrame = document.createElement('iframe');
        youTuberFrame.src = `http://youtube.com/embed/${idVideo}`;
        youtuberContainer.insertAdjacentElement('afterbegin', youTuberFrame);

        window.addEventListener('resize', videoSize);

        videoSize();
      });
    });

    youTuberModal.addEventListener('click', () => {
      youTuberModal.style.width = '0';
      youTuberModal.style.height = '0';
      youTuberModal.style.visibility = 'hidden';

      youtuberContainer.textContent = '';
      window.removeEventListener('resize', videoSize);

    });
  };


  {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="youTuberModal">
        <div id="youtuberClose">&#215;</div>
        <div id="youtuberContainer"></div>
      </div>
    `);
    playVideo();
  }

  //API

  {
    const API_KEY = '';
    const CLIENT_ID = '';

    //authorization

    {

      const buttonAuth = document.getElementById('authorize');
      const authBlock = document.querySelector('.auth');

      gapi.load("client:auth2", () => gapi.auth2.init({client_id: CLIENT_ID}));

      const authenticate = () => gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(() => console.log("Sign-in successful"))
        .catch(errorAuth);

      const loadClient = () => {
        gapi.client.setApiKey(API_KEY);
        return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
          .then(() => console.log("GAPI client loaded for API"))
          .then(() => authBlock.style.display = 'none')
          .catch(errorAuth);
      };

      buttonAuth.addEventListener('click', () => {
        authenticate().then(loadClient);
      });

      const errorAuth = err => {
        console.error(err);
        authBlock.style.display = 'none';
      };

    }

    //request

    {

      const gloTube = document.querySelector('.logo-academy');
      const trends = document.getElementById('yt_trend');
      const liked = document.getElementById('like');
      const subscriptions = document.getElementById('subscriptions');
      const searchForm = document.querySelector('.search-form');

      const request = options => gapi.client.youtube[options.method]
        .list(options)
        .then(response => response.result.items)
        .then(data => options.method === 'subscriptions' ? renderSub(data) : render(data))
        .catch(err => console.error('Во время запроса произошла ошибка: ', err));

      const renderSub = data => {
        console.log(data);
        const ytWrapper = document.getElementById('yt-wrapper');
        ytWrapper.textContent = '';
        data.forEach(item => {
          console.log('sub');
          try {
            const {snippet:{resourceId: {channelId}, description, title, thumbnails: {high: {url}}}} = item;
            ytWrapper.innerHTML += `
            <div class="yt" data-youtuber="${channelId}">
              <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
               <img alt="thumbnail" class="yt-thumbnail__img" src="${url}">
              </div>
              <div class="yt-title">${title}</div>
              <div class="yt-channel">${description}</div>
            </div>
          `;
          } catch (err) {
            console.error('Error: ', err);
          }
        });

        ytWrapper.querySelectorAll('.yt').forEach(item => {
          item.addEventListener('click', () => {
            request({
              method: 'search',
              part: 'snippet',
              channelId: item.dataset.youtuber,
              order: 'date',
              maxResults: 6,
            })
          });
        });

      };

      const render = data => {
        console.log(data);
        const ytWrapper = document.getElementById('yt-wrapper');
        ytWrapper.textContent = '';
        data.forEach(item => {
          try {
            const {
              id,
              id: {
                videoId
              },
              snippet: {
                channelTitle,
                title,
                resourceId: {
                  videoId: videoIdLiked
                } = {},
                thumbnails: {
                  high: {
                    url
                  }
                }
              }
            } = item;
            ytWrapper.innerHTML += `
            <div class="yt" data-youtuber="${videoId || videoIdLiked || id}">
              <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
               <img alt="thumbnail" class="yt-thumbnail__img" src="${url}">
              </div>
              <div class="yt-title">${title}</div>
              <div class="yt-channel">${channelTitle}</div>
            </div>
          `;
          } catch (err) {
            console.error('Error: ', err);
          }
        });
        playVideo();
      };

      gloTube.addEventListener('click', () => {
        request({
          method: 'search',
          part: 'snippet',
          channelId: 'UCVswRUcKC-M35RzgPRv8qUg',
          order: 'date',
          maxResults: 6,
        })
      });
      trends.addEventListener('click', () => {
        request({
          method: 'videos',
          part: "snippet",
          chart: "mostPopular",
          maxResults: 6,
          regionCode: "UA"
        })
      });

      liked.addEventListener('click', () => {
        request({
          method: 'playlistItems',
          part: "snippet",
          playlistId: 'LLy9BcBSVE85n3BlxQ0znAUw',
          maxResults: 6,
        })
      });

      subscriptions.addEventListener('click', () => {
        request({
          method: 'subscriptions',
          part: "snippet",
          mine: 'true',
          maxResults: 6,
        })
      });

      searchForm.addEventListener('submit', event => {
        let inputValue = searchForm.elements[0].value;
        event.preventDefault();

        if (!inputValue) return;

        request({
          method: 'search',
          part: 'snippet',
          order: 'relevance',
          maxResults: 6,
          q: inputValue,
        })

      });

    }
  }

});
