import React from 'react';
import Example from './Example';
import GooglePayButton from 'react-google-pay-button';

const shippingOptions = [
  {
    id: 'free',
    label: 'Free shipping',
    description: 'Arrives in 5 to 7 days',
    price: '0.00',
  },
  {
    id: 'express',
    label: 'Express shipping',
    description: '$5.00 - Arrives in 1 to 3 days',
    price: '5.00',
  },
];

export default (props: any) => {
  return (
    <Example title="Dynamic Price Updates">
      <GooglePayButton
        allowedPaymentMethods={[
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['MASTERCARD', 'VISA'],
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                'gateway': 'stripe',
                'stripe:version': '2018-10-31',
                'stripe:publishableKey': 'pk_test_MNKMwKAvgdo2yKOhIeCOE6MZ00yS3mWShu',
              },
            },
          },
        ]}
        merchantInfo={{
          merchantId: '17613812255336763067',
          merchantName: 'Demo Merchant',
        }}
        transactionInfo={{
          totalPriceStatus: 'FINAL',
          totalPriceLabel: 'Total',
          currencyCode: 'USD',
          countryCode: 'US',
          displayItems: [
            {
              label: 'Subtotal',
              type: 'SUBTOTAL',
              price: '11.00',
            },
            {
              label: 'Tax',
              type: 'TAX',
              price: '1.00',
            },
            {
              label: 'Shipping',
              type: 'LINE_ITEM',
              price: '0',
              status: 'PENDING',
            }
          ],
        }}
        onPaymentDataResult={(paymentRequest: any) => {
          console.log('Success', paymentRequest);
        }}
        shippingAddressRequired={true}
        shippingOptionParameters={{
          defaultSelectedOptionId: 'free',
          shippingOptions: shippingOptions.map(o => ({
            id: o.id,
            label: o.label,
            description: o.description,
          })),
        }}
        onPaymentDataChanged={(paymentData: any, paymentRequest: any) => {
          const shippingOption = shippingOptions.find(o => o.id === paymentData.shippingOptionData.id);
          const { displayItems } = paymentRequest.transactionInfo;
          if (displayItems) {
            const shippingItem = displayItems.find((i: any) => i.label === 'Shipping');
            if (shippingItem && shippingOption) {
              shippingItem.price = shippingOption.price;
              shippingItem.status = 'FINAL';
      
              console.log('display items', displayItems);
              return {
                newTransactionInfo: {
                  ...paymentRequest.transactionInfo,
                  displayItems: displayItems,
                  totalPrice: displayItems.reduce((sum: number, i: any) => sum + parseFloat(i.price), 0).toFixed(2),
                },
              };
            }
          }
        }}
      />
    </Example>
  );
}
