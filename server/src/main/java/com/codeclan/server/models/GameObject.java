package com.codeclan.server.models;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GameObject {
    private String player1;
    private String player2;
    private String gameState;
    private String sessionID;
}
