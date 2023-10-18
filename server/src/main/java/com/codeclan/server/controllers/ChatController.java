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

import java.util.ArrayList;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    
    private ArrayList<GameObject> gameObjects = new ArrayList<>();

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    private Message receivePublicMessage(@Payload Message message){
        System.out.printf("message received: %s\n",message);
        return message;
    }

    @MessageMapping("/updateGame")
    @SendTo("/game/updated")
    private GameObject receiveGameObject(@Payload GameObject frontEndGameObject){
        System.out.printf("Game object received: %s\n", frontEndGameObject);
        for (GameObject gameObject:
                gameObjects) {
            if (gameObject.getSessionID().equals(frontEndGameObject.getSessionID())) {
                gameObject.setPlayer2(frontEndGameObject.getPlayer1());
                return gameObject;
            }
        }
        GameObject newGame = new GameObject(
                frontEndGameObject.getPlayer1(),
                frontEndGameObject.getPlayer2(), // fake player passed by frontend
                frontEndGameObject.getGameState(),
                frontEndGameObject.getSessionID()
        );
        gameObjects.add(newGame);
        return newGame;
    }

//    @MessageMapping("/initialConnection")
//    @SendTo("/game/initialConnection")
//    private InitialConnectingData receivePublicMessage(@Payload InitialConnectingData initialConnectingData){
//        System.out.printf("Initial Connection Data received: %s\n",initialConnectingData);
//        for (GameObject gameObject:
//             gameObjects) {
//            if (gameObject.getSessionID().equals(initialConnectingData.getSessionID())) {
//                gameObject.setPlayer2();
//            }
//        }
//        return initialConnectingData;
//    }
}
