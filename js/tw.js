// Colours and fonts for the whole site (Tailwind settings).
// Palette: black, white and champagne gold, with black ink for text.
tailwind.config = {
  theme: { extend: {
    colors: {
      brand: '#15110C',    /* rich black: banners and bands */
      branddk: '#0A0A0A',
      navy: '#0A0A0A',     /* black: top bar and footer */
      coral: '#9C7424',    /* champagne gold (text and accents on white) */
      coraldk: '#7E5C14',
      sun: '#D9B572',      /* bright champagne gold (on dark) */
      cream: '#FFFFFF',    /* page background: white */
      peach: '#F8F4EA',    /* warm ivory panel */
      mint: '#F4EEDD',     /* pale champagne tint */
      lilac: '#F8F4EA',
      sky: '#F4EEDD',
      ink: '#0A0A0A',      /* black ink for text */
      mute: '#444444',
      line: '#E8E0CC'
    },
    fontFamily: { brandname: ['"Playfair Display"', 'serif'], head: ['"Cormorant Garamond"', 'serif'], sans: ['Poppins', 'sans-serif'] }
  } }
};
