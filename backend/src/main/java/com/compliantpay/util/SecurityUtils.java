package com.compliantpay.util;

public class SecurityUtils {

    /**
     * Basic server-side sanitization for input strings.
     * - trims
     * - escapes basic HTML entities
     * - removes suspicious path traversal sequences
     */
    public static String sanitize(String input) {
        if (input == null) return null;
        String s = input.trim();
    // remove path traversal patterns
    s = s.replaceAll("\\.\\./", "");
    s = s.replaceAll("\\./", "");

        // minimal HTML escape
        s = s.replace("&", "&amp;");
        s = s.replace("<", "&lt;");
        s = s.replace(">", "&gt;");
        s = s.replace("\"", "&quot;");
        s = s.replace("'", "&#x27;");
        s = s.replace("/", "&#x2F;");

        return s;
    }
}
