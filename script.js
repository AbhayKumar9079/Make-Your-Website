/* =========================================================
   MAKE YOUR WEBSITE
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. HEADER
   ========================================================= */

const header = document.querySelector('.site-header');

window.addEventListener(
  'scroll',
  () => {
    if (header) {
      header.classList.toggle(
        'scrolled',
        scrollY > 30
      );
    }
  },
  { passive: true }
);


/* =========================================================
   2. MOBILE NAVIGATION
   ========================================================= */

const menu =
  document.querySelector('.menu-toggle');

const nav =
  document.querySelector('.nav-links');


if (menu && nav) {

  menu.addEventListener(
    'click',
    () => {

      nav.classList.toggle('open');

    }
  );


  document
    .querySelectorAll('.nav-links a')
    .forEach(a => {

      a.addEventListener(
        'click',
        () => {

          nav.classList.remove('open');

        }
      );

    });

}


/* =========================================================
   3. SCROLL REVEAL
   ========================================================= */

if ('IntersectionObserver' in window) {

  const io =
    new IntersectionObserver(
      entries => {

        entries.forEach(e => {

          if (e.isIntersecting) {

            e.target.classList.add(
              'show'
            );

            io.unobserve(
              e.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  document
    .querySelectorAll('.reveal')
    .forEach(el => {

      io.observe(el);

    });

} else {

  document
    .querySelectorAll('.reveal')
    .forEach(el => {

      el.classList.add('show');

    });

}


/* =========================================================
   4. COUNTERS
   ========================================================= */

document
  .querySelectorAll('[data-counter]')
  .forEach(el => {

    const target =
      parseInt(
        el.dataset.counter,
        10
      );

    const suffix =
      el.dataset.suffix || '';

    let started = false;


    if (
      !('IntersectionObserver' in window)
    ) {

      el.textContent =
        target + suffix;

      return;

    }


    const obs =
      new IntersectionObserver(
        entries => {

          if (
            entries[0].isIntersecting &&
            !started
          ) {

            started = true;

            const start = 0;
            const duration = 1300;
            const t0 =
              performance.now();


            const tick =
              now => {

                const p =
                  Math.min(
                    (now - t0) /
                    duration,
                    1
                  );


                const v =
                  Math.floor(
                    target *
                    (
                      1 -
                      Math.pow(
                        1 - p,
                        3
                      )
                    )
                  );


                el.textContent =
                  v + suffix;


                if (p < 1) {

                  requestAnimationFrame(
                    tick
                  );

                } else {

                  el.textContent =
                    target + suffix;

                }

              };


            requestAnimationFrame(
              tick
            );


            obs.disconnect();

          }

        },
        {
          threshold: 0.6
        }
      );


    obs.observe(el);

  });


/* =========================================================
   5. CURSOR GLOW
   ========================================================= */

const glow =
  document.querySelector(
    '.cursor-glow'
  );


if (
  glow &&
  matchMedia(
    '(pointer:fine)'
  ).matches
) {

  window.addEventListener(
    'pointermove',
    e => {

      glow.style.left =
        e.clientX + 'px';

      glow.style.top =
        e.clientY + 'px';

    },
    {
      passive: true
    }
  );

}


/* =========================================================
   6. WHATSAPP FORM
   ========================================================= */

function whatsappMessage(form) {

  const data =
    new FormData(form);


  const name =
    data.get('name') || '';


  const service =
    data.get('service') || '';


  const details =
    data.get('details') || '';


  const msg =
    `Hello Make Your Website,%0A%0A` +
    `Name: ${encodeURIComponent(name)}%0A` +
    `Service: ${encodeURIComponent(service)}%0A` +
    `Project details: ${encodeURIComponent(details)}`;


  window.open(
    `https://wa.me/919587677685?text=${msg}`,
    '_blank',
    'noopener'
  );

}


document
  .querySelectorAll('.whatsapp-form')
  .forEach(form => {

    form.addEventListener(
      'submit',
      e => {

        e.preventDefault();

        whatsappMessage(form);

      }
    );

  });


/* =========================================================
   7. WHATSAPP SERVICE BUTTONS
   ========================================================= */

document
  .querySelectorAll('[data-wa]')
  .forEach(btn => {

    btn.addEventListener(
      'click',
      () => {

        const service =
          btn.dataset.wa;


        window.open(
          `https://wa.me/919587677685?text=${
            encodeURIComponent(
              'Hello Make Your Website, I am interested in ' +
              service +
              '. Please guide me.'
            )
          }`,
          '_blank',
          'noopener'
        );

      }
    );

  });



/* =========================================================
   8. ANIMATED STAR FIELD
   =========================================================
   
   IMPORTANT:
   This section ONLY controls the stars.
   It does NOT change navbar, menu, buttons,
   cards or any other website functionality.
   ========================================================= */

(function initStarfield() {


  /* -------------------------------------------------------
     Create canvas
     ------------------------------------------------------- */

  let canvas =
    document.getElementById(
      'starfield'
    );


  if (!canvas) {

    canvas =
      document.createElement(
        'canvas'
      );

    canvas.id =
      'starfield';

    document.body.prepend(
      canvas
    );

  }


  const ctx =
    canvas.getContext(
      '2d'
    );


  if (!ctx) {
    return;
  }


  /* -------------------------------------------------------
     Canvas styling

     IMPORTANT:
     We only style the star canvas.
     No navbar/content z-index is changed.
     ------------------------------------------------------- */

  canvas.style.position =
    'fixed';

  canvas.style.top =
    '0';

  canvas.style.left =
    '0';

  canvas.style.width =
    '100vw';

  canvas.style.height =
    '100vh';

  canvas.style.pointerEvents =
    'none';

  canvas.style.zIndex =
    '2';

  canvas.style.opacity =
    '0.85';

  canvas.style.display =
    'block';


  /* -------------------------------------------------------
     Variables
     ------------------------------------------------------- */

  let stars = [];

  let raf = null;

  let width =
    window.innerWidth;

  let height =
    window.innerHeight;


  const reducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  /* -------------------------------------------------------
     Star count

     More visible than previous version.
     ------------------------------------------------------- */

  function getStarCount() {

    return Math.min(
      240,
      Math.max(
        100,
        Math.floor(
          (
            width *
            height
          ) / 9000
        )
      )
    );

  }


  /* -------------------------------------------------------
     Create stars
     ------------------------------------------------------- */

  function createStars() {

    stars = [];


    const count =
      getStarCount();


    for (
      let i = 0;
      i < count;
      i++
    ) {


      /*
         Distribution:

         72% White
         20% Blue
         8% Red
      */

      const random =
        Math.random();


      let color;


      if (
        random < 0.72
      ) {

        color = 'white';

      } else if (
        random < 0.92
      ) {

        color = 'blue';

      } else {

        color = 'red';

      }


      /*
         Some stars are larger
         so the background has
         the same visual depth
         as the reference.
      */

      const largeStar =
        Math.random() < 0.13;


      stars.push({

        x:
          Math.random() *
          width,

        y:
          Math.random() *
          height,


        radius:
          largeStar
            ? Math.random() *
                1.5 +
              1.2
            : Math.random() *
                0.85 +
              0.45,


        opacity:
          largeStar
            ? Math.random() *
                0.35 +
              0.60
            : Math.random() *
                0.35 +
              0.45,


        speed:
          Math.random() *
            0.18 +
          0.035,


        phase:
          Math.random() *
          Math.PI *
          2,


        twinkleSpeed:
          Math.random() *
            0.001 +
          0.0005,


        color:
          color,


        drift:
          (
            Math.random() -
            0.5
          ) * 0.08

      });

    }

  }


  /* -------------------------------------------------------
     Get color
     ------------------------------------------------------- */

  function getColor(
    star,
    alpha
  ) {


    if (
      star.color ===
      'blue'
    ) {

      return (
        'rgba(80,195,255,' +
        alpha +
        ')'
      );

    }


    if (
      star.color ===
      'red'
    ) {

      return (
        'rgba(255,75,105,' +
        alpha +
        ')'
      );

    }


    return (
      'rgba(255,255,255,' +
      alpha +
      ')'
    );

  }


  /* -------------------------------------------------------
     Resize
     ------------------------------------------------------- */

  function resize() {

    width =
      window.innerWidth;

    height =
      window.innerHeight;


    const dpr =
      Math.min(
        window.devicePixelRatio ||
        1,
        2
      );


    canvas.width =
      Math.floor(
        width * dpr
      );


    canvas.height =
      Math.floor(
        height * dpr
      );


    canvas.style.width =
      width + 'px';


    canvas.style.height =
      height + 'px';


    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );


    createStars();

  }


  /* -------------------------------------------------------
     Draw individual star
     ------------------------------------------------------- */

  function drawStar(
    star,
    time
  ) {


    /*
       Smooth twinkle
    */

    const twinkle =
      reducedMotion
        ? 1
        :
          (
            0.65 +
            0.35 *
            Math.sin(
              time *
              star.twinkleSpeed +
              star.phase
            )
          );


    const alpha =
      Math.max(
        0.18,
        Math.min(
          1,
          star.opacity *
          twinkle
        )
      );


    /*
       Main glow
    */

    if (
      star.radius >
      1.1
    ) {

      if (
        star.color ===
        'red'
      ) {

        ctx.shadowColor =
          'rgba(255,75,105,0.75)';

      } else if (
        star.color ===
        'blue'
      ) {

        ctx.shadowColor =
          'rgba(80,195,255,0.75)';

      } else {

        ctx.shadowColor =
          'rgba(255,255,255,0.80)';

      }


      ctx.shadowBlur =
        star.radius *
        5;

    }


    /*
       Main dot
    */

    ctx.beginPath();


    ctx.arc(
      star.x,
      star.y,
      star.radius,
      0,
      Math.PI * 2
    );


    ctx.fillStyle =
      getColor(
        star,
        alpha
      );


    ctx.fill();


    ctx.shadowBlur =
      0;


    /*
       Cross glow on larger stars
    */

    if (
      star.radius >
      1.45
    ) {

      const length =
        star.radius *
        3.5;


      ctx.strokeStyle =
        getColor(
          star,
          alpha * 0.45
        );


      ctx.lineWidth =
        0.6;


      ctx.beginPath();


      /*
         Horizontal
      */

      ctx.moveTo(
        star.x -
        length,
        star.y
      );


      ctx.lineTo(
        star.x +
        length,
        star.y
      );


      /*
         Vertical
      */

      ctx.moveTo(
        star.x,
        star.y -
        length
      );


      ctx.lineTo(
        star.x,
        star.y +
        length
      );


      ctx.stroke();

    }

  }


  /* -------------------------------------------------------
     Animation
     ------------------------------------------------------- */

  function animate(
    time
  ) {


    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    stars.forEach(
      star => {


        /*
           Very slow vertical movement
        */

        if (
          !reducedMotion
        ) {

          star.y -=
            star.speed *
            0.035;


          star.x +=
            star.drift;

        }


        /*
           Wrap screen
        */

        if (
          star.y <
          -8
        ) {

          star.y =
            height + 8;

        }


        if (
          star.y >
          height + 8
        ) {

          star.y =
            -8;

        }


        if (
          star.x <
          -8
        ) {

          star.x =
            width + 8;

        }


        if (
          star.x >
          width + 8
        ) {

          star.x =
            -8;

        }


        drawStar(
          star,
          time
        );

      }
    );


    if (
      !reducedMotion
    ) {

      raf =
        requestAnimationFrame(
          animate
        );

    }

  }


  /* -------------------------------------------------------
     Start
     ------------------------------------------------------- */

  resize();


  window.addEventListener(
    'resize',
    resize,
    {
      passive: true
    }
  );


  /*
     Draw static stars when
     reduced motion is enabled.
  */

  if (
    reducedMotion
  ) {

    animate(0);

  } else {

    raf =
      requestAnimationFrame(
        animate
      );

  }


})();


/* =========================================================
   END OF JAVASCRIPT
   ========================================================= */