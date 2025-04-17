package tn.esprit.intershipproccess.entity;

public class TypingEvent {
    private String senderId;
    private String receiverId;

    public TypingEvent() {}

    public TypingEvent(String senderId, String receiverId) {
        this.senderId = senderId;
        this.receiverId = receiverId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }
}
