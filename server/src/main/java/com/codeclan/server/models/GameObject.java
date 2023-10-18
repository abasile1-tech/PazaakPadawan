package com.codeclan.server.models;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GameObject {
    private String name;
    private String action;
    private String wonGame;
    private String isTurn;
    private String hand;
    private String tally;
    private String table;
    private String gamesWon;
    private String playedCardThisTurn;
//    private String player2;
//    private String gameState;
//    private String sessionID;
}
