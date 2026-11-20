# BookRetreats rollout — 10 new listings a week

Plan set 2026-11-20. Source list: `ops/growth/bookretreats-shortlist.md` (kept local, not in the repo, because it reproduces BookRetreats content). The listing routine works through this file 5 per run (see `ops/routine-prompt.md` STEP 2). 59 new operators over 6 weeks (w/c 23 Nov 2026 to w/c 28 Dec 2026).

## How each listing is built
- BookRetreats is only where the operator was **found**. Research and write every listing from the operator's own website and primary sources, as usual (CONTENT.md, compliance checklist). Copy no BookRetreats text, prices, reviews or photos.
- Hosts are named by their BookRetreats contact (e.g. "Alan, Venlo"). Step one for each is finding the real trading name and website. If there's no operator website to source from, skip it and log why.
- Set `affiliateUrl` to the operator's most-reviewed BookRetreats retreat (linked below) plus `?a=qlsrszegpbehbstdfabg`, and `affiliatePartner: "BookRetreats"`. Check the page still loads first.
- All of these involve a substance, so every one goes through a PR (rule 10). At 10 a week that's 5 per Monday/Thursday run.
- Photos: held locally in `photo-hold/<folder>/` (gitignored, never committed, since the repo is public), with two sources kept apart:
  - `photo-hold/<folder>/` top level: copies from BookRetreats retreat pages. Don't use these until BookRetreats gives written permission.
  - `photo-hold/<folder>/operator-site/`: copies from the operator's own website, gathered during research. Don't use these until **the operator** gives permission (ask at outreach/claim).
  - Each folder has a `SOURCE.txt` recording where every file came from.
- The scheduled routine works from a fresh repo clone, so it can't keep gitignored files. It records the photo page URLs it used in the PR body, and the operator-site photos are then pulled locally from those URLs.
- When a listing is built, rename its `photo-hold` folder to the final listing slug.

