import React, { useState } from "react";
import FileSelectionClient from "../Engine/FileSelectionClient";
import FileSelectionButton from "./FileSelectionButton";
import './FileSelection.css';

// create the client that talks to the backend
const fileSelectionClient = new FileSelectionClient();

function FileSelection() {
    const [documentNames, setDocumentNames] = useState<string[]>(fileSelectionClient.getNames());
    const [newDocName, setNewDocName] = useState<string>("");

    // Pass the callback function to the FileSelectionClient
    fileSelectionClient.setCallback((documentNames) => {
        setDocumentNames(documentNames);
    })
    
    // Button callback function
    function createNewSpreadSheet() {
        if (newDocName === "") {
            alert("Please enter a name for the new spread sheet!");
            return;
        } else if (documentNames.includes(newDocName)) {
            alert("This spread sheet alreay exists! Try another name.");
            return;
        } else {
            window.location.href = newDocName;
            // clear the newDocName state
            setNewDocName("");
        }
    }

    return (
        <div className="background">
            <p className="selectp">
                Please select the calculator spreadsheet from the list
            </p>

            <table className="selectTable">
                <tbody>
                    {documentNames.map((documentName, index) => (
                        <tr key={index}>
                            <td className="selecttd">
                                <a 
                                    href={`${documentName}`}
                                    className="selectLink"
                                >
                                    {documentName}
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="selectp">
                Want to create a new spread sheet? Enter the name and press CREAT button
            </p>
            <input
                type="text"
                placeholder="New Document Name"
                defaultValue={newDocName}
                className="selectinput"
                onChange={(event) => {
                    // get the text from the input
                    let newDocName = event.target.value;
                    setNewDocName(newDocName);
                }} />
            <FileSelectionButton onButtonClicked={createNewSpreadSheet} />
        </div>
    )
};

export default FileSelection;
