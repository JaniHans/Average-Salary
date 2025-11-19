
import './landingpage.css';
import {DEFAULT, ERROR, LOADING, requestState, SUCCESS} from "../types/response";
import {useState} from "react";
import { useNavigate} from 'react-router-dom';



function LandingPage() {

    const [currentState, setCurrentState] = useState<requestState>(DEFAULT)
    const navigate = useNavigate();

    if (currentState.status === 'success') {
        navigate("/analyzer")
    }

    const loadServerMessage = async () => {

        setCurrentState(LOADING)

        setTimeout(async () => {

            try {
                const response = await fetch("http://localhost:3001/api");
                console.log(response)
                if (!response.ok) {
                    console.log(response)
                }
                const result = await response.json();
                console.log(result)
                setCurrentState(SUCCESS(result.message + " redirecting..."))

            } catch (error) {
                console.log(error)
                setCurrentState(ERROR("Error loading the network"))
            }

        }, 3000)
    }
    if (currentState.status === 'success') {
        navigate("/analyzer")
    }

    return (
        <div className="main-container">
            <div className="main-container-items">
                <div className="text-container">
                    <h2>Welcome to Äripäev Analyzer</h2>
                    <span>
                        <h3>Average salaries in Estonia powered by Statistics Estonia and OpenAI</h3>
                        <button id="left-button" onClick={loadServerMessage}>GoTO</button>
                    </span>
                    {currentState.status === 'error' && <div className="error">{currentState.message}</div>}
                    {currentState.status === 'loading' && <div className="loading">{currentState.message}</div>}
                    {currentState.status === 'success' && <div className="loading">{currentState.message}</div>}
                </div>
            </div>
        </div>
    );
}

export default LandingPage;