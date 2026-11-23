export interface CategoryCopy {
  intro: string;
  faq: { q: string; a: string }[];
  /** Optional page <title> (before the site-name suffix) and meta description; fall back to the shared category label/description. */
  seoTitle?: string;
  seoDescription?: string;
  /** Optional sourced legal-status note shown under the hero, with its sources. Must state host-jurisdiction legality only. */
  legalNote?: { paragraphs: string[]; sources: { title: string; url: string }[] };
}

export const CATEGORY_COPY: Record<string, CategoryCopy> = {
  psilocybin: {
    seoTitle: "Psilocybin Retreats for Australians: Where They're Legal",
    seoDescription:
      "Psilocybin retreats for Australians in the Netherlands, Jamaica and Oregon, where they're legal. Not legal in Australia. Compare screening and safety.",
    intro:
      'Psilocybin retreats operate legally in a small number of jurisdictions, most notably the Netherlands (via legally-sold psilocybin-containing truffles) and Jamaica (where psilocybin mushrooms are not scheduled). We list only operators publicly stating they operate within their host jurisdiction\'s law — verify current legal status before booking, and see our legal status pages for each destination.',
    // TODO-ADAM: the Netherlands lines rest on DutchNews reporting plus operator explainers; the Dutch Opium Act text
    // (wetten.overheid.nl) blocked automated fetches. Check against the Act or a government.nl page before merge if you can.
    legalNote: {
      paragraphs: [
        'Where these retreats operate lawfully: every psilocybin retreat in this directory is in the Netherlands, Jamaica or Oregon (USA), and each rests on a different legal basis.',
        'Netherlands: adults can legally buy and use psilocybin-containing truffles (sclerotia). The 2008 ban on fresh magic mushrooms, which joined an existing ban on dried ones, did not include truffles, and growing and selling them remains legal. Retreats there use truffles, not mushrooms.',
        'Jamaica: psilocybin mushrooms were never made illegal, and the government has set interim protocols, through its Plant Quarantine Division, for people who cultivate or process them. When the government set out those protocols in 2021, no regulations for the industry had been made, and we know of no licensing system for retreat centres, so safety depends on the operator.',
        'Oregon: adults 21 and over can take part only at a service centre licensed by the Oregon Health Authority, with a licensed facilitator. No prescription or Oregon residency is needed, and psilocybin products must be consumed on site. Outside that licensed program it is not legal, and psilocybin remains a Schedule I controlled substance under US federal law.',
        'Psilocybin is not legal in Australia outside narrow medical and research pathways. Psilocybine in preparations for treatment-resistant depression is in Schedule 8 of the Poisons Standard and can be prescribed only by an authorised psychiatrist, or used in an approved clinical trial; otherwise psilocybin and psilocin are Schedule 9 prohibited substances, and every state and territory controls them. Bringing psilocybin, truffles or mushrooms into Australia is a serious offence, even if they were legal where you took part. Australians travel at their own responsibility; this is not medical advice.',
      ],
      sources: [
        { title: 'DutchNews: Court upholds magic mushroom ban (Nov 2008)', url: 'https://www.dutchnews.nl/2008/11/court_upholds_magic_mushroom_b/' },
        { title: 'DutchNews: Mass investments hit magic truffle business (Jan 2021)', url: 'https://www.dutchnews.nl/2021/01/high-earnings-potential-mass-investments-hit-magic-truffle-business' },
        { title: 'Jamaica Information Service: Protocols in place for magic mushrooms (Jul 2021)', url: 'https://jis.gov.jm/protocols-in-place-for-magic-mushrooms/' },
        { title: 'Oregon Health Authority: Accessing psilocybin services', url: 'https://www.oregon.gov/oha/ph/preventionwellness/pages/psilocybin-access-psilocybin-services.aspx' },
        { title: '21 CFR 1308.11 (US federal Schedule I), via Cornell LII', url: 'https://www.law.cornell.edu/cfr/text/21/1308.11' },
        { title: 'Poisons Standard October 2026 (Cth): psilocybine (Schedule 8) and psilocybin/psilocin (Schedule 9)', url: 'https://www.legislation.gov.au/F2026L01327/latest/text' },
        { title: 'TGA: Prescribing MDMA or psilocybine (psychiatrists)', url: 'https://www.tga.gov.au/resources/explore-topic/mdma-and-psilocybine-hub' },
        { title: 'Criminal Code Regulations 2019 (Cth): border controlled drugs and plants', url: 'https://www.legislation.gov.au/F2019L00561/latest/text' },
      ],
    },
    faq: [
      { q: 'Is psilocybin legal in Australia?', a: 'Only through narrow medical and research pathways. Psilocybine can be prescribed by an authorised psychiatrist for treatment-resistant depression (Schedule 8) or used in an approved clinical trial; otherwise psilocybin is a Schedule 9 prohibited substance and is controlled in every state and territory. There are no legal psilocybin retreats in Australia. Our state-by-state psilocybin guide has the detail. This is general information, not legal advice.' },
      { q: 'Where are psilocybin retreats legal?', a: 'The retreats in this directory are in the Netherlands (where psilocybin truffles are legal), Jamaica (where psilocybin mushrooms were never made illegal) and Oregon, USA (state-licensed service centres only, adults 21 and over). Law changes, so verify current status before booking.' },
      { q: 'Is it legal for an Australian to attend a psilocybin retreat overseas?', a: 'Legality depends on the host country\'s law, not Australia\'s — we note each destination\'s legal status on its destination page. This is general information, not legal advice; always verify current law before travelling, including any Australian import/re-entry considerations for your return.' },
      { q: 'Are these retreats medically supervised?', a: 'Screening and supervision practices vary significantly by operator. Check each listing\'s vetting checklist for what the operator publicly states about medical/psychological screening — "stated" does not mean independently verified.' },
    ],
  },
  ayahuasca: {
    seoTitle: 'Ayahuasca Retreats for Australians: Peru & the Law',
    seoDescription:
      'Ayahuasca retreats Australians travel to in Peru, where ceremony is legally protected. Not legal in Australia. Compare operators on screening and safety.',
    intro:
      'Ayahuasca retreats are most commonly offered in Peru, where its traditional and ceremonial use has long-standing legal protection. Safety practices, facilitator training and screening vary widely between centres, so this is one of the most important categories to vet carefully.',
    legalNote: {
      paragraphs: [
        'Where these retreats operate lawfully: every ayahuasca retreat in this directory is in Peru. Peru entered a reservation to the 1971 UN Convention on Psychotropic Substances excluding ayahuasca, and in 2008 declared traditional ayahuasca knowledge and ceremony part of its national cultural heritage. That protects the tradition, not any one business: Peru has no licensing system for retreat centres, so safety depends on the operator.',
        'Costa Rica is often marketed for ayahuasca, but its legal position is ambiguous: DMT, ayahuasca\'s active compound, is controlled there, and its Ministry of Health issued a public health warning in January 2025. We do not list Costa Rica ayahuasca retreats.',
        'Ayahuasca is not legal in Australia. DMT is a Schedule 9 prohibited substance in the Poisons Standard, and bringing any ayahuasca or DMT into Australia is a serious offence, even if it was legal where you took part. Australians travel at their own responsibility; this is not medical advice.',
      ],
      sources: [
        { title: 'ICEERS: Ayahuasca in Peru', url: 'https://www.iceers.org/peru/' },
        { title: 'Ayahuasca declared Peruvian national cultural heritage (2008)', url: 'https://ayahuasca.com/news/ayahuasca-national-cultural-heritage/' },
        { title: 'Tico Times: Costa Rica issues health warning on ayahuasca, ibogaine use (Jan 2025)', url: 'https://ticotimes.net/2025/01/28/costa-rica-issues-health-warning-on-ayahuasca-ibogaine-use' },
        { title: 'Poisons Standard October 2026 (Cth), Schedule 9: N,N-dimethyltryptamine (DMT)', url: 'https://www.legislation.gov.au/F2026L01327/latest/text' },
      ],
    },
    faq: [
      { q: 'Is ayahuasca legal in Australia?', a: 'No. DMT, the active compound in ayahuasca, is a Schedule 9 prohibited substance in Australia, and there are no legal ayahuasca retreats here. Importing ayahuasca or DMT is a serious offence even if you took part legally overseas. See our Australian legal guide for detail. This is general information, not legal advice.' },
      { q: 'Where are ayahuasca retreats legal?', a: 'Peru has the clearest legal position, protecting traditional ayahuasca ceremony through a UN convention reservation and a 2008 cultural-heritage declaration. Costa Rica is legally ambiguous. Law changes, so verify current status before booking, and see our Peru vs Costa Rica vs Netherlands guide.' },
      { q: 'What should I check before booking an ayahuasca retreat?', a: 'Our Retreat Vetting Checklist guide covers this in detail. At minimum, look for a stated medical and psychological screening process, facilitator training and experience, and an emergency protocol.' },
      { q: 'Are there health risks to be aware of?', a: 'Yes. Ayahuasca has known contraindications with certain medications (notably SSRIs and MAOIs) and health conditions. This is not medical advice; consult a qualified health professional before considering any plant medicine retreat.' },
    ],
  },
  'san-pedro-and-other': {
    intro:
      'San Pedro (huachuma) and other plant medicine retreats are offered in parts of South America with long traditional use. As with ayahuasca, legal status and safety standards vary by country and operator — check the destination\'s legal status panel and each listing\'s vetting checklist.',
    faq: [
      { q: 'Is San Pedro the same as ayahuasca?', a: 'No — San Pedro (huachuma) is a mescaline-containing cactus, distinct from ayahuasca, with a different traditional use, effect profile, and legal/regulatory context. Always check the specific substance and jurisdiction.' },
    ],
  },
  breathwork: {
    intro:
      'Breathwork retreats use legal, substance-free consciousness practices and are widely available in Australia and internationally. They sit outside the regulatory questions that apply to substance-based retreats, but screening and facilitator experience still matter — breathwork is not risk-free for everyone.',
    faq: [
      { q: 'Is breathwork legal in Australia?', a: 'Yes — breathwork involves no controlled substances and is legally offered by wellness practitioners across Australia.' },
      { q: 'Who should avoid intensive breathwork?', a: 'People with certain cardiovascular conditions, epilepsy, pregnancy, or a history of psychosis are commonly advised to avoid intensive breathwork techniques — this is general information, not medical advice; check with a health professional and the retreat\'s own screening process.' },
    ],
  },
  cannabis: {
    intro:
      'Cannabis retreats operate in jurisdictions with legal recreational or medicinal cannabis frameworks. We list only retreats in jurisdictions where the relevant use is legal — always check current local law, which changes frequently.',
    faq: [],
  },
  luxury: {
    intro:
      'Luxury retreats span multiple modalities with a higher tier of accommodation and service. The same legal-status and vetting considerations apply regardless of price point — a higher price does not by itself indicate better safety practices.',
    faq: [],
  },
};
