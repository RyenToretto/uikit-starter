import Swiper from 'swiper';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

UIkit.use(Icons); // loads the Icon plugin

UIkit.util.ready(() => {
    (function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                if (clientWidth <= 717) {
                    document.body.classList.add('mobile');
                } else {
                    document.body.classList.remove('mobile');
                }
                const size = 100 * (clientWidth / 1920);
                docEl.style.fontSize = (size > 100 ? 100: size) + 'px';
            };

        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        recalc()
    })(document, window);
    new Swiper('.swiper-container', {
        spaceBetween: 30,
        autoplay: 2500
    });
})

