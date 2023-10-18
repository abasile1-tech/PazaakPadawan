package com.codeclan.server.controllers;

import com.codeclan.server.models.GameObject;
import com.codeclan.server.models.InitialConnectingData;
import com.codeclan.server.models.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    private Message receivePublicMessage(@Payload Message message){
        System.out.printf("message received: %s\n",message);
        return message;
    }

    @MessageMapping("/updateGame")
    @SendTo("/chatroom/public")
    private GameObject receiveGameObject(@Payload GameObject gameObject){
        System.out.printf("Game object received: %s\n",gameObject);
        return gameObject;
    }

    @MessageMapping("/initialConnection")
    @SendTo("/chatroom/public")
    private InitialConnectingData receivePublicMessage(@Payload InitialConnectingData initialConnectingData){
        System.out.printf("Initial Connection Data received: %s\n",initialConnectingData);
        return initialConnectingData;
    }
}
