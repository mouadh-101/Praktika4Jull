import { Depot } from "./Depot";
import { Journal } from "./Journal";




export enum StatusDoc {
    ENATTEND = "ENATTEND",
    VALIDE = "VALIDE",
    REFUSER = "REFUSER"
  }

  export enum Type {
    CONVENTION = "CONVENTION",
    INTERNSHIP_REQUEST = "INTERNSHIP_REQUEST",
    ASSIGNMENT_LETTER = "ASSIGNMENT_LETTER"
  }
  export enum Duree {
    DeuxMois = "DeuxMois",
    SixMois ="SixMois"
}

  export interface Document {
    docid: number;
    societe: string;
    type: Type;
    dateDebut: Date ;
    dateFin: Date;
    duree: Duree;
    statusDoc: StatusDoc;
    depot: Depot;
    journals: Journal[];
  }
