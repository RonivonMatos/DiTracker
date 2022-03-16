import "./styles.css"

export function Album_Folder(props){
    const {
        artistName,
        albumName,
        albumCover,
        album_id
    } = props; 
      
    return(
    <div>
    <div id={`${album_id}`} className ="album-grid-item">
        <div>
            <img id = "cover" src={`${albumCover}`} alt="album cover"/>
        </div>
        <div>
            <h4>{`${albumName}`}</h4>
            <div id="separator-line"></div>
            <div id="artist-info">
                <div id="album-artist">
                    <p>{`${artistName}`}</p>
                </div>
            </div>
        </div>
    </div>
    
    </div>
    )
}