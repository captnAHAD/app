import React, { useState, useContext } from "react";
import Cam from '../../pages/Cam';
import "react-popupbox/dist/react-popupbox.css"
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';

function FormBio(params){

    const [date, setDate] = useState("")
    const [title, setName] = useState("")
    const [notes, setNotes] = useState("")
    const [genus, setGenus] = useState("")
    const [species, setSpecies] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")

    const submitForm = (e) => {
        e.preventDefault();
        console.log(params.id)
        console.log({date})
        console.log({title})
        console.log({notes})
        console.log({genus})
        console.log({species})
        console.log({latitude})
        console.log({longitude})
        console.log(JSON.parse(window.localStorage.images))
        localStorage.removeItem("images")
    }

    const popupboxConfig = {
        titleBar: {
          enable: true,
          text: 'Camera'
        },
        fadeIn: true,
        fadeInSpeed: 500
    }

    function openPopupbox(value) {
        const content = (
          <div>
            <Cam />
          </div>
        )
        PopupboxManager.open({ content })
    }

    return (
        <div>
            <h2>Biology Observation Form</h2>
            <form onSubmit = {submitForm} >
                <input
                placeholder="Date"
                type="datetime-local"
                name={date}
                onChange={e => setDate(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Title"
                type="text"
                name={title}
                onChange={e => setName(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Notes"
                type="textbox"
                name={notes}
                onChange={e => setNotes(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Genus"
                type="textbox"
                name={genus}
                onChange={e => setGenus(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Species"
                type="textbox"
                name={species}
                onChange={e => setSpecies(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Latitude"
                type="text"
                name={latitude}
                onChange={e => setLatitude(e.target.value)}
                required
                />
                <br />
                <input
                placeholder="Longitude"
                type="text"
                name={longitude}
                onChange={e => setLongitude(e.target.value)}
                required
                />
                <br />
                <button
                type="button"
                onClick={() => openPopupbox()}
                >Take Pic</button>
                <br /><br />
                <button type="submit">Submit</button>
            </form>
            <PopupboxContainer {...popupboxConfig } />
        </div>
    )
}

export default FormBio