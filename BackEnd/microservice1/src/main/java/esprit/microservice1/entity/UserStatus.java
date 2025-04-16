package esprit.microservice1.entity;

public enum UserStatus {
    PENDING,    // En attente d'approbation
    APPROVED,   // Accepté par l'admin
    REJECTED    // Refusé par l'admin
}
