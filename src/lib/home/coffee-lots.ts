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
  highlights?: string[];
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
      'A highly selective small-volume release from the Tuinuane 2026 harvest. Positioned around larger cherry selection and careful screen-size grading, for roasters seeking a distinctive and traceable Kivu offering.',
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
    id: 'microlot-2025',
    origin: 'Fully Washed K3 Special Selection',
    crop: '2025',
    bags: '2',
    status: 'In store',
    image: {
      src: '/images/lots/picking.jpg',
      alt: 'Farmers picking coffee cherries',
      objectPosition: 'center'
    },
    selection: 'Fully washed microlot',
    summary:
      'A producer-led Kivu coffee from Makeda’s 2025 crop, highlighting partner farming communities in the Lake Kivu highlands. Documented on an SCA extrinsic assessment for this washed K3 lot.',
    originDetails: [
      { term: 'Country', description: 'Democratic Republic of the Congo' },
      { term: 'Region', description: 'Kivu Region' },
      { term: 'Cooperative', description: 'Tuinuane Agricultural Cooperative' },
      { term: 'Producer network', description: 'Amka Cooperative' },
      { term: 'Variety', description: 'Arabica · Red Bourbon' },
      { term: 'Harvest', description: 'March–July 2025' },
      { term: 'Processor', description: 'Nobo washing station · African bed drying' },
      { term: 'Fermentation', description: '12 h depulped fermentation in water' },
      { term: 'Drying', description: 'Approx. 24 h on African beds' },
      { term: 'Importer', description: 'Makeda Green Coffee AB' }
    ],
    process:
      'Fully washed: selective cherry intake, depulping, fermentation in water, washing and raised-bed drying at 1,850–2,050 m a.s.l.',
    highlights: [
      '5th place — Best of Congo Cooperative Competition 2025',
      'Importer operating in a high-risk zone; UNHCR estimates 1.7 million refugees in the region (2024 source noted on assessment)'
    ],
    pdfs: [
      sheet('microlot-2025-photos.pdf', 'Makeda_2025_K3_Fully_Washed_Photos_EN.pdf'),
      sheet('cupping-note-sca-2025-microlot.pdf', 'Cupping note SCA.pdf', 'SCA cupping note (PDF)')
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
      'A carefully prepared fully washed lot from the same producer network. An origin-led specialty selection for roasters seeking traceability, clarity of processing and a consistent green-coffee offering.',
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
      'The natural-process counterpart to the flagship selection. The same high-altitude Red Bourbon origin is expressed through whole-cherry drying and a more selective approach to lot preparation.',
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
      'A more accessible natural selection from the Tuinuane supply chain, with a less restrictive grade than the selected natural lot. Developed for espresso programmes, blends and versatile single-origin applications.',
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
    status: 'In store',
    image: {
      src: '/images/lots/picker.jpg',
      alt: 'A farmer reaching into the coffee tree'
    },
    selection: 'Natural',
    summary:
      'An approachable natural-process offer from Makeda’s 2025 Kivu range, well positioned for espresso and blend applications, subject to sample evaluation.',
    originDetails: [
      { term: 'Country', description: 'Democratic Republic of the Congo' },
      { term: 'Region', description: 'Kivu · Lake Kivu highlands' },
      {
        term: 'Producer',
        description: 'Partner cooperative(s); lot-specific confirmation pending'
      },
      { term: 'Variety', description: 'Lot-specific confirmation pending' },
      { term: 'Altitude', description: 'Lot-specific confirmation pending' },
      { term: 'Packaging', description: '60 kg bags · liner details to verify' }
    ],
    process:
      'Natural processing dries whole cherries with fruit intact before hulling and preparation. Lot-specific producer, variety and altitude remain to be verified.',
    profileNote: 'Preliminary product profile · Cup scores and tasting notes intentionally omitted',
    pdfs: [sheet('natural-k4-2025.pdf', 'Makeda_2025_K4_Natural_Photos_EN.pdf')]
  }
];
