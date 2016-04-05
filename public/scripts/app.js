var React = require('react');
var ReactDOM = require('react-dom');
var CommentBox = require('./components/CommentBox')

ReactDOM.render(
  <CommentBox url="/api/v1/comments" pollInterval={2000}/>,
  document.getElementById('app')
);