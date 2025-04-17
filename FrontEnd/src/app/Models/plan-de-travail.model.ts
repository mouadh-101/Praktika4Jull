
  
  export interface TacheGantt {
    nomTache: string;
    dateDebut: string; // format ISO: '2025-04-20'
    dateFin: string;
  }
  
  export interface PlanDeTravail {
    id?:number;
    description: string;
    problematique: string;
    fonctionnalites: string;
    technologies: string;
    statut: string;
    fichierRemis: string;
    encadrantInterne: string;
    encadrantExterne: string;
    company: string;
    planning: TacheGantt[];
  }
      