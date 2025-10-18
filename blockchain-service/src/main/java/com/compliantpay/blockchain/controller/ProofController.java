package com.compliantpay.blockchain.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

import com.compliantpay.blockchain.service.ProofAnchorService;

import java.util.Map;

@RestController
@RequestMapping("/anchor")
public class ProofController {

    @Autowired
    private ProofAnchorService anchorService;

    @PostMapping("/proof")
    public ResponseEntity<Map<String, String>> anchorProof(@RequestBody Map<String, Object> body) {
        String digest = (String) body.getOrDefault("digest", "");
        String source = (String) body.getOrDefault("source", "ai-service");
        String tx = anchorService.anchor(digest, source);
        return ResponseEntity.ok(Map.of("txHash", tx, "digest", digest));
    }
}
