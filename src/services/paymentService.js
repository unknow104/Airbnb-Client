import { https } from './axiosClient';

export const paymentService = {
    // Function to initiate a VnPay payment
    initiatePayment: (idRoom, orderDTO) => {
        return https.post(`/api/v1/payment/vnpay/${idRoom}`, orderDTO);
    },

    // Function to handle the transaction response from VnPay
    handleTransaction: (idOrder, transactionData) => {
        // Prepare query parameters
        const queryParams = new URLSearchParams(transactionData).toString();
        return https.get(`/api/v1/payment/vnpay/transaction/panther?${queryParams}`);
    }
};