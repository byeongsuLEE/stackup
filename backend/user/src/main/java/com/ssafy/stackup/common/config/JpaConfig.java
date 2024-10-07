package com.ssafy.stackup.common.config;//package com.ssafy.stackup.common.config;
//
//import jakarta.persistence.EntityManagerFactory;
//import org.springframework.boot.autoconfigure.domain.EntityScan;
//import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.FilterType;
//import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
//import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//import org.springframework.orm.jpa.JpaTransactionManager;
//import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
//import org.springframework.transaction.PlatformTransactionManager;
//
//import javax.sql.DataSource;
//
//@Configuration
//@EnableJpaRepositories(
//        basePackages = "com.ssafy.stackup", // 기본적으로 스캔할 패키지
//        excludeFilters = @ComponentScan.Filter(
//                type = FilterType.REGEX,
//                pattern = "com\\.ssafy\\.stackup\\.domain\\.recommend\\.repository\\..*" // 제외할 패키지
//        )
//)
//@EntityScan(basePackages = "com.ssafy.stackup")
//@EnableJpaAuditing
//public class JpaConfig {
//
//    @Bean
//    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
//            EntityManagerFactoryBuilder builder, DataSource dataSource) {
//        return builder
//                .dataSource(dataSource)
//                .packages("com.ssafy.stackup") // 엔티티 패키지 지정
//                .persistenceUnit("myJpaUnit")
//                .build();
//    }
//
//    @Bean
//    public PlatformTransactionManager transactionManager(
//            EntityManagerFactory entityManagerFactory) {
//        return new JpaTransactionManager(entityManagerFactory);
//    }
//}
