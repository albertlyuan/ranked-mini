export function PageSelector({pageNum, setPageNum, nextPageExists}){
    function nextPage(){
        setPageNum(pageNum+1)
    }
    function prevPage(){
        setPageNum(pageNum-1)
    }
    return (
        <div class="horizontal">
            <a class="clickable highlights arrowbutton" style={{display: pageNum > 0 ? "block" : "none"}} onClick={prevPage}>
                &lt;
            </a>
            <div>
                <h3>Current Page: {pageNum}</h3>
            </div> 
            <a class="clickable highlights arrowbutton" style={{display: nextPageExists ? "block" : "none"}} onClick={nextPage}>
                &gt;
            </a>
        </div>
    )
}