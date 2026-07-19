export const CATEGORY_COPY: Record<
  string,
  { intro: string; faq: { q: string; a: string }[] }
> = {
  psilocybin: {
    intro:
      'Psilocybin retreats operate legally in a small number of jurisdictions, most notably the Netherlands (via legally-sold psilocybin-containing truffles) and Jamaica (where psilocybin mushrooms are not scheduled). We list only operators publicly stating they operate within their host jurisdiction\'s law — verify current legal status before booking, and see our legal status pages for each destination.',
    faq: [
      { q: 'Is it legal for an Australian to attend a psilocybin retreat overseas?', a: 'Legality depends on the host country\'s law, not Australia\'s — we note each destination\'s legal status on its destination page. This is general information, not legal advice; always verify current law before travelling, including any Australian import/re-entry considerations for your return.' },
      { q: 'Are these retreats medically supervised?', a: 'Screening and supervision practices vary significantly by operator. Check each listing\'s vetting checklist for what the operator publicly states about medical/psychological screening — "stated" does not mean independently verified.' },
    ],
  },
  ayahuasca: {
    intro:
      'Ayahuasca retreats are most commonly offered in Peru, where its traditional and ceremonial use has long-standing legal protection, and in other jurisdictions with varying frameworks. Safety practices, facilitator training, and screening vary widely between centres — this is one of the most important categories to vet carefully.',
    faq: [
      { q: 'What should I check before booking an ayahuasca retreat?', a: 'Our Retreat Vetting Checklist guide covers this in detail — at minimum, look for a stated medical/psychological screening process, facilitator training and experience, and an emergency protocol.' },
      { q: 'Are there health risks to be aware of?', a: 'Yes — ayahuasca has known contraindications with certain medications (notably SSRIs/MAOIs) and health conditions. This is not medical advice; consult a qualified health professional before considering any plant medicine retreat.' },
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
