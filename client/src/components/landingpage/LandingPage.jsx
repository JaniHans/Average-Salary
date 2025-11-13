import React, {useEffect, useState} from 'react';
import './landingpage.css';

function LandingPage() {

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [responseStatus, setResponseStatus] = useState(0);


    const loadServerMessage = async () => {

        if (isError) {
            setIsError(false);
        }

            setIsLoading(true)
            setTimeout(async () => {
                setIsLoading(false);
                try {
                    const response = await fetch("http://localhost:3001/api");
                    console.log(response)
                    if (!response.ok) {
                        console.log(response)
                        throw new Error(`Response status : 
                ${setResponseStatus(response.status)}`);
                    }
                    const result = await response.json();
                    setMessage(result.data)

                } catch (error) {
                    console.log(error)
                    setIsError(true)
                    setTimeout(() => {
                        setErrorMessage(error.message)
                    }, 2)
                }
            }, 1000)

    }

    return (
        <div>
            <h1>Äripäeva palgaturu analüüs</h1>
            <button onClick={loadServerMessage}>Load Server</button>
            {isLoading ? <p className="loading">Loading...</p> : null}
            <div>{isError ? <p className="error">Status code : {responseStatus} - {errorMessage}</p> : message}</div>
        </div>

    );
}

export default LandingPage;