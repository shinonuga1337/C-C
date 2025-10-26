document.addEventListener("DOMContentLoaded", () => {
  /* === QUOTE SOUND ANIMATION === */
  const soundBtn = document.getElementById("sound-btn");
  const audio = document.getElementById("quote-audio");
  const quote = document.getElementById("quote-text");

  if (quote) {
    const htmlText = quote.innerHTML.replace(/<br\s*\/?>/gi, "¶");
    quote.innerHTML = "";
    for (let char of htmlText) {
      if (char === "¶") {
        const br = document.createElement("br");
        quote.appendChild(br);
      } else {
        const span = document.createElement("span");
        span.textContent = char;
        quote.appendChild(span);
      }
    }
  }

  if (soundBtn && audio && quote) {
    soundBtn.addEventListener("click", () => {
      const spans = quote.querySelectorAll("span");
      const total = spans.length;
      const duration = 9000;
      const step = duration / total;
      spans.forEach(s => s.classList.remove("highlight"));
      audio.currentTime = 0;
      audio.play();
      let i = 0;
      const interval = setInterval(() => {
        if (i >= total) {
          clearInterval(interval);
          setTimeout(() => spans.forEach(s => s.classList.remove("highlight")), 600);
          return;
        }
        spans[i].classList.add("highlight");
        i++;
      }, step);
    });
  }

  /* === SCROLL AUTOPLAY FOR VIDEOS === */
  const blocks = document.querySelectorAll('.block');
  function checkVisibility() {
    const triggerBottom = window.innerHeight * 0.85;
    blocks.forEach(block => {
      const rect = block.getBoundingClientRect();
      const video = block.querySelector('video');
      if (rect.top < triggerBottom && rect.bottom > 0) {
        block.classList.add('visible');
        if (video && video.paused) video.play().catch(() => {});
      } else {
        if (video && !video.paused) video.pause();
      }
    });
  }
  window.addEventListener('scroll', checkVisibility);
  window.addEventListener('load', checkVisibility);

  /* === SKILLS SECTION === */
  const skillsList = document.getElementById('skills-list');
  const tooltip = document.getElementById('skill-tooltip');

  if (skillsList && tooltip) {
    const nextBtn = document.querySelector('.next-btn');
    const nameText = document.getElementById('char-name-text');
    const roleMain = document.getElementById('role-main');
    const tagsRow = document.querySelector('.role-tags');
    const charImg = document.getElementById('character-img');
    const durabilityImg = document.getElementById('durability');
    const offenseImg = document.getElementById('offense');
    const abilityImg = document.getElementById('ability');
    const difficultyImg = document.getElementById('difficulty');
    const skillsBg = document.getElementById('skills-bg');

    const data = [
      {
        name: 'Cecilion',
        img: 'assets/cecilion.png',
        role: 'Mage',
        tags: ['Poke', 'Burst'],
        skillIcons: [
          'assets/cecskill1.png',
          'assets/cecskill2.png',
          'assets/cecskill3.png',
          'assets/cecskill4.png',
          'assets/cecskill5.png'
        ],
        stats: {
          durability: 'assets/durability (2).png',
          offense: 'assets/offense (2).png',
          ability: 'assets/ability (2).png',
          difficulty: 'assets/difficulty (2).png'
        }
      },
      {
        name: 'Carmilla',
        img: 'assets/carmilla.png',
        role: 'Support',
        tags: ['Crowd Control', 'Damage'],
        skillIcons: [
          'assets/carskill1.png',
          'assets/carskill2.png',
          'assets/carskill3.png',
          'assets/carskill4.png'
        ],
        stats: {
          durability: 'assets/durability2.png',
          offense: 'assets/offense2.png',
          ability: 'assets/ability (3).png',
          difficulty: 'assets/difficulty2.png'
        }
      }
    ];

    let idx = 0;

    function fadeSwapImage(imgEl, newSrc, delay = 0) {
      if (!imgEl) return;
      imgEl.style.transition = 'opacity 220ms ease';
      imgEl.style.opacity = 0;
      setTimeout(() => {
        imgEl.src = newSrc;
        imgEl.style.opacity = 1;
      }, 180 + delay);
    }

    function updateCharacter(i) {
      if (nameText) nameText.textContent = data[i].name;
      if (roleMain) roleMain.textContent = data[i].role;

      // смещение подписей под Carmilla
      const charType = document.querySelector(".character-type");
      if (charType) {
        charType.style.left = data[i].name === "Carmilla" ? "-160px" : "-220px";
      }

      // обновляем теги
      if (tagsRow) {
        tagsRow.innerHTML = '';
        data[i].tags.forEach(t => {
          const sp = document.createElement('span');
          sp.className = 'tag';
          sp.textContent = t;
          tagsRow.appendChild(sp);
        });
      }

      // фон
      if (skillsBg && data[i].img) {
        skillsBg.style.backgroundImage = `url(${data[i].img})`;
      }

      // портрет
      if (charImg && data[i].img) fadeSwapImage(charImg, data[i].img);

      // иконки скиллов
      const skillEls = skillsList.querySelectorAll('.skill img.skill-circle');
      data[i].skillIcons.forEach((src, sIdx) => {
        if (skillEls[sIdx]) fadeSwapImage(skillEls[sIdx], src, sIdx * 40);
      });

      // шкалы
      const statEls = [durabilityImg, offenseImg, abilityImg, difficultyImg];
      const keys = ['durability', 'offense', 'ability', 'difficulty'];
      statEls.forEach((el, k) => {
        if (el) fadeSwapImage(el, data[i].stats[keys[k]], k * 60);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        idx = (idx + 1) % data.length;
        updateCharacter(idx);
      });
    }

    /* === TOOLTIP === */
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = 9999;
    tooltip.classList.remove('visible');

    skillsList.querySelectorAll('.skill').forEach(skill => {
      skill.addEventListener('mouseenter', (e) => {
        const desc = skill.dataset.desc;
        if (!desc) return;
        tooltip.textContent = desc;
        tooltip.style.display = 'block';
        tooltip.classList.add('visible');

        const rect = skill.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 12}px`;
      });

      skill.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.pageX - tooltip.offsetWidth / 2 + "px";
        tooltip.style.top = e.pageY + 15 + "px";
      });

      skill.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
        tooltip.style.display = 'none';
      });
    });

    updateCharacter(0);
  }
});

// ===== Moonlit simple video controls (optional) =====
(function() {
  const video = document.getElementById('mw-video');
  if (!video) return;

})();

// === GALLERY INTERACTION ===
document.addEventListener("DOMContentLoaded", () => {
  const mainImg = document.getElementById("gallery-main");
  const thumbs = document.querySelectorAll(".thumb");
  const saveBtn = document.getElementById("save-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
      if (thumb.src === mainImg.src) return;

      const temp = mainImg.src;
      mainImg.classList.add("fade-out");
      thumb.classList.add("fade-out");

      setTimeout(() => {
        mainImg.src = thumb.src;
        thumb.src = temp;
        mainImg.classList.remove("fade-out");
        thumb.classList.remove("fade-out");
      }, 300);
    });
  });

  // Сохранить изображение
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = mainImg.src;
      a.download = mainImg.src.split("/").pop();
      a.click();
    });
  }

  // Открыть в новой вкладке
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      const win = window.open(mainImg.src, "_blank");
      if (win) win.focus();
    });
  }
});

window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 800);
});

// === Sticky Navbar Animation ===
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
      navbar.classList.add("shrink");
    } else {
      navbar.classList.remove("shrink");
    }
  });
});

// === Smooth scroll for anchor links ===
document.querySelectorAll('.scroll-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); 
    const targetID = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetID);
    if (!targetSection) return;

    // плавная прокрутка
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});

// Появление секций при скролле
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.15 });

sections.forEach(section => observer.observe(section));

window.addEventListener('scroll', () => {
  const bg = document.querySelector('.history-bg');
  if (bg) bg.style.transform = `translateY(${window.scrollY * 0.15}px)`;
});

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  document.getElementById('scroll-progress').style.width = progress + '%';
});

const waltzVideos = document.querySelectorAll('.moonlit-section video');

waltzVideos.forEach(video => {
  video.addEventListener('mouseenter', () => {
    video.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease';
    video.style.filter = 'brightness(1)';
    video.style.transform = 'scale(1.03)';
    video.style.boxShadow = '0 12px 30px rgba(0,0,0,0.5), 0 0 15px rgba(48,58,125,0.5)';
  });

  video.addEventListener('mouseleave', () => {
    video.style.filter = 'brightness(0.85)';
    video.style.transform = 'scale(1)';
    video.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
  });
});