package com.codeclan.server.controllers;

import com.codeclan.server.models.GameObject;
import com.codeclan.server.models.InitialConnectingData;
import com.codeclan.server.models.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;

@Controller
public class ChatController {
    
    private final ArrayList<GameObject> gameObjects = new ArrayList<>();

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
        // If the session exists, there should be a player1, so we will set player2
        for (GameObject gameObject:
                gameObjects) {
            if (gameObject.getSessionID().equals(frontEndGameObject.getSessionID()) && !gameObject.getPlayer1().getName().equals(frontEndGameObject.getPlayer1().getName())) {
                gameObject.setPlayer2(frontEndGameObject.getPlayer1());
                System.out.printf("This is the session id found: %s\n",gameObject.getSessionID());
                System.out.printf("Updated GameObject: %s\n", gameObject);
                System.out.printf("Print game objects for first: %s\n", gameObjects);
                return gameObject;
            }
        }

        // If the session does not exist, we need to create it and add it to the games
        boolean sessionExists = false;
        for (GameObject gameObject:
                gameObjects) {
            if (gameObject.getSessionID().equals(frontEndGameObject.getSessionID())) {
                sessionExists = true;
            }
        }

        if (!sessionExists) {
            GameObject newGame = new GameObject(
                    frontEndGameObject.getPlayer1(),
                    frontEndGameObject.getPlayer2(), // fake player passed by frontend
                    frontEndGameObject.getGameState(),
                    frontEndGameObject.getSessionID()
            );
            gameObjects.add(newGame);
            System.out.printf("This is the second attempt, session id found: %s\n",newGame.getSessionID());
            System.out.printf("Print game objects: %s\n", gameObjects);
            return newGame;
        }

        // If we get to here, the session exists and has player1 and player2 so just return the passed in value
        return frontEndGameObject;
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
