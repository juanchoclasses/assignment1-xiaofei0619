/** 
 * This is the class for the front end to prepare the fetch
 * requests to the server for the file selection
 * 
 * it is used by FileSelection.tsx
 * 
 */

import { PortsGlobal } from '../PortsGlobal';

class FileSelectionClient {
    private _serverPort: number = PortsGlobal.serverPort;
    private _baseURL: string = `http://localhost:${this._serverPort}`;
    private _documentNames: string[];
    private _callback?: (documentNames: string[]) => void;
    private _isFetching: boolean = false;

    constructor() {
        this._documentNames = [];
        // fetch all the document names from the server
        this.getDocumentNames();
        // set the timed fetch every 0.1 sec
        setInterval(this._timedFetch.bind(this), 100);
    }

    /**
     * 
     * this is the getter function for document names
     * 
     * @returns current list of document names
     */
    public getNames(): string[] {
        if (this._documentNames) {
            return this._documentNames;
        }
        return [];
    }

    /**
     * 
     * @param callback call back function provided by FileSelection
     * 
     * make sure any new document names that other users just create
     * are updated in the front end without reloading
     */
    public setCallback(callback: (documentNames: string[]) => void) {
        this._callback = callback;
    }

    /**
     * get all the document names from the server
     * 
     * this is client side so we use fetch
     */
    public async getDocumentNames() {
        try {
            const fetchURL = `${this._baseURL}/documents`;
            const response = await fetch(fetchURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const documentNames = await (response.json() as Promise<string[]>);
            this._updateDocumentNames(documentNames); 
        } catch (error) {
            console.error("Error fetching document names: ", error);
        }
    }

    /**
     * 
     * @param documentNames an updated list of document names
     * 
     * if callback function has been received from FileSelection, send
     * the latest document names over
     */
    private _updateDocumentNames(documentNames: string[]): void {
        this._documentNames = documentNames;
        // There is a race condition, make sure callback function exists
        if (this._callback !== undefined) {
            this._callback(documentNames)
        }
    }

    /**
     * Every .1 seconds, fetch the document names from the server
     */
    private async _timedFetch() {
        if (this._isFetching) {
            // Fetch already in progress, skip this interval and wait for the next one
            return;
        }
        try {
            this._isFetching = true;

            const fetchURL = `${this._baseURL}/documents`;
            const response = await fetch(fetchURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const documentNames = await (response.json() as Promise<string[]>);
            this._updateDocumentNames(documentNames); 
        } catch (error) {
            console.error("Error fetching document names: ", error);
        } finally {
            // reset the fetching flag after this operation completes
            this._isFetching = false;
        }
    }
}

export default FileSelectionClient;
