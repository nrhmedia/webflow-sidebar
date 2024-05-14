document.addEventListener('DOMContentLoaded', (event) => {
  const toggles = document.querySelectorAll('.sidebar-toggle');
  const sidebars = document.querySelectorAll('.sidebar');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      toggleSidebar();
    });
  });
  window.addEventListener('resize', updateSidebarState);
  updateSidebarState(); 
});

function updateSidebarState() {
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
    const shouldOpen = shouldOpenOnStartup(sidebar);
    setSidebarState(shouldOpen, false);
  });
  updateSidebarWidth();
}

function getSidebarWidth() {
  const desktopBreakpoint = window.matchMedia('(min-width: 992px)');
  const tabletBreakpoint = window.matchMedia('(min-width: 768px) and (max-width: 991px)');
  const mobileLandscapeBreakpoint = window.matchMedia('(min-width: 480px) and (max-width: 767px)');
  const mobilePortraitBreakpoint = window.matchMedia('(max-width: 479px)');
  if (mobilePortraitBreakpoint.matches) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--nrh-media--sidebar-width-mobile-portrait').trim();
  } else if (mobileLandscapeBreakpoint.matches) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--nrh-media--sidebar-width-mobile-landscape').trim();
  } else if (tabletBreakpoint.matches) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--nrh-media--sidebar-width-tablet').trim();
  } else if (desktopBreakpoint.matches) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--nrh-media--sidebar-width-desktop').trim();
  }
}

function getSidebarPadding() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--nrh-media--sidebar-padding').trim();
}

function toggleSidebar() {
  const sidebars = document.querySelectorAll('.sidebar');
  const isOpen = sidebars[0].getAttribute('data-open') === 'true';
  setSidebarState(!isOpen, true);
}

function setSidebarState(open, animate) {
  const sidebarWidth = getSidebarWidth();
  const sidebarPadding = getSidebarPadding();
  const totalPadding = `calc(${sidebarWidth} + ${sidebarPadding})`;
  const containers = document.querySelectorAll('[sidebar-content-push="true"]');
  const sidebars = document.querySelectorAll('.sidebar');
  sidebars.forEach(sidebar => {
    if (shouldApplyPadding(sidebar)) {
      containers.forEach(container => {
        container.style.transition = animate ? 'padding-left 0.5s ease' : 'none';
        container.style.paddingLeft = open ? totalPadding : '';
      });
    }
    sidebar.style.transition = animate ? 'width 0.5s ease' : 'none';
    sidebar.style.width = open ? sidebarWidth : '0';
    sidebar.setAttribute('data-open', open);
  });
}

function shouldOpenOnStartup(sidebar) {
  const desktopBreakpoint = window.matchMedia('(min-width: 992px)').matches;
  const tabletBreakpoint = window.matchMedia('(min-width: 768px) and (max-width: 991px)').matches;
  const mobileLandscapeBreakpoint = window.matchMedia('(min-width: 480px) and (max-width: 767px)').matches;
  const mobilePortraitBreakpoint = window.matchMedia('(max-width: 479px)').matches;
  return (desktopBreakpoint && sidebar.getAttribute('desktop-startup-open') === 'yes') ||
    (tabletBreakpoint && sidebar.getAttribute('tablet-startup-open') === 'yes') ||
    (mobileLandscapeBreakpoint && sidebar.getAttribute('mobile-landscape-startup-open') === 'yes') ||
    (mobilePortraitBreakpoint && sidebar.getAttribute('mobile-portrait-startup-open') === 'yes');
}

function shouldApplyPadding(sidebar) {
  const desktopBreakpoint = window.matchMedia('(min-width: 992px)').matches;
  const tabletBreakpoint = window.matchMedia('(min-width: 768px) and (max-width: 991px)').matches;
  const mobileLandscapeBreakpoint = window.matchMedia('(min-width: 480px) and (max-width: 767px)').matches;
  const mobilePortraitBreakpoint = window.matchMedia('(max-width: 479px)').matches;
  return (desktopBreakpoint && sidebar.getAttribute('desktop-content-push') === 'yes') ||
    (tabletBreakpoint && sidebar.getAttribute('tablet-content-push') === 'yes') ||
    (mobileLandscapeBreakpoint && sidebar.getAttribute('mobile-landscape-content-push') === 'yes') ||
    (mobilePortraitBreakpoint && sidebar.getAttribute('mobile-portrait-content-push') === 'yes');
}

function updateSidebarWidth() {
  const sidebarWidth = getSidebarWidth();
  const sidebarPadding = getSidebarPadding();
  const totalPadding = `calc(${sidebarWidth} + ${sidebarPadding})`;
  const containers = document.querySelectorAll('[sidebar-content-push="true"]');
  const sidebars = document.querySelectorAll('.sidebar');
  containers.forEach(container => {
    if (container.getAttribute('data-padded') === 'true') {
      container.style.paddingLeft = totalPadding;
    }
  });
  sidebars.forEach(sidebar => {
    if (sidebar.getAttribute('data-open') === 'true') {
      sidebar.style.width = sidebarWidth;
    }
  });
}