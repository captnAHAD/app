import React, { useEffect, useState } from "react";
import Pview from '../components/Pview';
import * as QueryString from "query-string";

function Project(props){
    const params = QueryString.parse(props.location.search);
    const [data, setData] = useState([]);
    const fetchApi = async () => {
        await fetch('http://localhost:5000/api/projects/' + params.pid, {
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
            <Pview project = {data} />
        </div>
    )
}

export default Project;