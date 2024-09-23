// import React, { useEffect, useState } from 'react';
// import Web3 from 'web3';

// const useToken: React.FC = () => {
//   const [account, setAccount] = useState<string | null>(null);
//   const [web3, setWeb3] = useState<Web3 | null>(null);

//   useEffect(() => {
//     const initWeb3 = async () => {
//       if (window.ethereum) {
//         const web3Instance = new Web3(window.ethereum);
//         setWeb3(web3Instance);

//         try {
//           // 사용자가 메타마스크 지갑을 연결하도록 요청
//           await window.ethereum.request({ method: 'eth_requestAccounts' });
//           const accounts = await web3Instance.eth.getAccounts();
//           setAccount(accounts[0]);
//         } catch (error) {
//           console.error('User denied account access', error);
//         }
//       } else {
//         console.error('MetaMask not detected');
//       }
//     };

//     initWeb3();
//   }, []);

//   return (
    
//     // <div>
//     // { account?<p>Connected account: { account } < /p> : <p>Not connected</p >}
//     // < /div>
//   )
// };

// export default useToken;
