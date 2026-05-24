document.addEventListener('DOMContentLoaded', () => {
  // --- 1. 현재 활성 페이지 표시 ---
  highlightActiveNavLink();

  // --- 2. 스크롤 시 헤더 디자인 전환 ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 3. 모바일 네비게이션 토글 ---
  const burger = document.querySelector('.burger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (burger) {
    burger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      burger.classList.toggle('toggle');
    });

    // 메뉴 링크 클릭 시 모바일 메뉴 닫기
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        burger.classList.remove('toggle');
      });
    });
  }

  // --- 4. 스크롤 진입 감지 애니메이션 (Intersection Observer) ---
  const fadeInUpElements = document.querySelectorAll('.fade-in-up');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeInUpObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // 한 번 노출되면 관찰 해제
      }
    });
  }, observerOptions);

  fadeInUpElements.forEach(el => fadeInUpObserver.observe(el));

  // --- 5. 숫자 카운터 애니메이션 (메인 전용) ---
  const counterSection = document.querySelector('.counters-section');
  if (counterSection) {
    const counters = document.querySelectorAll('.counter-number');
    const counterObserverOptions = {
      threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(counter => {
            animateCounter(counter);
          });
          observer.unobserve(entry.target);
        }
      });
    }, counterObserverOptions);

    counterObserver.observe(counterSection);
  }

  function animateCounter(counterElement) {
    const target = parseInt(counterElement.getAttribute('data-target'), 10);
    const suffix = counterElement.getAttribute('data-suffix') || '';
    let current = 0;
    const duration = 2000; // 2초간 실행
    const stepTime = Math.max(Math.floor(duration / target), 30);
    
    const timer = setInterval(() => {
      current += 1;
      counterElement.innerText = current + suffix;
      if (current >= target) {
        counterElement.innerText = target + suffix;
        clearInterval(timer);
      }
    }, stepTime);
  }

  // --- 6. 스킬바 프로그레스 애니메이션 (소개 페이지 전용) ---
  const skillsSection = document.querySelector('.skills-detail-section');
  if (skillsSection) {
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    skillsObserver.observe(skillsSection);
  }

  // --- 7. 논문 & 프로젝트 실시간 검색/필터 (연구 페이지 전용) ---
  const searchInput = document.getElementById('research-search');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const paperItems = document.querySelectorAll('.paper-item');
  const projectItems = document.querySelectorAll('.project-item');
  const papersListContainer = document.querySelector('.papers-list');
  const projectsGridContainer = document.querySelector('.projects-grid');

  if (tabButtons.length > 0) {
    let currentTab = 'all';

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.getAttribute('data-tab');
        filterResearchContent(currentTab, searchInput ? searchInput.value : '');
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterResearchContent(currentTab, e.target.value);
      });
    }

    function filterResearchContent(tab, keyword) {
      const cleanKeyword = keyword.toLowerCase().trim();

      // 컨테이너 레이아웃 표시 제어
      if (tab === 'papers') {
        if (papersListContainer) papersListContainer.style.display = 'flex';
        if (projectsGridContainer) projectsGridContainer.style.display = 'none';
      } else if (tab === 'projects') {
        if (papersListContainer) papersListContainer.style.display = 'none';
        if (projectsGridContainer) projectsGridContainer.style.display = 'grid';
      } else {
        // 'all'
        if (papersListContainer) papersListContainer.style.display = 'flex';
        if (projectsGridContainer) projectsGridContainer.style.display = 'grid';
      }

      // 논문 필터링
      paperItems.forEach(item => {
        const text = item.innerText.toLowerCase();
        const matchesTab = (tab === 'all' || tab === 'papers');
        const matchesKeyword = text.includes(cleanKeyword);

        if (matchesTab && matchesKeyword) {
          item.style.display = 'block';
          item.classList.add('fade-in-up', 'visible');
        } else {
          item.style.display = 'none';
        }
      });

      // 프로젝트 필터링
      projectItems.forEach(item => {
        const text = item.innerText.toLowerCase();
        const matchesTab = (tab === 'all' || tab === 'projects');
        const matchesKeyword = text.includes(cleanKeyword);

        if (matchesTab && matchesKeyword) {
          item.style.display = 'flex';
          item.classList.add('fade-in-up', 'visible');
        } else {
          item.style.display = 'none';
        }
      });
    }
  }

  // --- 8. 연락처 폼 유효성 검사 및 전송 시뮬레이션 (연락처 페이지 전용) ---
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();
      const statusBox = document.getElementById('form-status');
      const submitBtn = contactForm.querySelector('.submit-btn');

      if (!name || !email || !subject || !message) {
        alert('모든 필드를 입력해 주세요.');
        return;
      }

      // 전송 로딩 애니메이션 시뮬레이션
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 전송 중...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        // 성공 메시지 노출
        statusBox.classList.add('success');
        statusBox.innerHTML = `<i class="fas fa-check-circle"></i> 감사합니다, <strong>${name}</strong>님! 메시지가 정상적으로 전송되었습니다. 빠른 시일 내에 이메일(${email})로 회신해 드리겠습니다.`;
        
        // 폼 리셋
        contactForm.reset();

        // 8초 후 메시지 자동 숨김
        setTimeout(() => {
          statusBox.classList.remove('success');
          statusBox.innerHTML = '';
        }, 8000);
      }, 1500);
    });
  }
});

// 네비게이션 하이라이트 기능 정의
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === 'index.html' && href === './') || (pageName === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
