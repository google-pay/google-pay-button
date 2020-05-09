import '../lib/__setup__/mocks';
import GooglePayButton from './GooglePayButton';
import defaults from '../lib/__setup__/defaults';
import { ButtonManager } from '../lib/button-manager';
import { MockWrapper, mock, wait } from '../lib/__setup__/test-util';

describe('Render', () => {
  function isMounted(this: ButtonManager) {
    return !!this.getElement();
  }
  const throwError = jest.fn();

  let mocked: MockWrapper[];

  beforeEach(() => {
    mocked = [
      mock(ButtonManager.prototype, 'isMounted', isMounted),
      mock(GooglePayButton.prototype, 'throwError', throwError),
    ];
  });

  afterEach(() => {
    throwError.mockReset();
    mocked.forEach(m => {
      m.restore();
    });
  });

  it('renders without crashing', async () => {
    const button = new GooglePayButton();
    button.paymentRequest = {
      ...defaults.paymentRequest,
    };
  
    await button.connectedCallback();
  });

  it('crashes when required property paymentRequest is not set', async () => {
    const button = new GooglePayButton();

    await button.connectedCallback();

    expect(throwError).toHaveBeenCalledWith(new Error('Required property not set: paymentRequest'));
  });
});