## Week 0 — quick wins (no new research)
Add BookRetreats links to existing listings:
- `elevated-mind-retreats-netherlands`: [3-day-guided-psilocybin-retreat-in-the-netherlands](https://bookretreats.com/r/3-day-guided-psilocybin-retreat-in-the-netherlands?a=qlsrszegpbehbstdfabg) (operator has 5 retreats there; most-reviewed chosen)
- `mycospirit-jamaica`: [7-day-psychedelic-therapy-integration-retreat-in-jamaica](https://bookretreats.com/r/7-day-psychedelic-therapy-integration-retreat-in-jamaica?a=qlsrszegpbehbstdfabg)
- `nihue-rao-centro-espiritual`: [7-day-traditional-amazonian-ayahuasca-master-plant-diets-peru](https://bookretreats.com/r/7-day-traditional-amazonian-ayahuasca-master-plant-diets-peru?a=qlsrszegpbehbstdfabg)

Order: Netherlands first (clearest legal basis, closest to existing listings), then Oregon and Jamaica, then Peru by review count. Reviews count is a rough proxy for an established operator. It isn't vetting.

## Week 1 — w/c 23 Nov 2026

| # | Country | Host (BookRetreats) | Town | BR retreats | BR reviews | Affiliate target | Photo folder | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | Netherlands | Anna | Helvoirt | 1 | 27 | [3-day-psilocybin-retreat-incl-prep-integratio](https://bookretreats.com/r/3-day-psilocybin-retreat-incl-prep-integration-netherlands) | `nl-helvoirt-anna` |  |
| 2 | Netherlands | Alan | Venlo | 2 | 26 | [3-day-private-psilocybin-retreat-netherlands](https://bookretreats.com/r/3-day-private-psilocybin-retreat-netherlands) | `nl-venlo-alan` |  |
| 3 | Netherlands | Maya | Teuge | 3 | 23 | [3-day-psilocybin-truffle-nature-temple-retrea](https://bookretreats.com/r/3-day-psilocybin-truffle-nature-temple-retreat-in-the-netherlands) | `nl-teuge-maya` |  |
| 4 | Netherlands | Conscious Growth | Olst | 1 | 19 | [3-day-psilocybin-retreat-at-samaru-the-nether](https://bookretreats.com/r/3-day-psilocybin-retreat-at-samaru-the-netherlands) | `nl-olst-conscious-growth` |  |
| 5 | Netherlands | Marieke van der Spek | Culemborg | 1 | 15 | [4-day-psilocybin-retreat-in-the-netherlands-7](https://bookretreats.com/r/4-day-psilocybin-retreat-in-the-netherlands-74887) | `nl-culemborg-marieke-van-der-spek` |  |
| 6 | Netherlands | Lynn Walsemann | Helvoirt | 1 | 14 | [4-day-psilocybin-winter-mystic-retreat-in-the](https://bookretreats.com/r/4-day-psilocybin-winter-mystic-retreat-in-the-netherlands) | `nl-helvoirt-lynn-walsemann` |  |
| 7 | Netherlands | Hero's Journey | Amsterdam | 1 | 11 | [3-day-private-session-for-psychedelic-journey](https://bookretreats.com/r/3-day-private-session-for-psychedelic-journey-in-the-netherlands) | `nl-amsterdam-hero-s-journey` |  |
| 8 | Netherlands | Carolien and Kevin | Sterksel | 1 | 8 | [2-day-legal-psilocybin-retreat-in-the-netherl](https://bookretreats.com/r/2-day-legal-psilocybin-retreat-in-the-netherlands) | `nl-sterksel-carolien-and-kevin` |  |
| 9 | Netherlands | Alejandra Rodriguez | Netherlands | 1 | 2 | [3-day-intimate-therapeutic-psilocybin-retreat](https://bookretreats.com/r/3-day-intimate-therapeutic-psilocybin-retreat-in-netherlands) | `nl-x-alejandra-rodriguez` |  |
| 10 | Netherlands | Ioana Pop | Elst | 1 | 0 | [2-day-legal-psilocybin-truffle-ceremony-in-th](https://bookretreats.com/r/2-day-legal-psilocybin-truffle-ceremony-in-the-netherlands) | `nl-elst-ioana-pop` |  |

## Week 2 — w/c 30 Nov 2026

| # | Country | Host (BookRetreats) | Town | BR retreats | BR reviews | Affiliate target | Photo folder | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | Netherlands | Maximilian Haas | Helvoirt | 1 | 0 | [4-day-psilocybin-medically-guided-mens-retrea](https://bookretreats.com/r/4-day-psilocybin-medically-guided-mens-retreat-in-netherlands) | `nl-helvoirt-maximilian-haas` |  |
| 2 | Netherlands | Vlad | Amsterdam | 1 | 0 | [1-day-private-psilocybin-truffle-session-amst](https://bookretreats.com/r/1-day-private-psilocybin-truffle-session-amsterdam) | `nl-amsterdam-vlad` |  |
| 3 | Oregon | Jacqui Mann | Ashland | 3 | 34 | [4-day-ketamine-therapy-couples-retreat-in-ash](https://bookretreats.com/r/4-day-ketamine-therapy-couples-retreat-in-ashland-oregon) | `or-ashland-jacqui-mann` | list the psilocybin retreat; ketamine ones are your call |
| 4 | Oregon | Myles | Ashland | 1 | 30 | [5-day-mushroom-retreat-in-nature-2-regulated-](https://bookretreats.com/r/5-day-mushroom-retreat-in-nature-2-regulated-journeys-or-us) | `or-ashland-myles` | confirm OHA licence |
| 5 | Oregon | Sarah Rose | Portland | 1 | 17 | [5-day-womens-psilocybin-retreat-the-medicine-](https://bookretreats.com/r/5-day-womens-psilocybin-retreat-the-medicine-within-or-us) | `or-portland-sarah-rose` | confirm OHA licence |
| 6 | Jamaica | Bénédicte MANNIX | Jamaica | 2 | 30 | [7-day-private-retreat-for-deep-personal-trans](https://bookretreats.com/r/7-day-private-retreat-for-deep-personal-transformation-in-jamaica) | `jm-x-benedicte-mannix` |  |
| 7 | Peru | Willka Tika | Urubamba | 1 | 287 | [7-day-healing-wellness-luxury-retreat-at-will](https://bookretreats.com/r/7-day-healing-wellness-luxury-retreat-at-willka-tika-peru) | `pe-urubamba-willka-tika` |  |
| 8 | Peru | Elio Geusa | Iquitos | 4 | 46 | [7-day-ayahuasca-huachumasan-pedro-retreat-in-](https://bookretreats.com/r/7-day-ayahuasca-huachumasan-pedro-retreat-in-iquitos-peru) | `pe-iquitos-elio-geusa` |  |
| 9 | Peru | Stephano Gutierrez | Calca | 5 | 42 | [8-day-master-plant-and-inca-shamanism-in-cusc](https://bookretreats.com/r/8-day-master-plant-and-inca-shamanism-in-cusco-peru) | `pe-calca-stephano-gutierrez` |  |
| 10 | Peru | Maestro Wiler Noriega | Manantay | 2 | 29 | [7-day-4-ceremonies-authentic-ayahuasca-transf](https://bookretreats.com/r/7-day-4-ceremonies-authentic-ayahuasca-transformation-in-peru) | `pe-manantay-maestro-wiler-noriega` |  |

## Week 3 — w/c 7 Dec 2026

| # | Country | Host (BookRetreats) | Town | BR retreats | BR reviews | Affiliate target | Photo folder | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | Peru | Fabrizio | Iquitos | 1 | 28 | [7-day-paojilhuasca-amazonian-medicine-retreat](https://bookretreats.com/r/7-day-paojilhuasca-amazonian-medicine-retreat-in-iquitos-peru) | `pe-iquitos-fabrizio` |  |
| 2 | Peru | Wayra Eloy Quispe Ccorahua | Sacred Valley | 3 | 25 | [3-day-spiritual-journey-ayahuasca-retreat-in-](https://bookretreats.com/r/3-day-spiritual-journey-ayahuasca-retreat-in-peru) | `pe-sacred-valley-wayra-eloy-quispe-ccorahua` |  |
| 3 | Peru | Laura | Cusco | 1 | 24 | [7-day-andean-shamanic-community-plant-medicin](https://bookretreats.com/r/7-day-andean-shamanic-community-plant-medicine-retreat-in-peru) | `pe-cusco-laura` |  |
| 4 | Peru | Lucila | Pucallpa | 3 | 20 | [8-day-ayahuasca-retreat-at-the-healing-center](https://bookretreats.com/r/8-day-ayahuasca-retreat-at-the-healing-center-in-pucallpa-peru) | `pe-pucallpa-lucila` |  |
| 5 | Peru | Psychonauta Foundation | Nauta | 1 | 20 | [7-day-open-ayahuasca-retreat-in-peru](https://bookretreats.com/r/7-day-open-ayahuasca-retreat-in-peru) | `pe-nauta-psychonauta-foundation` |  |
| 6 | Peru | Raquel Gomes | Contamana | 1 | 20 | [8-day-shipibo-ayahuasca-dieta-in-amazon-peru](https://bookretreats.com/r/8-day-shipibo-ayahuasca-dieta-in-amazon-peru) | `pe-contamana-raquel-gomes` |  |
| 7 | Peru | Home of Ayahuasca | Iquitos | 1 | 19 | [14-day-ayahuasca-retreat-with-individual-guid](https://bookretreats.com/r/14-day-ayahuasca-retreat-with-individual-guidance-iquitos-peru) | `pe-iquitos-home-of-ayahuasca` |  |
| 8 | Peru | Sergey Baranov | Sacred Valley | 1 | 19 | [7-day-san-pedro-huachuma-retreat-in-peru](https://bookretreats.com/r/7-day-san-pedro-huachuma-retreat-in-peru) | `pe-sacred-valley-sergey-baranov` |  |
| 9 | Peru | Vincent Roy | Moyobamba | 1 | 19 | [7-day-amazon-jungle-yoga-meditation-wellness-](https://bookretreats.com/r/7-day-amazon-jungle-yoga-meditation-wellness-retreat-in-peru) | `pe-moyobamba-vincent-roy` |  |
| 10 | Peru | Justin Gould | Peru | 1 | 18 | [10-day-ayahuasca-medicine-retreat-in-peru](https://bookretreats.com/r/10-day-ayahuasca-medicine-retreat-in-peru) | `pe-x-justin-gould` |  |

## Week 4 — w/c 14 Dec 2026

| # | Country | Host (BookRetreats) | Town | BR retreats | BR reviews | Affiliate target | Photo folder | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | Peru | Karina Koryakhina | Písac | 1 | 18 | [7-day-deep-medicine-immersion-in-the-sacred-v](https://bookretreats.com/r/7-day-deep-medicine-immersion-in-the-sacred-valley-in-peru) | `pe-pisac-karina-koryakhina` |  |
| 2 | Peru | Camille Jovignot | Iquitos | 4 | 16 | [21-day-ayahuasca-master-plants-retreat-in-ama](https://bookretreats.com/r/21-day-ayahuasca-master-plants-retreat-in-amazon-peru) | `pe-iquitos-camille-jovignot` |  |
| 3 | Peru | Jhon & Janneke | Urubamba | 3 | 16 | [5-day-ayahuasca-expansion-retreat-in-cusco-pe](https://bookretreats.com/r/5-day-ayahuasca-expansion-retreat-in-cusco-peru) | `pe-urubamba-jhon-janneke` |  |
| 4 | Peru | Juan Real | Calca | 3 | 14 | [3-day-private-wellness-retreat-to-relax-and-r](https://bookretreats.com/r/3-day-private-wellness-retreat-to-relax-and-reset-in-cusco-peru) | `pe-calca-juan-real` |  |
| 5 | Peru | Marije van Neck | Tarapoto | 3 | 13 | [21-day-ayahuasca-master-plant-dieta-in-the-ju](https://bookretreats.com/r/21-day-ayahuasca-master-plant-dieta-in-the-jungle-in-peru) | `pe-tarapoto-marije-van-neck` |  |
| 6 | Peru | Erik Hendrick Carpio | Calca | 4 | 13 | [3-day-ayahuasca-retreat-in-el-cusco-peru](https://bookretreats.com/r/3-day-ayahuasca-retreat-in-el-cusco-peru) | `pe-calca-erik-hendrick-carpio` |  |
| 7 | Peru | Daniel Weyder Yumbato Inga | Iquitos | 4 | 11 | [14-day-ayahuasca-immersion-master-plant-dieta](https://bookretreats.com/r/14-day-ayahuasca-immersion-master-plant-dieta-in-iquitos-peru) | `pe-iquitos-daniel-weyder-yumbato-inga` |  |
| 8 | Peru | Kamel | Písac | 1 | 11 | [8-day-plant-medicine-retreat-in-the-andes-per](https://bookretreats.com/r/8-day-plant-medicine-retreat-in-the-andes-peru) | `pe-pisac-kamel` |  |
| 9 | Peru | Winister Magin | Peru | 1 | 10 | [8-day-transformative-healing-ayahuasca-retrea](https://bookretreats.com/r/8-day-transformative-healing-ayahuasca-retreat-in-peruvian-amazon) | `pe-x-winister-magin` |  |
| 10 | Peru | Myrah Vandermeulen | Písac | 2 | 7 | [13-day-sacred-andes-initiations-with-san-pedr](https://bookretreats.com/r/13-day-sacred-andes-initiations-with-san-pedro-peru-bolivia) | `pe-pisac-myrah-vandermeulen` |  |

## Week 5 — w/c 21 Dec 2026

| # | Country | Host (BookRetreats) | Town | BR retreats | BR reviews | Affiliate target | Photo folder | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | Peru | Augusto Flores Manuyama | Iquitos | 1 | 4 | [7-day-3-ceremonies-ayahuasca-and-jungle-retre](https://bookretreats.com/r/7-day-3-ceremonies-ayahuasca-and-jungle-retreat-in-iquitos-peru) | `pe-iquitos-augusto-flores-manuyama` |  |
| 2 | Peru | Zahra | Sacred Valley | 1 | 4 | [7-day-holistic-retreat-in-sacred-valley-peru](https://bookretreats.com/r/7-day-holistic-retreat-in-sacred-valley-peru) | `pe-sacred-valley-zahra` |  |
| 3 | Peru | Manu Groult | Iquitos | 2 | 3 | [7-day-yoga-meditation-shamanic-retreat-in-iqu](https://bookretreats.com/r/7-day-yoga-meditation-shamanic-retreat-in-iquitos-peru) | `pe-iquitos-manu-groult` |  |
| 4 | Peru | Cyana | Iquitos | 1 | 2 | [8-day-elemental-healing-medicine-retreat-in-p](https://bookretreats.com/r/8-day-elemental-healing-medicine-retreat-in-peru) | `pe-iquitos-cyana` |  |
| 5 | Peru | Katie Rinaldi | Cusco | 1 | 1 | [8-day-awakened-heart-retreat-in-the-andes-mou](https://bookretreats.com/r/8-day-awakened-heart-retreat-in-the-andes-mountains-peru) | `pe-cusco-katie-rinaldi` |  |
| 6 | Peru | Chaka Runa | Shamboyacu | 1 | 0 | [11-day-ayahuasca-retreat-master-plant-dieta-p](https://bookretreats.com/r/11-day-ayahuasca-retreat-master-plant-dieta-peruvian-amazon) | `pe-shamboyacu-chaka-runa` |  |
| 7 | Peru | Fabiola Lillo | Sacred Valley | 1 | 0 | [10-day-essence-of-the-heart-retreat-in-sacred](https://bookretreats.com/r/10-day-essence-of-the-heart-retreat-in-sacred-valley-peru) | `pe-sacred-valley-fabiola-lillo` |  |
| 8 | Peru | Oscar Maurice Johnson Ramirez | Iquitos | 2 | 0 | [2-day-ayahuasca-retreat-in-galicia-house-peru](https://bookretreats.com/r/2-day-ayahuasca-retreat-in-galicia-house-peru) | `pe-iquitos-oscar-maurice-johnson-ramirez` |  |
| 9 | Peru | Chonon Sany E.I.R.L. | Tarapoto | 2 | 0 | [7-day-ayahuasca-retreat-with-a-medical-doctor](https://bookretreats.com/r/7-day-ayahuasca-retreat-with-a-medical-doctor-in-tarapoto-peru) | `pe-tarapoto-chonon-sany-e-i-r-l` |  |
| 10 | Peru | Angel | Pucallpa | 1 | 0 | [7-day-ayahuasca-retreat-in-contamana-pucallpa](https://bookretreats.com/r/7-day-ayahuasca-retreat-in-contamana-pucallpa-peru) | `pe-pucallpa-angel` |  |

## Week 6 — w/c 28 Dec 2026

| # | Country | Host (BookRetreats) | Town | BR retreats | BR reviews | Affiliate target | Photo folder | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | Peru | Kate Maranville-Hiser | Iquitos | 1 | 0 | [8-day-held-by-the-vine-a-retreat-in-right-rel](https://bookretreats.com/r/8-day-held-by-the-vine-a-retreat-in-right-relationship-in-peru) | `pe-iquitos-kate-maranville-hiser` |  |
| 2 | Peru | Artemisia | Peru | 1 | 0 | [21-day-pilgrimage-retreat-deep-realization-re](https://bookretreats.com/r/21-day-pilgrimage-retreat-deep-realization-retreat-in-peru) | `pe-x-artemisia` |  |
| 3 | Peru | Francesca | Písac | 1 | 0 | [9-day-tailor-made-retreat-in-the-sacred-valle](https://bookretreats.com/r/9-day-tailor-made-retreat-in-the-sacred-valley-of-peru) | `pe-pisac-francesca` |  |
| 4 | Peru | Xuan Gwar | Nauta | 1 | 0 | [30-day-peruvian-dieta-retreat-in-nauta-peru](https://bookretreats.com/r/30-day-peruvian-dieta-retreat-in-nauta-peru) | `pe-nauta-xuan-gwar` |  |
| 5 | Netherlands | Rob | Culemborg | 5 | 456 | [2-day-flexible-weekend-plant-medicine-retreat](https://bookretreats.com/r/2-day-flexible-weekend-plant-medicine-retreat-in-netherlands) | `nl-culemborg-rob` | HELD: also runs ayahuasca in NL - needs your decision |
| 6 | Netherlands | Marcel Van Der Putten | Hillegom | 2 | 11 | [4-day-psychedelic-couples-therapy-retreat-in-](https://bookretreats.com/r/4-day-psychedelic-couples-therapy-retreat-in-the-netherlands) | `nl-hillegom-marcel-van-der-putten` | CHECK FIRST: page mentions ayahuasca; confirm truffle-only |
| 7 | Netherlands | Johannes | Arnhem | 2 | 7 | [5-day-intimate-psilocybin-truffles-retreat-in](https://bookretreats.com/r/5-day-intimate-psilocybin-truffles-retreat-in-the-netherlands) | `nl-arnhem-johannes` | HELD: also runs ayahuasca in NL - needs your decision |
| 8 | Netherlands | Ron Berends | Gorinchem | 1 | 4 | [3-day-plant-medicine-w-intake-integration-ret](https://bookretreats.com/r/3-day-plant-medicine-w-intake-integration-retreat-netherlands) | `nl-gorinchem-ron-berends` | CHECK FIRST: substance not named; confirm truffles |
| 9 | Netherlands | Alice | Venlo | 1 | 37 | [7-day-power-of-psilocybin-the-shift-retreat-v](https://bookretreats.com/r/7-day-power-of-psilocybin-the-shift-retreat-venlo-netherlands) | `nl-venlo-alice` | CHECK FIRST: page mentions ayahuasca; confirm truffle-only |

## Still open
- Written OK from BookRetreats (support@bookretreats.com) covering photos and listing operators found there.
- Rob (Culemborg) and Johannes (Arnhem) also run ayahuasca ceremonies in the Netherlands, which is illegal there. List their truffle retreats or not? They stay in Week 6 as HELD until decided.
- Download the "Photos to hold" URLs from each routine PR into `photo-hold/<folder>/operator-site/`.
