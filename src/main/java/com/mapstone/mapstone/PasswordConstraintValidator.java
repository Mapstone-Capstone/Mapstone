//package com.mapstone.mapstone;
//
//import jakarta.validation.ConstraintValidator;
//import jakarta.validation.ConstraintValidatorContext;
//import org.passay.CharacterRule;
//import org.passay.EnglishCharacterData;
//import org.passay.LengthRule;
//import org.passay.PasswordValidator;
//
//import java.util.Arrays;
//import java.util.regex.Matcher;
//import java.util.regex.Pattern;
//
//public class PasswordConstraintValidator implements ConstraintValidator<PasswordConstraint, String> {
//
//    @Override
//    public void initialize(PasswordConstraint passwordConstraint) {}
//
//    @Override
//    public boolean isValid(String password, ConstraintValidatorContext context) {
//        if (password == null) {
//            return false;
//        }
//
//        // Password pattern requiring at least 1 uppercase letter, 1 number, 1 special character, and minimum 4 characters
//        String passwordPattern = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{4,}$";
//        Pattern pattern = Pattern.compile(passwordPattern);
//        Matcher matcher = pattern.matcher(password);
//
//        return matcher.matches();
//
//
////        PasswordValidator validator = new PasswordValidator(Arrays.asList(
////                // at least 8 characters
////                new LengthRule(8, 30),
////
////                // at least one upper-case character
////                new CharacterRule(EnglishCharacterData.UpperCase, 1),
////
////                // at least one lower-case character
////                new CharacterRule(EnglishCharacterData.LowerCase, 1),
////
////                // at least one digit character
////                new CharacterRule(EnglishCharacterData.Digit, 1),
////
////                // at least one symbol (special character)
////                new CharacterRule(EnglishCharacterData.Special, 1),
////
////                // no whitespace
////                new WhitespaceRule()
////
////        ));
////        RuleResult result = validator.validate(new PasswordData(password));
////        if (result.isValid()) {
////            return true;
////        }
////        List<String> messages = validator.getMessages(result);
////
////        String messageTemplate = messages.stream()
////                .collect(Collectors.joining(","));
////        context.buildConstraintViolationWithTemplate(messageTemplate)
////                .addConstraintViolation()
////                .disableDefaultConstraintViolation();
////        return false;
//    }
//}
//
