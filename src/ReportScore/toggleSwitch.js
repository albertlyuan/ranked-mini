import "./toggleSwitch.css";

function ToggleSwitch({label, puller, setPuller}){

    function handleChange(){
        setPuller(!puller)
    }

    return (
        <div className="toggle-switch">
            <p>{label}</p>
            <input 
                type="checkbox" 
                id="checkbox-input" 
                checked={puller}
                onChange={handleChange}
                style={{display: "none"}}
                />
            <label 
                className="round-slider-container" 
                htmlFor={"checkbox-input"}>
                <div></div>
                <div></div>
                <div className="round-slider"></div>
            </label> 
        </div>
      );
}

export default ToggleSwitch;