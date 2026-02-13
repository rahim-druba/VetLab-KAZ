export type SourceFilter = 'vetlab' | 'global';
export type VetLabStatus = 'Done' | 'Ongoing';
export type GlobalType = 'Clinical Study' | 'Diagnostic Innovation' | 'Laboratory Techniques';

export interface VetLabProject {
  id: string;
  titleKey: string;
  briefKey: string;
  status: VetLabStatus;
  year: number;
  imageUrl: string;
}

export interface GlobalArticle {
  id: string;
  titleKey: string;
  authors: string;
  year: number;
  journalKey: string;
  summaryKey: string;
  tagKeys: string[];
  type?: GlobalType;
  url: string;
  imageUrl: string;
}

export const VETLAB_PROJECTS: VetLabProject[] = [
  { id: '1', titleKey: 'vetlab1Title', briefKey: 'vetlab1Brief', status: 'Done', year: 2024, imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=340&fit=crop' },
  { id: '2', titleKey: 'vetlab2Title', briefKey: 'vetlab2Brief', status: 'Done', year: 2023, imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=340&fit=crop' },
  { id: '3', titleKey: 'vetlab3Title', briefKey: 'vetlab3Brief', status: 'Ongoing', year: 2026, imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&h=340&fit=crop' },
  { id: '4', titleKey: 'vetlab4Title', briefKey: 'vetlab4Brief', status: 'Ongoing', year: 2026, imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&h=340&fit=crop' },
  { id: '5', titleKey: 'vetlab5Title', briefKey: 'vetlab5Brief', status: 'Done', year: 2024, imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=340&fit=crop' },
  { id: '6', titleKey: 'vetlab6Title', briefKey: 'vetlab6Brief', status: 'Ongoing', year: 2025, imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=340&fit=crop' },
  { id: '7', titleKey: 'vetlab7Title', briefKey: 'vetlab7Brief', status: 'Done', year: 2024, imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&h=340&fit=crop' },
  { id: '8', titleKey: 'vetlab8Title', briefKey: 'vetlab8Brief', status: 'Ongoing', year: 2026, imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=340&fit=crop' },
  { id: '9', titleKey: 'vetlab9Title', briefKey: 'vetlab9Brief', status: 'Done', year: 2023, imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=340&fit=crop' },
  { id: '10', titleKey: 'vetlab10Title', briefKey: 'vetlab10Brief', status: 'Ongoing', year: 2026, imageUrl: 'https://images.unsplash.com/photo-1504660068548-6f5ce4e9e7e5?w=600&h=340&fit=crop' },
  { id: '11', titleKey: 'vetlab11Title', briefKey: 'vetlab11Brief', status: 'Ongoing', year: 2025, imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4b64a0e0d?w=600&h=340&fit=crop' },
  { id: '12', titleKey: 'vetlab12Title', briefKey: 'vetlab12Brief', status: 'Done', year: 2024, imageUrl: 'https://images.unsplash.com/photo-1570927510674-4c77d50a2b2d?w=600&h=340&fit=crop' },
];

export const GLOBAL_ARTICLES: GlobalArticle[] = [
  { id: '1', titleKey: 'article1Title', journalKey: 'journalActaVet', summaryKey: 'article1Summary', tagKeys: ['tagHistology', 'tagCanine', 'tagOncology'], type: 'Laboratory Techniques', authors: 'Y. Nakamura, M. Chambers, et al.', year: 2024, url: 'https://actavetscand.biomedcentral.com/articles/10.1186/s13028-024-00775-5', imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=340&fit=crop' },
  { id: '2', titleKey: 'article2Title', journalKey: 'journalFrontVet', summaryKey: 'article2Summary', tagKeys: ['tagPCR', 'tagFeline'], type: 'Diagnostic Innovation', authors: 'X. Li, Y. Wang, et al.', year: 2021, url: 'https://www.frontiersin.org/articles/10.3389/fvets.2021.792322/full', imageUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=340&fit=crop' },
  { id: '3', titleKey: 'article3Title', journalKey: 'journalBMC', summaryKey: 'article3Summary', tagKeys: ['tagSerology', 'tagEquine', 'tagParasitology'], type: 'Diagnostic Innovation', authors: 'N. Andersen, K. Lindegaard, et al.', year: 2024, url: 'https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-024-04389-x', imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&h=340&fit=crop' },
  { id: '4', titleKey: 'article4Title', journalKey: 'journalBMC', summaryKey: 'article4Summary', tagKeys: ['tagCytology', 'tagCanine', 'tagLymphoma'], type: 'Clinical Study', authors: 'E. Rout, B. Burnett, et al.', year: 2021, url: 'https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-021-02783-3', imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=340&fit=crop' },
  { id: '5', titleKey: 'article5Title', journalKey: 'journalFrontVet', summaryKey: 'article5Summary', tagKeys: ['tagPCR', 'tagFeline'], type: 'Diagnostic Innovation', authors: 'Y. Niu, L. Liu, et al.', year: 2022, url: 'https://www.frontiersin.org/journals/veterinary-science/articles/10.3389/fvets.2022.1005759/full', imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=340&fit=crop' },
  { id: '6', titleKey: 'article6Title', journalKey: 'journalFrontVet', summaryKey: 'article6Summary', tagKeys: ['tagPCR', 'tagFeline', 'tagParasitology'], type: 'Laboratory Techniques', authors: 'A. Dyachenko, R. Pantchev, et al.', year: 2023, url: 'https://www.frontiersin.org/articles/10.3389/fvets.2023.1113681/full', imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=340&fit=crop' },
  { id: '7', titleKey: 'article7Title', journalKey: 'journalBMC', summaryKey: 'article7Summary', tagKeys: ['tagCytology', 'tagHistology', 'tagCanine'], type: 'Laboratory Techniques', authors: 'S. Rasotto, F. Zappulli, et al.', year: 2021, url: 'https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-021-02807-y', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=340&fit=crop' },
  { id: '8', titleKey: 'article8Title', journalKey: 'journalPlosOne', summaryKey: 'article8Summary', tagKeys: ['tagParasitology', 'tagCanine', 'tagClinicalStudy'], type: 'Clinical Study', authors: 'F. Manzocchi, M. Schäfer, et al.', year: 2024, url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0293330', imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=340&fit=crop' },
  { id: '9', titleKey: 'article9Title', journalKey: 'journalPlosOne', summaryKey: 'article9Summary', tagKeys: ['tagHistology', 'tagLivestock', 'tagVirology'], type: 'Clinical Study', authors: 'H. Hussein, A. Hassan, et al.', year: 2023, url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0291970', imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&h=340&fit=crop' },
  { id: '10', titleKey: 'article10Title', journalKey: 'journalFrontMicro', summaryKey: 'article10Summary', tagKeys: ['tagPCR', 'tagFeline', 'tagMicrobiology'], type: 'Clinical Study', authors: 'R. Tasker, M. Lappin, et al.', year: 2024, url: 'https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2024.1455453/full', imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&h=340&fit=crop' },
  { id: '11', titleKey: 'article11Title', journalKey: 'journalBMC', summaryKey: 'article11Summary', tagKeys: ['tagImaging', 'tagCanine', 'tagOncology'], type: 'Diagnostic Innovation', authors: 'S. Schultz, K. Mathes, et al.', year: 2024, url: 'https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-024-04133-5', imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=340&fit=crop' },
  { id: '12', titleKey: 'article12Title', journalKey: 'journalBMC', summaryKey: 'article12Summary', tagKeys: ['tagHistology', 'tagLivestock', 'tagMicrobiology'], type: 'Clinical Study', authors: 'A. Mohammed, D. Degu, et al.', year: 2024, url: 'https://link.springer.com/article/10.1186/s42047-024-00147-3', imageUrl: 'https://images.unsplash.com/photo-1504660068548-6f5ce4e9e7e5?w=600&h=340&fit=crop' },
];
