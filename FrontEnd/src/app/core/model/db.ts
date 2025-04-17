export class Convention {
  conId?: number; // Optionnel car géré par la BD
  description!: string;
  dateConv?: Date; // Automatiquement défini par le backend
  signed!: boolean;
  internshipId!: number;
  terms!: Terms[]; // Liste des termes liés à la convention
  encryptedSignature?: string;
  text?: string;
}

export interface Terms {
  termId?: number; // Facultatif pour éviter les erreurs lors de la création
  title: string;
  description: string;
}
export interface Quiz {
  quizId: number;
  title: string;
  status: string;
  questions?: Question[];
}

export interface Question {
  questionId: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

