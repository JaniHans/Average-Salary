import React from 'react';
import './topbar.css';
import {Link} from "react-router-dom";

function TopBar() {
    return (
        <div className="topbar">
            <Link to="/"><h1>Äripäev</h1></Link>
        </div>
    );
}

export default TopBar;