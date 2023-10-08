package com.codeclan.server.components;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@SpringBootApplication
@EnableWebSocket
public class WebSocketServer implements WebSocketConfigurer {
    public static void main(String[] args) {
        SpringApplication.run(WebSocketServer.class, args);
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(myHandler(), "/websocket")
                .setAllowedOrigins("http://localhost:5173")
                .withSockJS();
    }

    @Bean
    public WebSocketHandler myHandler() {
        return new WebSocketHandler() {
            @Override
            public void afterConnectionEstablished(WebSocketSession session) throws Exception {
                System.out.println("Connection established");
            }

            @Override
            public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
                System.out.println("Received message: " + message.getPayload());
            }

            @Override
            public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
                System.out.println("Transport error: " + exception.getMessage());
            }

            @Override
            public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
                System.out.println("Connection closed");
            }

            @Override
            public boolean supportsPartialMessages() {
                return false;
            }
        };
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
        container.setMaxTextMessageBufferSize(8192);
        container.setMaxBinaryMessageBufferSize(8192);
        container.setMaxSessionIdleTimeout(30000L);
//        container.setPort(8443);
//        container.setSecure(true);
//        container.setSslProtocol("TLS");
//        container.setKeyStorePassword("password");
//        container.setKeyStoreType("PKCS12");
//        container.setKeyStore(new ClassPathResource("keystore.p12"));
//        container.setHost("192.168.1.100");
        return container;
    }
}
