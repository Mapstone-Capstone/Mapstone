package com.mapstone.mapstone.services;

import org.passay.CharacterData;
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.PasswordGenerator;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.passay.IllegalCharacterRule.ERROR_CODE;

//This class uses the passay dependency

@Service
public class RandomPasswordGenerator {

    public static String generateRandomPassword() {
        //instantiate the generator
        PasswordGenerator generator = new PasswordGenerator();

       // establish rules for generating temporary password

       //password must have at least 2 lower case characters
        CharacterData lowerCaseChars = EnglishCharacterData.LowerCase;
        CharacterRule lowerCaseRule = new CharacterRule(lowerCaseChars);
        lowerCaseRule.setNumberOfCharacters(2);

        //password must have at least 2 upper case characters
        CharacterData upperCaseChars = EnglishCharacterData.UpperCase;
        CharacterRule upperCaseRule = new CharacterRule(upperCaseChars);
        upperCaseRule.setNumberOfCharacters(2);

        //password must have at least 2 digit characters
        CharacterData digitChars = EnglishCharacterData.Digit;
        CharacterRule digitRule = new CharacterRule(digitChars);
        digitRule.setNumberOfCharacters(2);

        //password must have at least 2 special characters
        CharacterData specialChars = new CharacterData() {

            @Override
            public String getErrorCode() {
                return ERROR_CODE;
            }

            @Override
            public String getCharacters() {
                return "!@#$%^&*()_+";
            }
        };

        //password must have at least 2 special characters
        CharacterRule splCharRule = new CharacterRule(specialChars);
        splCharRule.setNumberOfCharacters(2);

        //add rules to list
        List<CharacterRule> rules = List.of(lowerCaseRule, upperCaseRule, digitRule, splCharRule);

        //generate password must be 10 characters long and must satisfy rules
        String password = generator.generatePassword(10, rules);

        return password;
    }
}
