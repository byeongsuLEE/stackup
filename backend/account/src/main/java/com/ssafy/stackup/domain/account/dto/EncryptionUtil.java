package com.ssafy.stackup.domain.account.dto;

import org.springframework.beans.factory.annotation.Value;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncryptionUtil {
    private static String ALGORITHM = "AES";
    private static String TRANSFORMATION = "AES";
    private static String SECRET_KEY = "e0wzZrZ6U6aB0e3Ol46ejg==";

//    static {
//        try{
//            SecretKey secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
//        }
//    }

//    @Value("${app.secret.key}")
//    private static SecretKeySpec secretKey;

//    @Value("${app.secret.key}")
//    private void setSecretKey() {
//        String key = "e0wzZrZ6U6aB0e3Ol46ejg==";
//        if (key == null || key.length() == 0) {
//            throw new IllegalArgumentException("Invalid or missing app.secret.key in application.properties");
//        }
//        byte[] decodedKey = Base64.getDecoder().decode(key);
//        secretKey = new SecretKeySpec(decodedKey, ALGORITHM);
//    }

//    static {
//        try {
//            // 환경 변수에서 비밀 키를 읽어옴
//            String key = "e0wzZrZ6U6aB0e3Ol46ejg==";
//            if (key == null) {
//                throw new IllegalArgumentException("Invalid or missing SECRET_KEY environment variable");
//            }
//                    byte[] decodedKey = Base64.getDecoder().decode(key);
//        secretKey = new SecretKeySpec(decodedKey, ALGORITHM);
////            secretKey = new SecretKeySpec(key.getBytes(), TRANSFORMATION);
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to initialize encryption utility", e);
//        }
//    }

//    @Value("${app.secret.key}")
//    private void setSecretKey(String key) {
//        if (key == null || key.length() != 16) {
//            throw new IllegalArgumentException("Invalid or missing app.secret.key in application.properties");
//        }
//        secretKey = new SecretKeySpec(key.getBytes(), TRANSFORMATION);
//    }

//    static {
//        try {
//            System.out.println("SecretKey" + secretKey);
////            KeyGenerator keyGen = KeyGenerator.getInstance(ALGORITHM);
////            keyGen.init(128);
////            SecretKey secretKey = keyGen.generateKey();
////            byte[] secretKeyBytes = secretKey.getEncoded();
////
////            // To use this key later, you might want to store it somewhere.
////            // Here we'll just print the key to the console.
////            System.out.println("Secret Key: " + Base64.getEncoder().encodeToString(secretKeyBytes));
////            EncryptionUtil.secretKey = new SecretKeySpec(secretKey.getEncoded(), ALGORITHM);
//        } catch (Exception e) {
//            throw new RuntimeException("암호화 키 생성 실패",e);
//        }
//    }

    public static String encrypt(String data) throws Exception {
        SecretKey secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        System.out.println(secretKey);
        byte[] encrypted = cipher.doFinal(data.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    public static String decrypt(String encryptedData) throws Exception {
        SecretKey secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] decoded = Base64.getDecoder().decode(encryptedData);
        byte[] decrypted = cipher.doFinal(decoded);
        return new String(decrypted);
    }
}
