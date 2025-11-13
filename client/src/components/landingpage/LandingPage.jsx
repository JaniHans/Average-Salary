import React, {useEffect, useState} from 'react';

function LandingPage() {

    const [message, setMessage] = useState(null);

    useEffect(() => {

        fetch("/api")
            .then((res) => res.json())
            .then((data) => setMessage(data))
    }, []);

    return (
        <div>
            <h1>Welcome to the landing page</h1>
            <p>{!message ? "Loading..." : message}</p>
        </div>

    );
}

export default LandingPage;