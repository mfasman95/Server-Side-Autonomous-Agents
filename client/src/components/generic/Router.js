import React from 'react';
import { connect } from 'react-redux';

class Router extends React.Component {
  render() {
    // Determine the page to render
    const Page = this.props.pages[this.props.page];
    const PageNotFound = this.props.notFound;

    // If the page does not exist, present the 404 pages
    if (!Page) return <PageNotFound pageWanted={this.props.page}/>;
    else return <Page/>;
  }
}

//Function to map the redux state to object properties
const mapStateToProps = (state, ownProps) => { return { page: state.route.page } };

export default connect(mapStateToProps)(Router);
