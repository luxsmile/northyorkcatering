// Colours and fonts for the whole site (Tailwind settings).
// Palette: antique gold + copper + ivory, with black ink for text.
tailwind.config = {
  theme: { extend: {
    colors: {
      brand: '#9A7420',    /* antique gold: bands and banners */
      branddk: '#6F5214',  /* deep bronze */
      navy: '#16110A',     /* espresso black: top bar and footer */
      coral: '#A8441C',    /* burnt copper accent */
      coraldk: '#8A3714',
      sun: '#E6C46A',      /* bright imperial gold (on dark) */
      cream: '#FFFFFF',    /* page background: white */
      peach: '#F8F2E4',    /* warm ivory panel */
      mint: '#F6EFD9',     /* pale gold tint */
      lilac: '#F8F2E4',
      sky: '#F6EFD9',
      ink: '#0A0A0A',      /* black ink for text */
      mute: '#444444',
      line: '#E8DFC9'
    },
    fontFamily: { brandname: ['"Playfair Display"', 'serif'], head: ['"Cormorant Garamond"', 'serif'], sans: ['Poppins', 'sans-serif'] }
  } }
};
