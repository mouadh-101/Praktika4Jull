package tn.esprit.intershipproccess.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageChat {
    private String senderId;
    private String receiverId;
    private String content;
}
