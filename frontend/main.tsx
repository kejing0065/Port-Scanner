import React from 'react';
import ReactDOM from 'react-dom/client';
import { useScanner } from './logic';
// @ts-ignore
import './src/Scanner.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Scanner />
    </React.StrictMode>
)

function Scanner() {
    const { result, loading, startScan } = useScanner();

    let empty = "";
    if (result.length == 0) {
        if (loading == false) {
            empty = "No open ports found.";
        }
    }

    const displayList = [];
    for (let i = 0; i < result.length; i++){
        const port = result[i];
        displayList.push(
            <div key={port} className="port-item">
                Port { port } is open.
            </div>
        );
    }


    const buttonText = () => {
        if (loading == true) {
        return  "Scanning...";    
        } else {
            return "Start Scan";
        }
    }
    


    return (
        <div className="scanner-container">
            <h1 className="title">Port Scanner</h1>
            <p className="description">This is a port scanner tools. Please do not use it as illegal activities.</p>

            <div className="input-container">
                <input id="ip" className="input-field" placeholder="Enter IP address"/>
                <input id="start_port" className="input-field" placeholder="Start Port" type="number"/>
                <input id="end_port" className="input-field" placeholder="End Port" type="number"/>
            </div>
            

            {/* <button onClick={() => startScan((document.getElementById('ip') as HTMLInputElement)?.value, (document.getElementById('start_port') as HTMLInputElement)?.valueAsNumber, (document.getElementById('end_port') as HTMLInputElement)?.valueAsNumber)}>
                { buttonText() }
            </button> */}

            <button
                className="scan-button"
                onClick={() => {
                    const target = (document.getElementById('ip') as HTMLInputElement)?.value;
                    const start_port = (document.getElementById('start_port') as HTMLInputElement)?.valueAsNumber;
                    const end_port = (document.getElementById('end_port') as HTMLInputElement)?.valueAsNumber;

                    if (target && start_port && end_port) {
                        startScan(target, start_port, end_port);
                    } else {
                        alert("Please fill in all fields.");
                    }
                }}
            >
                { buttonText() }
            </button>

            <div className="results-section">
                <h3>Port Scan Results</h3>

                <div className="results-container">
                    {empty || <div className="result-container">{displayList}</div>}
                </div>
            </div>
                
        </div>
    );
}