package tn.esprit.intershipproccess.dto;

public class NotificationMessage {
    private String message;

    public NotificationMessage() {}

    public NotificationMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
