package com.codeclan.server.controllers;

import com.codeclan.server.models.Card;
import com.codeclan.server.models.GameObject;
import com.codeclan.server.models.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.lang.reflect.Array;
import java.util.ArrayList;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    private final ArrayList<GameObject> gameObjects = new ArrayList<>();

    @MessageMapping("/chatMessage")
    @SendTo("/game/chatroom")
    private Message receivePublicMessage(@Payload Message message){
        System.out.printf("message received: %s\n",message);
        return message;
    }

    @MessageMapping("/updateGame")
    @SendTo("/game/gameObject")
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
                break;
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

    @MessageMapping("/updatePlayerName")
    @SendTo("/game/playerName")
    private String receivePlayerName(@Payload String playerName){
        System.out.printf("Player name received: %s\n",playerName);
        return playerName;
    }

    @MessageMapping("/updateHand")
    @SendTo("/game/hand")
    private ArrayList<Card> receiveHand(@Payload ArrayList<Card> hand){
        System.out.printf("Hand received: %s\n",hand);
        return hand;
    }
}
