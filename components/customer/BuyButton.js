import React from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import NProgress from 'nprogress';

import Button from '@material-ui/core/Button';

import { buyBook } from '../../lib/api/customer';
import notify from '../../lib/notifier';
import env from '../../lib/env';
const { StripePublishableKey } = env;

const styleBuyButton = {
  margin: '20px 20px 20px 0px',
  font: '14px Muli',
};

class BuyButton extends React.Component {
  // 1. propTypes and defaultProps

  // 2. constructor (set initial state)

  // 3. onToken function
  onToken = async (token) => {
    NProgress.start();
    const { book } = this.props;
    this.setState({ showModal: false });

    try {
      await buyBook({ stripeToken: token, id: book._id });
      notify('Success!');
      NProgress.done();
    } catch (err) {
      NProgress.done();
      notify(err);
    }
  };

  // 4. onLoginClicked function
  onLoginClicked = () => {
    const { user } = this.props;

    if (!user) {
      window.location.href = '/auth/google';
    }
  };

  render() {
    // 5. define variables with props and state
    const { book, user } = this.props;
    const { showModal } = this.state;

    if (!book) {
      return null;
    }

    if (!user) {
      // 6. Regular button with onClick={this.onLoginClicked} event handler
      return (
        <div>
          <Button
            variant="contained"
            style={styleBuyButton}
            color="primary"
            onClick={this.onLoginClicked}
          >
            Buy for $
            {book.price}
          </Button>
        </div>
      );
    }

    return (
      // 7. StripeCheckout button with token and stripeKey parameters
      <StripeCheckout
        stripeKey={StripePublishableKey}
        token={this.onToken}
        name={book.name}
        amount={book.price * 100}
        email={user.email}
        desktopShowModal={showModal || null}
      >
        <Button variant="contained" style={styleBuyButton} color="primary">
          Buy for $
          {book.price}
        </Button>
      </StripeCheckout>
    );
  }
}

export default BuyButton;
