// src/hooks/useTransaction.js - Custom hook for transaction management

import { useSelector, useDispatch } from 'react-redux';
import transactionService from '../services/transactionService';
import {
  getQuoteStart,
  getQuoteSuccess,
  getQuoteFailure,
  initiateTransferStart,
  initiateTransferSuccess,
  initiateTransferFailure,
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  clearQuote
} from '../store/slices/transactionSlice';

export function useTransaction() {
  const dispatch = useDispatch();
  const quote = useSelector(state => state.transactions.quote);
  const transactions = useSelector(state => state.transactions.transactions);
  const isLoading = useSelector(state => state.transactions.isLoading);
  const error = useSelector(state => state.transactions.error);

  const getQuote = async (recipientId, amount, sendCurrency, receiveCurrency) => {
    dispatch(getQuoteStart());
    try {
      const result = await transactionService.getQuote(
        recipientId,
        amount,
        sendCurrency,
        receiveCurrency
      );
      dispatch(getQuoteSuccess(result));
      return result;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to get quote';
      dispatch(getQuoteFailure(message));
      throw err;
    }
  };

  const initiateTransfer = async (recipientId, amount, paymentMethod) => {
    dispatch(initiateTransferStart());
    try {
      const result = await transactionService.initiateTransfer(
        recipientId,
        amount,
        paymentMethod
      );
      dispatch(initiateTransferSuccess(result));
      dispatch(clearQuote());
      return result;
    } catch (err) {
      const message = err.response?.data?.message || 'Transfer failed';
      dispatch(initiateTransferFailure(message));
      throw err;
    }
  };

  const getTransactions = async (filters = {}) => {
    dispatch(fetchTransactionsStart());
    try {
      const result = await transactionService.getTransactions(filters);
      dispatch(fetchTransactionsSuccess(result.transactions));
      return result;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch transactions';
      dispatch(fetchTransactionsFailure(message));
      throw err;
    }
  };

  const trackTransfer = async (transactionId) => {
    try {
      const result = await transactionService.trackTransfer(transactionId);
      return result;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to track transfer';
      throw err;
    }
  };

  return {
    quote,
    transactions,
    isLoading,
    error,
    getQuote,
    initiateTransfer,
    getTransactions,
    trackTransfer,
    clearQuote: () => dispatch(clearQuote())
  };
}

export default useTransaction;
