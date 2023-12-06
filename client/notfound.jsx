const React = require('react');
const ReactDOM = require('react-dom');

const NotFound = (props) => {
    return (
        <div>
            <h1>Oops! You seem to be lost.</h1>
        </div>
    )
}

const init = () => {
    ReactDOM.render(
        <NotFound />,
        document.getElementById('content')
    );
}

window.onload = init;