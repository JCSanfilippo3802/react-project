const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleFile = (e) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#fileName').value;
    const age = e.target.querySelector("#fileAge").value;
    const level = e.target.querySelector("#fileLevel").value;

    if(!name || !age || !level) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, level}, loadFilesFromServer);

    return false;
}

const FileForm = (props) => {
    return (
        <form id="fileForm"
            onSubmit={handleFile}
            name="fileForm"
            action="/maker"
            method="POST"
            className="fileForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="fileName" type="text" name="name" placeholder="File Name" />
            <label htmlFor="age">Age: </label>
            <input id="fileAge" type="number" min="0" name="age" />
            <label htmlFor="level">Level: </label>
            <input id="fileLevel" type="number" min="0" name="level" />
            <input className="makeFileSubmit" type="submit" value="Make File" />
        </form>
    );
}

const UpdateForm = (props) => {
    return (
        <form id="updateForm"
        onSubmit={handleFile}
        name="updateForm"
        action="/update"
        method="POST"
        className="updateForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="fileName" type="text" name="name" placeholder="File Name" />
            <label htmlFor="age">Age: </label>
            <input id="fileAge" type="number" min="0" name="age" />
            <label htmlFor="level">Level: </label>
            <input id="fileLevel" type="number" min="0" name="level" />
            <input className="updateFileSubmit" type="submit" value="Update File" />
        </form>
    )
}

const FileList = (props) => {
    if(props.files.length === 0) {
        return (
            <div className = "fileList">
                <h3 className="emptyFile">No Files Yet!</h3>
            </div>
        );
    }

    const fileNodes = props.files.map(file => {

        return (
                <div key={file._id} className="file">
                    <img src="/assets/img/placeholder.png" alt="placeholder" className="fileFace" />
                    <h3 className="fileName">Name: {file.name} </h3>
                    <h3 className="fileAge"> Age: {file.age} </h3>
                    <h3 className="fileLevel"> Level: {file.level} </h3>
                </div>
        );
    });

    return (
        <div className="fileList">
            {fileNodes}
        </div>
    );
}

const loadFilesFromServer = async () => {
    const response = await fetch('/getFiles');
    const data = await response.json();
    ReactDOM.render(
        <FileList files={data.files} />,
        document.getElementById('files')
    );
}

const init = () => {
    ReactDOM.render(
        <FileForm />,
        document.getElementById('makeFile')
    );

    ReactDOM.render(
        <UpdateForm />,
        document.getElementById('updateFile')
    );

    ReactDOM.render(
        <FileList files={[]} />,
        document.getElementById('files')
    );

    loadFilesFromServer();
}

window.onload = init;