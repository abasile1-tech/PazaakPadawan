package com.codeclan.server.models;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GameObject {
    private Player player1;
    private Player player2;
    private String gameState;
    private String sessionID;
}
