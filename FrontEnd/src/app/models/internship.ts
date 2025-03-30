import { Company } from "./company"
export class Internship {
    id!: number
    titre!: string
    description!: string
    location!: string
    remote!: boolean
    field!: string
    duration!: number
    startDate!: string
    endDate!: string
    compensation!: number
    createAt?:string
    lastModifiedDate?:string
    applicationDeadline!: string
    status!: string
    requirements?: number[]; 
    company?: Company;
    relativeTime?: string; 
  }
  