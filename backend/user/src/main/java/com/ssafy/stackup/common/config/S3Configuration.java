package com.ssafy.stackup.common.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 작성자   : user
 * 작성날짜 : 2024-07-31
 * 설명    : s3 세팅 클래스
 */

@Configuration
public class S3Configuration {
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.region.static}")
    private String region;


    /**
     *
     * @ 작성자   : 이병수
     * @ 작성일   : 2024 - 07 - 31
     * @ 설명     : 스프링 빈으로 등록한 AmazonS3 객체를 사용하여 이미지 파일을 S3 업로드할 수 있다.
     * @return

     */
    @Bean
    public AmazonS3 s3Builder(){
        AWSCredentials basicAWSCredentials =new BasicAWSCredentials(accessKey,secretKey);

        return AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials))
                .withRegion(region).build();
    }



}
