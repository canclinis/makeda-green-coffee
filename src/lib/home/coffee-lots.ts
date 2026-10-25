export type CoffeeLotPdf = {
  label: string;
  href: string;
  fileName: string;
};

export type CoffeeLotDetailField = {
  term: string;
  description: string;
};

export type CoffeeLot = {
  id: string;
  origin: string;
  crop: string;
  bags: string;
  status: string;
  image: { src: string; alt: string; objectPosition?: string };
  selection?: string;
  summary: string;
  originDetails: CoffeeLotDetailField[];
  process: string;
  profileNote?: string;
  pdfs: CoffeeLotPdf[];
};

const sheet = (file: string, fileName: string, label = 'Origin profile (PDF)') => ({
  label,
  href: `/coffee-sheets/${file}`,
  fileName
});

export const specialtyLots: CoffeeLot[] = [
  {
    id: 'microlot-2026',
    origin: 'Fully Washed K3 Special Selection',
    crop: '2026',
    bags: '42',
    status: 'Arriving soon',
    image: {
      src: '/images/lots/cherries.jpg',
      alt: 'Ripe coffee cherries on the branch'
    },
    selection: 'Presidential selection',
    summary:
      'A highly selective, small-volume release from the Tuinuane 2026 harvest. Built on larger-cherry selection and careful screen-size grading, for roasters seeking a distinctive, traceable Kivu coffee.',
    originDetails: [
      { term: 'Country', description: 'Democratic Republic of the Congo' },
      { term: 'Region', description: 'Kivu · Kalehe Territory' },
      { term: 'Producer', description: 'Tuinuane Agricultural Cooperative' },
      { term: 'Variety', description: '100% Arabica · Red Bourbon' },
      { term: 'Altitude', description: '1,850–2,050 m a.s.l.' },
      { term: 'Packaging', description: '60 kg net · jute bags with GrainPro liners' }
    ],
    process:
      'Depulped, fermented and washed, followed by controlled drying on raised African beds. Final green coffee preparation prioritises sorting and consistency.',
    profileNote: 'Preliminary product profile · Cup scores and tasting notes intentionally omitted',
    pdfs: [
      sheet(
        'microlot-2026-presidential.pdf',
        'Makeda_2026_K3_Fully_Washed_Presidential_Photos_EN.pdf'
      )
    ]
  },
  {
    id: 'washed-k3-2026',
    origin: 'Fully Washed K3 Classic',
    crop: '2026',
    bags: '92',
    status: 'Arriving soon',
    image: {
      src: '/images/lots/drying.jpg',
      alt: 'Women sorting coffee cherries on raised drying beds'
    },
    selection: 'Specialty selection',
    summary:
      'A carefully prepared, fully washed lot from the same producer network. An origin-led specialty selection for roasters seeking traceability, clean processing and consistent green coffee.',
    originDetails: [
      { term: 'Country', description: 'Democratic Republic of the Congo' },
      { term: 'Region', description: 'Kivu · Kalehe Territory' },
      { term: 'Producer', description: 'Tuinuane Agricultural Cooperative' },
      { term: 'Variety', description: '100% Arabica · Red Bourbon' },
      { term: 'Altitude', description: '1,850–2,050 m a.s.l.' },
      { term: 'Packaging', description: '60 kg net · jute bags with GrainPro liners' }
    ],
    process:
      'Selective cherry intake, depulping, fermentation, washing and raised-bed drying form the washed-process workflow.',
    profileNote: 'Preliminary product profile · Cup scores and tasting notes intentionally omitted',
    pdfs: [sheet('fully-washed-k3-2026.pdf', 'Makeda_2026_K3_Fully_Washed_Specialty_Photos_EN.pdf')]
  },
  {
    id: 'natural-k3-special-2026',
    origin: 'Natural K3 Special Selection',
    crop: '2026',
    bags: '84',
    status: 'Arriving soon',
    image: {
      src: '/images/lots/red-cherries.jpg',
      alt: 'A basket of ripe red coffee cherries'
    },
    selection: 'Natural selected lot',
    summary:
      'The natural-process counterpart to the flagship selection. The same high-altitude Red Bourbon, expressed through whole-cherry drying and more selective lot preparation.',
    originDetails: [
      { term: 'Country', description: 'Democratic Republic of the Congo' },
      { term: 'Region', description: 'Kivu · Kalehe Territory' },
      { term: 'Producer', description: 'Tuinuane Agricultural Cooperative' },
      { term: 'Variety', description: '100% Arabica · Red Bourbon' },
      { term: 'Altitude', description: '1,850–2,050 m a.s.l.' },
      { term: 'Packaging', description: '60 kg net · jute bags with GrainPro liners' }
    ],
    process:
      'Whole coffee cherries are dried intact on raised African beds and turned regularly, before hulling and green-bean sorting.',
    profileNote: 'Preliminary product profile · Cup scores and tasting notes intentionally omitted',
    pdfs: [sheet('natural-k3-selected-2026.pdf', 'Makeda_2026_K3_Natural_Selected_Photos_EN.pdf')]
  },
  {
    id: 'natural-k3-2026',
    origin: 'Natural K3 Classic',
    crop: '2026',
    bags: '100',
    status: 'Arriving soon',
    image: {
      src: '/images/lots/sorting.jpg',
      alt: 'Women hand-sorting green coffee'
    },
    selection: 'Natural classic',
    summary:
      'A more accessible natural selection from the Tuinuane supply chain, graded less strictly than the selected natural lot. Developed for espresso programmes, blends and versatile single-origin use.',
    originDetails: [
      { term: 'Country', description: 'Democratic Republic of the Congo' },
      { term: 'Region', description: 'Kivu · Kalehe Territory' },
      { term: 'Producer', description: 'Tuinuane Agricultural Cooperative' },
      { term: 'Variety', description: '100% Arabica · Red Bourbon' },
      { term: 'Altitude', description: '1,850–2,050 m a.s.l.' },
      { term: 'Packaging', description: '60 kg net · jute bags with GrainPro liners' }
    ],
    process:
      'Whole-cherry natural processing with raised-bed drying, followed by hulling, grading and export preparation.',
    profileNote: 'Preliminary product profile · Cup scores and tasting notes intentionally omitted',
    pdfs: [sheet('natural-k3-classic-2026.pdf', 'Makeda_2026_K3_Natural_Classic_Photos_EN.pdf')]
  }
];

