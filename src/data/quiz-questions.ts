export interface QuizOption {
  value: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  /** Whether this answer is used to filter/score listings client-side, or just personalises the emailed shortlist. */
  usedForMatching: boolean;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'destination',
    question: 'Where would you like to go?',
    usedForMatching: true,
    options: [
      { value: 'netherlands', label: 'Netherlands' },
      { value: 'jamaica', label: 'Jamaica' },
      { value: 'peru', label: 'Peru' },
      { value: 'costa-rica', label: 'Costa Rica' },
      { value: 'australia', label: 'Australia (domestic)' },
      { value: 'any', label: 'No preference' },
    ],
  },
  {
    id: 'modality',
    question: 'What kind of retreat are you interested in?',
    usedForMatching: true,
    options: [
      { value: 'psilocybin', label: 'Psilocybin' },
      { value: 'ayahuasca', label: 'Ayahuasca' },
      { value: 'san-pedro-and-other', label: 'San Pedro & other plant medicines' },
      { value: 'breathwork', label: 'Breathwork (substance-free)' },
      { value: 'integration', label: 'Integration support only' },
      { value: 'any', label: 'Not sure yet' },
    ],
  },
  {
    id: 'budget',
    question: "What's your rough budget for the retreat itself (AUD, excluding flights)?",
    usedForMatching: true,
    options: [
      { value: 'under3k', label: 'Under $3,000' },
      { value: '3k-6k', label: '$3,000–$6,000' },
      { value: '6k-10k', label: '$6,000–$10,000' },
      { value: '10kplus', label: '$10,000+' },
      { value: 'any', label: 'Not sure yet' },
    ],
  },
  {
    id: 'timing',
    question: 'When are you thinking of going?',
    usedForMatching: false,
    options: [
      { value: '1month', label: 'Within 1 month' },
      { value: '1-3months', label: '1–3 months' },
      { value: '3-6months', label: '3–6 months' },
      { value: '6plus', label: '6+ months' },
      { value: 'exploring', label: 'Just exploring for now' },
    ],
  },
  {
    id: 'experience',
    question: 'How would you describe your experience level?',
    usedForMatching: false,
    options: [
      { value: 'first-time', label: 'First time' },
      { value: 'some', label: 'Some experience' },
      { value: 'experienced', label: 'Very experienced' },
    ],
  },
  {
    id: 'groupPreference',
    question: 'Group or private?',
    usedForMatching: false,
    options: [
      { value: 'group', label: "Group retreat's fine" },
      { value: 'private', label: 'I\'d prefer private / 1:1' },
      { value: 'either', label: 'Either works' },
    ],
  },
  {
    id: 'supportNeeds',
    question: 'What matters most to you in how a retreat is run?',
    usedForMatching: false,
    options: [
      { value: 'screening', label: 'Strong medical/psychological screening' },
      { value: 'facilitators', label: 'Facilitator experience & training' },
      { value: 'price', label: 'Price' },
      { value: 'reviews', label: 'Independent reviews / reputation' },
    ],
  },
  {
    id: 'priority',
    question: "If you had to pick one, what's your top priority right now?",
    usedForMatching: false,
    options: [
      { value: 'legal-certainty', label: 'Legal certainty' },
      { value: 'price', label: 'Price' },
      { value: 'safety', label: 'Safety & screening' },
      { value: 'location', label: 'Location / travel time' },
      { value: 'just-browsing', label: 'Just browsing' },
    ],
  },
];
