package com.ssafy.stackup.domain.payment.service;//package com.ssafy.stackup.domain.payment.service;
//
//import com.ssafy.stackup.domain.board.repository.BoardRepository;
//import jakarta.annotation.PostConstruct;
//import lombok.RequiredArgsConstructor;
//import lombok.Value;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class PaymentService {
//
//    private final BoardRepository boardRepository;
//    private final IamportClient iamportClient;
//
//    @Value("${portone.api-key}")
//    private String apiKey;
//
//    @Value("${portone.api-secret}")
//    private String apiSecret;
//
//    @PostConstruct
//    public void init() {
//        iamportClient = new IamportClient(apiKey, apiSecret);
//    }
//
//    public IamportResponse<Payment> requestVirtualPayment(String impUid) throws IamportResponseException, IOException {
//        return iamportClient.paymentByImpUid(impUid);
//    }
//
//    public void handlePaymentSuccess(String impUid, Long boardId) throws IamportResponseException, IOException {
//        IamportResponse<Payment> paymentResponse = requestVirtualPayment(impUid);
//
//        if (paymentResponse.getResponse().getStatus().equals("paid")) {
//            Board board = boardRepository.findById(boardId).orElseThrow(() -> new EntityNotFoundException("Board not found"));
//            board.setIsCharged(true);
//            boardRepository.save(board);
//        }
//    }
//}
