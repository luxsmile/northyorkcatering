// Colours and fonts for the whole site (Tailwind settings).
// Palette: green + dark orange + light tints, with black ink for text.
tailwind.config = {
  theme: { extend: {
    colors: {
      brand: '#0B7A57',    /* green accent */
      branddk: '#08603F',
      navy: '#0F2A1F',     /* very dark green: top bar and footer */
      coral: '#C8561A',    /* dark orange accent */
      coraldk: '#A94613',
      sun: '#E9B872',      /* champagne tone (on dark backgrounds) */
      cream: '#FFFFFF',    /* page background: white */
      peach: '#F8F3EC',    /* warm ivory panel */
      mint: '#F0F6F1',    /* whisper of green */
      lilac: '#F8F3EC',
      sky: '#F0F6F1',
      ink: '#0A0A0A',      /* black ink for text */
      mute: '#444444',
      line: '#E6E0D6'
    },
    fontFamily: { brandname: ['"Playfair Display"', 'serif'], head: ['"Cormorant Garamond"', 'serif'], sans: ['Poppins', 'sans-serif'] }
  } }
};
