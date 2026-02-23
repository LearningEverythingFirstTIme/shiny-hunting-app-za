import confetti from 'canvas-confetti';

// Sylveon color palette
const SYLVEON_COLORS = {
  pink: '#FFB7C5',
  hotPink: '#FF69B4',
  lightPink: '#FFE4E9',
  white: '#FFFFFF',
  cream: '#FFF8F0',
  lightBlue: '#87CEEB',
  skyBlue: '#B0E0F0',
  periwinkle: '#C5D1EB'
};

// Create and animate screen flash overlay
function screenFlash() {
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 70%);
    pointer-events: none;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.1s ease-out;
  `;
  document.body.appendChild(flash);

  // Trigger flash
  requestAnimationFrame(() => {
    flash.style.opacity = '1';
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 300);
    }, 150);
  });
}

// Create floating "+1 SHINY!" text
function floatingText(encounters: number, durationMinutes: number) {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9998;
    pointer-events: none;
    text-align: center;
  `;

  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  container.innerHTML = `
    <div class="shiny-float-text" style="
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF69B4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 0 30px rgba(255,215,0,0.5);
      animation: floatUp 2s ease-out forwards;
    ">+1 SHINY!</div>
    <div class="shiny-stats" style="
      font-size: 1rem;
      color: #4A3A4B;
      margin-top: 0.5rem;
      opacity: 0;
      animation: fadeInUp 0.5s ease-out 0.3s forwards;
    ">${encounters.toLocaleString()} encounters · ${timeStr}</div>
  `;

  // Add keyframes if not already present
  if (!document.getElementById('shiny-celebration-styles')) {
    const style = document.createElement('style');
    style.id = 'shiny-celebration-styles';
    style.textContent = `
      @keyframes floatUp {
        0% { transform: translateY(0) scale(0.5); opacity: 0; }
        20% { transform: translateY(-20px) scale(1.1); opacity: 1; }
        40% { transform: translateY(-30px) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(0.9); opacity: 0; }
      }
      @keyframes fadeInUp {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes spritePulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 2000);
}

// Pulse the shiny sprite
function pulseSprite() {
  // Find any shiny sprites on the page
  const sprites = document.querySelectorAll('img[src*="shiny"]');
  sprites.forEach(sprite => {
    (sprite as HTMLElement).style.animation = 'spritePulse 0.6s ease-out';
    setTimeout(() => {
      (sprite as HTMLElement).style.animation = '';
    }, 600);
  });
}

export function celebrateShiny(encounters: number = 0, durationMinutes: number = 0) {
  console.log('🎉 Celebration triggered!', { encounters, durationMinutes });

  // Screen flash first
  screenFlash();

  // Pulse any visible shiny sprites
  pulseSprite();

  // Floating text with stats
  floatingText(encounters, durationMinutes);

  const colors = [
    SYLVEON_COLORS.pink,
    SYLVEON_COLORS.hotPink,
    SYLVEON_COLORS.lightPink,
    SYLVEON_COLORS.white,
    SYLVEON_COLORS.cream,
    SYLVEON_COLORS.lightBlue,
    SYLVEON_COLORS.skyBlue,
    SYLVEON_COLORS.periwinkle
  ];

  // Small delay for confetti to let flash settle
  setTimeout(() => {
    console.log('🎊 Firing confetti...');

    // Main burst from center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      shapes: ['circle', 'square'],
      scalar: 1.2,
      gravity: 0.8,
      drift: 0,
      ticks: 200
    });

    // Side bursts for extra flair
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1
      });
    }, 100);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1
      });
    }, 200);

    // Final sparkle burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: [SYLVEON_COLORS.white, SYLVEON_COLORS.lightPink, SYLVEON_COLORS.lightBlue],
        shapes: ['circle'],
        scalar: 0.8,
        gravity: 0.5,
        drift: 0.2
      });
    }, 400);
  }, 200);
}
