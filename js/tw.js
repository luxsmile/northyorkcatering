// Colours and fonts for the whole site (Tailwind settings).
// Palette: emerald green + coral + sunny yellow on warm cream.
tailwind.config = {
  theme: { extend: {
    colors: {
      brand: '#0B7A57',    /* emerald green: header, big bands */
      branddk: '#08603F',
      navy: '#14213D',     /* deep navy: top bar, footer */
      coral: '#FF5A4E',    /* buttons and highlights */
      coraldk: '#E2443A',
      sun: '#E8C468',      /* sunny yellow accents */
      cream: '#FFF7EA',    /* page background */
      peach: '#FFD9CC',
      mint: '#C3F0D8',
      lilac: '#E4DAFF',
      sky: '#CDEBFA',
      ink: '#221F1D',
      mute: '#5F5851',
      line: '#F2E3C9'
    },
    fontFamily: { brandname: ['"Playfair Display"', 'serif'], head: ['"Cormorant Garamond"', 'serif'], sans: ['Poppins', 'sans-serif'] }
  } }
};
