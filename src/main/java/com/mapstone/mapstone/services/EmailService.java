package com.mapstone.mapstone.services;

import com.mapstone.mapstone.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.stereotype.Service;

@Service("mailService")
public class EmailService {

    @Autowired
    public JavaMailSender emailSender;

    @Value("${spring.mail.from}")
    private String from;

    public void prepareAndSend(User user, String subject, String body) {
       MimeMailMessage msg = new MimeMailMessage(this.emailSender.createMimeMessage());
        msg.setFrom(this.from);
        msg.setTo(user.getEmail());
        msg.setSubject(subject);
        msg.setText(body);

        try {
            this.emailSender.send(msg.getMimeMessage());
        } catch (MailException ex) {
            System.err.println(ex.getMessage());
        }
    }
}

