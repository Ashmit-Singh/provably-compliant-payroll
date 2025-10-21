
package com.compliantpay.blockchain.service;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

import org.springframework.stereotype.Service;

@Service
public class ProofAnchorService {

    public String anchor(String digest, String source) {
        try {
            String payload = (digest == null ? "" : digest) + ":" + (source == null ? "" : source) + ":" + System.currentTimeMillis();
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashed = md.digest(payload.getBytes("UTF-8"));
            String txHash = "0x" + HexFormat.of().formatHex(hashed);
            // In production, this would send a transaction to a blockchain node and return the tx hash.
            return txHash;
        } catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
            // Handle checked exceptions for digest and encoding
            throw new RuntimeException("Error generating SHA-256 digest: " + e.getMessage(), e);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
