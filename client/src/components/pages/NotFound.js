import React from 'react';
import { Col } from 'react-bootstrap';

class Page404 extends React.Component {
  render() {
    return (
      <div>
        <h1>404: Page Not Found</h1>
        <Col xs={6} xsOffset={3}>
          <h3>The page <b>{this.props.pageWanted}</b> could not be found...</h3>
        </Col>
      </div>
    );
  }
}

export default Page404;