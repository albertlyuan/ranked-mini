
export default function TabButton({children, isActive, onClick}){
    if (isActive) {
        return (
            <button 
                className="activetab"
                onClick={() => {
                    onClick();
                }}>
            {children}
            </button>
        );
    }

    return (
        <button 
            className="tab"
            onClick={() => {
                onClick();
            }}>
        {children}
        </button>
    );
}