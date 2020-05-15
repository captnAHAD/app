import React, { useEffect, useState } from "react";
import Pcards from '../components/Pcards.js';

function Projects(){
    const [data, setData] = useState([]);
    const fetchApi = async () => {
        await fetch('http://localhost:5000/api/projects', {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000"
            },
        })
        .then((r) => r.json())
        .then((response) => setData(response));
    };

    useEffect(() => {
        fetchApi();
    }, []);

    return (
        <div>
            <Pcards projects = {data} />
        </div>
    )
}

export default Projects;