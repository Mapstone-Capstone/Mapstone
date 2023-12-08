//package com.mapstone.mapstone;
//
//import jakarta.validation.Constraint;
//import jakarta.validation.Payload;
//import java.lang.annotation.*;
//
//@Documented
//@Constraint(validatedBy = PasswordConstraintValidator.class)
//@Target({ ElementType.FIELD })
//@Retention(RetentionPolicy.RUNTIME)
//public @interface PasswordConstraint {
//    String message() default "Password must contain at least 1 uppercase letter, 1 number, 1 special character, and be at least 4 characters long";
//
//    Class<?>[] groups() default {};
//
//    Class<? extends Payload>[] payload() default {};
//}