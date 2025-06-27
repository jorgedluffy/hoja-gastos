import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color'
import './ColorPicker.css';

const ColorPicker = ({ onChange = () => { }, onOpen = () => { }, onClose = () => { } }) => {
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [color, setColor] = useState('#000');


    const handleClick = () => {
        if (displayColorPicker) {
            onClose();
        } else {
            onOpen();
        }
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false)
        if (onClose) {
            onClose();
        }
    };

    const handleChange = (color) => {
        setColor(color.hex);
        if (onChange) {
            onChange(color.hex);
        }
    };

    const handleKeyUp = (event) => {
        if (event.key === 'Escape') {
            setDisplayColorPicker(false);
            if (onClose) {
                onClose();
            }
        }
    }

    useEffect(() => {
        const listener = (event) => handleKeyUp(event);
        document.addEventListener('keyup', listener);
        return () => {
            document.removeEventListener('keyup', listener);
        };
    }, []);

    return (
        <div >
            <div className="color-selector" style={{ background: color }} onClick={handleClick} />
            {displayColorPicker ? <div className="popover">
                <div className="cover" onClick={handleClose} />
                <SketchPicker color={color} onChange={handleChange} />
            </div> : null}



        </div>
    )

}

export default ColorPicker