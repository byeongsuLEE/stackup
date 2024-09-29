package com.ssafy.stackup.domain.payment.controller;//package com.ssafy.stackup.domain.payment.controller;
//
//import com.ssafy.stackup.domain.payment.service.PaymentService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/payments")
//@RequiredArgsConstructor
//public class PaymentController {
//
//    private final PaymentService paymentService;
//
//    @PostMapping("/complete")
//    public ResponseEntity<String> completePayment(@RequestParam String impUid, @RequestParam Long boardId) {
//        try {
//            paymentService.handlePaymentSuccess(impUid, boardId);
//            return ResponseEntity.ok("Payment success and Board is updated");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment failed");
//        }
//    }
//}
