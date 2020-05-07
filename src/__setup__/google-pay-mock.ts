class PaymentsClient {
  isReadyToPay(request: google.payments.api.IsReadyToPayRequest): Promise<google.payments.api.IsReadyToPayResponse> {
    return Promise.resolve({
      result: true,
      paymentMethodPresent: true,
    });
  }

  loadPaymentData(request: google.payments.api.PaymentDataRequest): Promise<google.payments.api.PaymentData> {
    return Promise.resolve({
      apiVersion: request.apiVersion,
      apiVersionMinor: request.apiVersionMinor,
      paymentMethodData: {
        type: 'CARD',
        tokenizationData: {
          type: 'PAYMENT_GATEWAY',
          token: 'token',
        },
      },
    });
  }

  createButton(request: google.payments.api.ButtonOptions): HTMLElement {
    return document.createElement('div');
  }

  prefetchPaymentData(request: google.payments.api.PaymentDataRequest): void {
    throw new Error('Not implemented');
  }
}

window.google = {
  payments: {
    api: {
      PaymentsClient,
    }
  }
};
