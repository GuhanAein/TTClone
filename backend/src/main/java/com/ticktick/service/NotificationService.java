package com.ticktick.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final JavaMailSender mailSender;
    // private final FirebaseMessaging firebaseMessaging; // Uncomment when Firebase is configured
    
    @Async
    public void sendEmailNotification(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("noreply@ticktick.com");
            
            mailSender.send(message);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}", to, e);
        }
    }
    
    @Async
    public void sendPushNotification(String fcmToken, String title, String body) {
        if (fcmToken == null || fcmToken.isEmpty()) {
            log.warn("FCM token is null or empty, skipping push notification");
            return;
        }
        
        try {
            // Uncomment when Firebase is configured
            /*
            Message message = Message.builder()
                    .setToken(fcmToken)
                    .setNotification(Notification.builder()
                            .setTitle(title)
                            .setBody(body)
                            .build())
                    .build();
            
            String response = firebaseMessaging.send(message);
            log.info("Push notification sent: {}", response);
            */
            log.info("Push notification would be sent to token: {}", fcmToken);
        } catch (Exception e) {
            log.error("Failed to send push notification", e);
        }
    }
}