export const commercialLots: CoffeeLot[] = [
  {
    id: 'natural-k4-2025',
    origin: 'Natural K4',
    crop: '2025',
    bags: '1',
    status: 'In stock',
    image: {
      src: '/images/lots/picker.jpg',
      alt: 'A farmer reaching into the coffee tree'
    },
    selection: 'Natural',
    summary:
      'An approachable natural-process offer from Makeda’s 2025 Kivu range, well suited to espresso and blends, subject to sample evaluation.',
    originDetails: [
      { term: 'Country', description: 'Democratic Republic of the Congo' },
      { term: 'Region', description: 'Kivu · Lake Kivu highlands' },
      {
        term: 'Producer',
        description: 'Partner cooperative(s); lot-specific confirmation pending'
      },
      { term: 'Variety', description: 'Lot-specific confirmation pending' },
      { term: 'Altitude', description: 'Lot-specific confirmation pending' },
      { term: 'Packaging', description: '60 kg bags · liner details to be confirmed' }
    ],
    process:
      'Natural processing dries whole cherries with fruit intact before hulling and preparation. Lot-specific producer, variety and altitude are still to be confirmed.',
    profileNote: 'Preliminary product profile · Cup scores and tasting notes intentionally omitted',
    pdfs: [sheet('natural-k4-2025.pdf', 'Makeda_2025_K4_Natural_Photos_EN.pdf')]
  }
];
