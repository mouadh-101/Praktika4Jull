package tn.esprit.intershipproccess.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.intershipproccess.entity.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository <Message, Long> {

    List<Message> findBySenderIdAndReceiverIdOrderByTimestamp(String senderId, String receiverId);

}
