import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom'
import Cam from '../../pages/Cam';
import "react-popupbox/dist/react-popupbox.css"
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import * as FormPost from '../FormPost.js'
import {usePosition} from '../usePosition';
import PropTypes from 'prop-types';
import './form-style.css'
import { LoadingSpinnerComponent } from './formSpinner.js'

function FormBio(params, watch, settings){
    const [submitted,  setSubmitted ] = useState(false)

    //  Code taken from component documentation at:  
    //  https://www.npmjs.com/package/react-popupbox
    //  https://fraina.github.io/react-popupbox/
    //
    //  Credit these site for significant portions of this code

    const {
        latitude,
        longitude,
    } = usePosition(watch, settings);

    const [date,      setDate     ] = useState("")
    const [time,      setTime     ] = useState("")
    const [title,     setName     ] = useState("")
    const [notes,     setNotes    ] = useState("")
    const [ph,        setPh       ] = useState("")
    const [depth,     setDepth    ] = useState("")
    const [waterTemp, setWaterTemp] = useState("")
    const [weather,   setWeather  ] = useState("")
    const [lat,       setLat      ] = useState("")
    const [long,      setLong     ] = useState("")

    useEffect(() => {
        setLat(latitude);
        setLong(longitude);
    }, [latitude, longitude]);

    const submitForm = (e, props) => {
        e.preventDefault()
        let newItem = {
            project_id:   params.id,
            date:         date + " " + time,
            title:        title,
            notes:        notes,
            measurements: {
                "pH":                    ph,
                "Depth (m)":             depth,
                "Water Temperature (F)": waterTemp,
                "Weather":               weather
            },
            latitude:  lat,
            longitude: long
        }

        // Expecting an image dataURI to be stored in localStorage
        var imgData
        if (window.localStorage.images) {
            imgData                     = JSON.parse(window.localStorage.images)[0]
            var s                       = imgData.split(',')[0]
            newItem.image               = [{}]
            newItem.image[0].file_type  = '.' + s.substring(s.lastIndexOf('/') + 1, s.lastIndexOf(';'))
            newItem.img_string          = imgData.split(',')[1]

            window.localStorage.removeItem("images")
        }

        FormPost.post(newItem)
        .then(() => {
            setSubmitted(true)
        })
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
            <LoadingSpinnerComponent />
            <h2>Enter a new observation below:</h2>
            <form onSubmit = {submitForm} >
                <input
                class="input"
                placeholder="Date"
                type="date"
                name={date}
                onChange={e => setDate(e.target.value)}
                required
                />
                <input
                class="input"
                placeholder="Time"
                type="time"
                step="1"
                name={time}
                onChange={e => setTime(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Title"
                type="text"
                maxlength="100"
                name={title}
                onChange={e => setName(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Notes"
                type="textbox"
                maxlength="1000"
                name={notes}
                onChange={e => setNotes(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="pH"
                type="number"
                min="0"
                max="14"
                step="0.01"
                name={ph}
                onChange={e => setPh(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Depth (m)"
                type="number"
                min="0"
                max="12000"
                name={depth}
                onChange={e => setDepth(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Water Temperature (F)"
                type="number"
                min="-459.67"
                max="1000"
                step="0.01"
                name={waterTemp}
                onChange={e => setWaterTemp(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Weather"
                type="textbox"
                maxlength="1000"
                name={weather}
                onChange={e => setWeather(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Latitude"
                type="text"
                name={latitude}
                defaultValue={lat}
                onChange={e => setLat(e.target.value)}
                required
                />
                <br />
                <input
                class="input"
                placeholder="Longitude"
                type="text"
                name={longitude}
                defaultValue={long}
                onChange={e => setLong(e.target.value)}
                required
                />
                <br />
                <button
                class="input"
                type="button"
                onClick={() => openPopupbox()}
                >Take Pic</button>
                <br /><br />
                <button type="submit">Submit</button>
            </form>
            <PopupboxContainer {...popupboxConfig } />
            {submitted && <Redirect to={'/observations?pid=' + params.id} />}
        </div>
    )
}

FormBio.propTypes = {
    watch: PropTypes.bool,
    settings: PropTypes.object,
};

export default FormBio
