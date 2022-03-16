import "./styles.css"

export function Artist_Folder(props){
    const {
        artistName,
        artistPicture,
        artist_id
    } = props;
    
    return(
    <div>
    <div id={`${artist_id}`} className ="artist-grid-item">
        <div>
            <img id="picture" src={`${artistPicture}`} alt="artist picture"/>
        </div>
        <h4>{`${artistName}`}</h4>
    </div>
    </div>
    )
} 