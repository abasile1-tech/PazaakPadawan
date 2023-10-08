package com.codeclan.server.controllers;

import com.codeclan.server.models.MessageRequest;
import com.codeclan.server.models.MessageResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public MessageResponse sendMessage(@Payload MessageRequest message) {
        return new MessageResponse(message.getFrom(), message.getText());
    }
}

