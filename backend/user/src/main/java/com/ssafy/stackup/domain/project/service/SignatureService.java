package com.ssafy.stackup.domain.project.service;

import com.ssafy.stackup.common.exception.CustomException;
import com.ssafy.stackup.common.response.ErrorCode;
import com.ssafy.stackup.domain.user.entity.User;
import com.ssafy.stackup.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Service
public class SignatureService {
    @Autowired
    private UserRepository userRepository;

    public boolean verifySignature(String message, String signature, String userAddress){
        try {
            // 사용자 주소로부터 공개키를 생성
            PublicKey publicKey = getPublicKeyFromAddress(userAddress);

            // Signature 객체 생성
            Signature signer = Signature.getInstance("SHA256withECDSA");
            signer.initVerify(publicKey);
            signer.update(message.getBytes());

            // 서명 검증
            return signer.verify(hexStringToByteArray(signature));
        } catch (Exception e) {
            throw new RuntimeException("Error verifying signature: " + e.getMessage());
        }
    }

    private PublicKey getPublicKeyFromAddress(String userAddress) throws NoSuchAlgorithmException, InvalidKeySpecException {
        // 사용자 주소를 기반으로 공개키를 가져오는 로직
        User user = userRepository.findByUserAddress(userAddress)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (user != null && user.getPublicKey() != null) {
            // Base64로 인코딩된 공개키를 디코딩하여 PublicKey 객체 생성
            byte[] keyBytes = Base64.getDecoder().decode(user.getPublicKey());
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("ECDSA");
            return keyFactory.generatePublic(spec);
        }
        return null; // 사용자 없거나 공개키가 없으면 null 0반환
    }


    private byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }
}
