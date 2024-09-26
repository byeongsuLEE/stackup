package com.ssafy.stackup.common.s3.service;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

import static org.hibernate.query.sqm.tree.SqmNode.log;

/**
 * 작성자   : user
 * 작성날짜 : 2024-07-31
 * 설명    : S3 이미지 업로드 서비스
 */
@Service
public class S3ImageUpLoadService {


    private final AmazonS3 amazonS3;

    //   private final dbRepository dbRepository; 나중에 db 레포 만들어야함

    private final String bucketName;

    public S3ImageUpLoadService(AmazonS3 amazonS3, @Value("${cloud.aws.s3.bucket}") String bucketName) {
        this.amazonS3 = amazonS3;
        this.bucketName = bucketName;
    }

    public String uploadImage(MultipartFile imageFile) throws AmazonServiceException, SdkClientException, IOException {
        // 고유 파일 이름 생성
        String originalFileName = imageFile.getOriginalFilename();
        String extension = "";

        // originalFileName이 null이 아니고 확장자가 포함되어 있는지 확인
        if (originalFileName != null && originalFileName.lastIndexOf('.') != -1) {
            extension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        }

        String fileName = UUID.randomUUID().toString() + extension;

        //메타 데이터 생성
        ObjectMetadata metadata = extractMetadata(imageFile);

        try {
            //파일 업로드
            amazonS3.putObject(bucketName, fileName, imageFile.getInputStream(), metadata);

            //url로 변환
            String fileUrl = amazonS3.getUrl(bucketName, fileName).toString();

            //DB URL 저장
            //dto 생성 = new dto
            //dto.setUrl ->
            // db 저장

            return fileUrl;
        }
        catch(SdkClientException | IOException e){
            log.error("upload faile",e);
            throw e;
        }


    }

    /**
     * 작성자   : 이병수
     * 작성날짜 : 2024-07-31
     * 설명    : MultipartFile에서 메타데이터를 추출합니다.
     *
     * @param imageFile 메타데이터를 추출할 이미지 파일
     * @return 추출된 메타데이터
     */
    private ObjectMetadata extractMetadata(MultipartFile imageFile) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(imageFile.getContentType());
        metadata.setContentLength(imageFile.getSize());
        return metadata;
    }

}