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

export function celebrateShiny() {
  console.log('🎉 Celebration triggered!');

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

  // Small delay to ensure DOM is ready
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
  }, 100);
}
