package com.compliantpay.blockchain.service;

import java.security.MessageDigest;
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
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
