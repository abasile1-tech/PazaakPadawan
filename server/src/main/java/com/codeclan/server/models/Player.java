package com.codeclan.server.models;

import java.util.ArrayList;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Player {
    private String name;
    private String action;
    private Boolean isTurn;
    private ArrayList<Card> hand;
    private Integer tally;
    private ArrayList<Card> table;
    private Integer roundsWon;
    private String wonRound;
    private Boolean playedCardThisTurn;
}