/**
 * @jest-environment jsdom
 */

import { useState, useEffect } from 'react';
import './App.css';
import SpreadSheet from './Components/SpreadSheet';
function App() {


  const [documentName, setDocumentName] = useState(getDocumentNameFromWindow());

  useEffect(() => {
    // The complete URL of the current web page
    if (window.location.href) {
      setDocumentName(getDocumentNameFromWindow());
    }
  }, [getDocumentNameFromWindow]);



  // for the purposes of this demo and for the final project
  // we will use the window location to get the document name
  // this is not the best way to do this, but it is simple
  // and it works for the purposes of this demo
  // This function retrieves the document name from the window's URL
  function getDocumentNameFromWindow() {
    const href = window.location.href;

    // remove  the protocol 
    const protoEnd = href.indexOf('//');
    // find the beginning of the path by searching for the next '/' after the protocol
    const pathStart = href.indexOf('/', protoEnd + 2);

    if (pathStart < 0) {
      // there is no path
      return '';
    }
    // get the first part of the path
    const docEnd = href.indexOf('/', pathStart + 1);
    if (docEnd < 0) {
      // there is no other slash(http://example.com/document)
      return href.substring(pathStart + 1);
    }
    // there is a slash(http://example.com/document/other)
    return href.substring(pathStart + 1, docEnd);

  }

  //callback function to reset the current URL to have the document name
  function resetURL(documentName: string) {
    // get the current URL
    const currentURL = window.location.href;
    // remove anything after the last slash
    const index = currentURL.lastIndexOf('/');
    const newURL = currentURL.substring(0, index + 1) + documentName;
    // set the URL displayed in browser address bar without actually triggering a full page reload
    window.history.pushState({}, '', newURL);
    // now reload the page
    window.location.reload();
  }

  if (documentName === '') {
    setDocumentName('test');
    resetURL('test');
  }

  return (
    <div className="App">
      <header className="App-header">
        <SpreadSheet documentName={documentName} />
      </header>

    </div>
  );
}

export default App;


