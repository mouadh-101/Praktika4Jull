import { Document } from "./document";


export interface Depot {
    idDepot: number;
    Rapport: ArrayBuffer ;
    Journal:ArrayBuffer ;
    Attestation:ArrayBuffer ;
    uploadDate: Date;
    document: Document;
}
