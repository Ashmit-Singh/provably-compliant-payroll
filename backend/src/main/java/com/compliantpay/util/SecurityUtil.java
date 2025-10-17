package com.compliantpay.util;

import java.util.Base64;

public class SecurityUtil {
    
    public static String encodeBase64(String input) {
        return Base64.getEncoder().encodeToString(input.getBytes());
    }
    
    public static String decodeBase64(String encoded) {
        return new String(Base64.getDecoder().decode(encoded));
    }
    
    public static String maskSensitiveData(String data) {
        if (data == null || data.length() <= 8) {
            return "***";
        }
        return data.substring(0, 4) + "..." + data.substring(data.length() - 4);
    }
}