/**
 * 
 * Button used in FileSelection to create a new spread sheet
 * 
 * New 1 button called CREATE that makes a call back to the parent FileSelection
 */

import React from 'react';

// Define a set of props that the button accepts
interface IProps {
    onButtonClicked: () => void;
}

// Create a functional component(FC) with type IProps using React.FC<IProps>
export const FileSelectionButton: React.FC<IProps> = ({ onButtonClicked }) => {
    return (
        <div>
            <button 
                onClick={() => onButtonClicked()}
                className='selectbutton'
            >
                CREATE
            </button>
        </div>
    );
}

export default FileSelectionButton;
