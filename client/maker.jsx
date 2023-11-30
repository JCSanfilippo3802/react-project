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

    helper.sendPost(e.target.action, {name, data, year, author}, loadFilesFromServer);

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
            <label htmlFor="data">Image: </label>
            <input id="fileData" type="file" name="imageData"/>
            <label htmlFor="year">Year: </label>
            <input id="fileYear" type="number" min="1990" name="year" />
            <label htmlFor="author">Author: </label>
            <input id="fileAuthor" type="text" min="0" name="author" />
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
            <label htmlFor="year">Year: </label>
            <input id="fileYear" type="number" min="0" name="age" />
            <label htmlFor="author">Author: </label>
            <input id="fileAuthor" type="text" min="0" name="author" />
            <input className="updateFileSubmit" type="submit" value="Update File" />
        </form>
    )
}

const FileList = (props) => {
    if(props.files.length === 0) {
        return (
            <div className = "fileList">
                <h3 className="emptyFile">No Images Yet!</h3>
            </div>
        );
    }

    const fileNodes = props.files.map(file => {

        return (
                <div key={file._id} className="file" onclick="">
                    <img src="/assets/img/placeholder.png" alt="placeholder" className="fileFace" />
                    <h3 className="fileName">Name: {file.name} </h3>
                    <h3 className="fileYear"> Year: {file.year} </h3>
                    <h3 className="fileAuthor"> Author: {file.author} </h3>
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

const loadFileImageFromServer = async () => {
    const response = await fetch('/getImage');
    const data = await response.json();
    ReactDOM.render(
        
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