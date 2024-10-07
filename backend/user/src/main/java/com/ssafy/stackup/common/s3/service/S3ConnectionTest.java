package com.ssafy.stackup.common.s3.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

public class S3ConnectionTest {
    public static void main(String[] args) {
        String accessKey = System.getenv("AWS_ACCESS_KEY_ID");
        String secretKey = System.getenv("AWS_SECRET_ACCESS_KEY");
        String region = "ap-northeast-2";

        AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);

        AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region)
                .build();

        String bucketName = "worqbucket";

        try {
            s3Client.listObjects(bucketName).getObjectSummaries().forEach(s -> System.out.println(s.getKey()));
            System.out.println("Connection successful!");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Connection failed: " + e.getMessage());
        }

    }
}
