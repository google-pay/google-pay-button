// declare global {
//   namespace gapi {
//     namespace savetoandroidpay {
//       type ButtonHeight = 'small' | 'standard';
//       type ButtonSize = 'matchparent' | undefined;
//       type ButtonTextSize = 'large' | undefined;
//       type ButtonTheme = 'dark' | 'light';

//       type SuccessHandler = () => void;
//       type FailureHandler = (error: Error) => void;
//       type ProvideJwtHandler = () => string;

//       interface ButtonOptions {
//         jwt: string;
//         height?: ButtonHeight;
//         size?: ButtonSize;
//         textsize?: ButtonTextSize;
//         theme?: ButtonTheme;

//         onSuccess?: SuccessHandler;
//         onFailure?: FailureHandler;
//         onProvideJwt?: ProvideJwtHandler;
//       }

//       function render(domId: string | Element, options: ButtonOptions): void;
//     }
//   }
// }
