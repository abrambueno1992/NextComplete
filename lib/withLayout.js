/* eslint-disable */
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from '../components/Header';

function withLayout(BaseComponent) {
  class App extends React.Component {
    render() {
      return (
        <div>
          <CssBaseline />
          <Header {...this.props} />
          <BaseComponent {...this.props} />
        </div>
      );
    }
  }

  App.getInitialProps = ctx => {
    if (BaseComponent.getInitialProps) {
      return BaseComponent.getInitialProps(ctx);
    }

    return {};
  };

  return App;
}

export default withLayout;
