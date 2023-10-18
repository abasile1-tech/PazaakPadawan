package com.codeclan.server.models;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class InitialConnectingData {
    private String sessionID;
    private String player1Name;
    private String player2Name;
}
