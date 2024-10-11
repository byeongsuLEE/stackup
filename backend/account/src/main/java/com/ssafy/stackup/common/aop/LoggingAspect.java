//package com.ssafy.stackup.common.aop;
//
//import com.wava.worcation.common.jwt.TokenProvider;
//import jakarta.servlet.http.HttpServletRequest;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.aspectj.lang.JoinPoint;
//import org.aspectj.lang.ProceedingJoinPoint;
//import org.aspectj.lang.annotation.AfterThrowing;
//import org.aspectj.lang.annotation.Around;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Pointcut;
//import org.springframework.security.core.Authentication;
//import org.springframework.stereotype.Component;
//
//@Component
//@Aspect
//@RequiredArgsConstructor
//@Slf4j
//public class LoggingAspect {
//    private final HttpServletRequest request;
//    private final TokenProvider tokenProvider;
//    /**
//     * 작성자   : 안진우
//     * 작성일   : 2024-08-11
//     * 설명     : 모든 컨트롤러 패키지에서 사용할 포인트 컷
//     */
//    @Pointcut("execution(* com.wava.worcation.domain.*.controller..*(..))"
//        + " && !execution(* com.wava.worcation.domain.chat.controller..*(..))"
//        + " && !execution(* com.wava.worcation.domain.cursor.controller..*(..))")
//    private void controllerExecution() {}
//
//    /**
//     * 작성자   : 안진우
//     * 작성일   : 2024-08-11
//     * 설명     : Controller클래스, 실행 메서드, 종료 시간 로깅
//     */
//    @Around("controllerExecution()")
//    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
//        long startTime = System.currentTimeMillis();
//        try {
//            log.info("[{} - {}] URI: {}",
//                    request.getMethod(),
//                    joinPoint.getSignature().toShortString().replace("(..)", ""),
//                    request.getRequestURI());
//            if(request.getHeader("Authorization") != null) {
//                String accessToken = tokenProvider.resolveToken(request);
//                Authentication authentication = tokenProvider.getAuthentication(accessToken);
//                log.info("[Request user] : {}", authentication.getName());
//            }
//            return joinPoint.proceed();
//        } finally {
//            long endTime = System.currentTimeMillis();
//            log.info("[Execution Time] {} ms", endTime - startTime);
//        }
//    }
//
//    /**
//     * 작성자   : 안진우
//     * 작성일   : 2024-08-11
//     * 설명     : 컨트롤러에서 예외 발생시 작동
//     * 메소드 발생 시점, HTTP 메서드 타입, Exception 타입, Exception 메세지, 에러 발생 위치 (패키지,메서드,라인), 에러 코드
//     */
//    @AfterThrowing(pointcut = "controllerExecution()", throwing = "ex")
//    public void controllerAfterThrowing(JoinPoint joinPoint, Throwable ex) {
//        StackTraceElement[] stackTrace = ex.getStackTrace();
//        StackTraceElement errorLocation = stackTrace[0];
//
//        log.error("[Error] Method : {}",
//                joinPoint.getSignature().getName());
//
//        log.error("[ExceptionType] : {} | Message: {}",
//                ex.getClass().getName(),
//                ex.getMessage());
//
//        log.error("[Occurred at] : {}.{} (Line: {})",
//                errorLocation.getClassName(),
//                errorLocation.getMethodName(),
//                errorLocation.getLineNumber());
//    }
//
//    /**
//     * 작성자   : 안진우
//     * 작성일   : 2024-08-12
//     * 설명     : 토큰 에러 발생 시 작동
//     * 메서드 명, Exception 타입 및 에러 메세지, 에러 발생 위치 (클래스명, 메서드명, 라인 번호)
//     */
//    @AfterThrowing(pointcut = "execution(* com.wava.worcation.common.jwt.TokenProvider.*(..))", throwing = "ex")
//    public void tokenAfterThrowing(JoinPoint joinPoint, Exception ex) {
//        // 에러 발생 메서드명
//        log.error("[Error] Method: {}",
//                joinPoint.getSignature().getName());
//
//        // 예외 타입 및 메시지
//        log.error("[ExceptionType]: {} | Message: {}",
//                ex.getClass().getName(),
//                ex.getMessage());
//
//        // 에러 발생 위치 (클래스명, 메서드명, 라인 번호)
//        StackTraceElement errorLocation = ex.getStackTrace()[0];  // 스택 트레이스의 첫 번째 요소 (에러 발생 위치)
//        log.error("[Occurred at]: {}.{} (Line: {})",
//                errorLocation.getClassName(),
//                errorLocation.getMethodName(),
//                errorLocation.getLineNumber());
//    }
//
//
//}
