import React, { useState, useEffect } from 'react';

const WebTabsApp = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  // Load from Browser LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('delta_tabs_library');
    if (saved) setSongs(JSON.parse(saved));
  }, []);

  const saveToDisk = (newList) => {
    localStorage.setItem('delta_tabs_library', JSON.stringify(newList));
    setSongs(newList);
  };

  const createNewSong = () => {
    const newSong = {
      id: Date.now().toString(),
      title: "New Song",
      lyrics: "",
      tracks: [{ id: '1', name: 'Guitar', strings: 6, tabs: Array(6).fill("") }]
    };
    const newList = [...songs, newSong];
    saveToDisk(newList);
    setCurrentSong(newSong);
  };

  const updateCurrentSong = (updated) => {
    setCurrentSong(updated);
    const newList = songs.map(s => s.id === updated.id ? updated : s);
    saveToDisk(newList);
  };

  const addTrack = (strings, name) => {
    const newTrack = { id: Date.now().toString(), name, strings, tabs: Array(strings).fill("") };
    const updatedSong = { ...currentSong, tracks: [...currentSong.tracks, newTrack] };
    updateCurrentSong(updatedSong);
  };

  // --- UI RENDER: LIBRARY VIEW ---
  if (!currentSong) {
    return (
      <div style={styles.webContainer}>
        <header style={styles.header}>
          <h1>DeltaTabs <span style={{fontSize: '0.5em', color: '#1DB954'}}>Web</span></h1>
          <button onClick={createNewSong} style={styles.mainBtn}>+ New Song</button>
        </header>
        <div style={styles.grid}>
          {songs.map(song => (
            <div key={song.id} style={styles.card} onClick={() => setCurrentSong(song)}>
              <h3>{song.title}</h3>
              <p>{song.tracks.length} Instrument Tracks</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- UI RENDER: EDITOR VIEW ---
  return (
    <div style={styles.webContainer}>
      <button onClick={() => setCurrentSong(null)} style={styles.backBtn}>← Back to Library</button>
      
      <input 
        style={styles.titleInput} 
        value={currentSong.title} 
        onChange={(e) => updateCurrentSong({...currentSong, title: e.target.value})} 
      />

      <div style={styles.editorLayout}>
        <div style={styles.lyricsCol}>
          <label style={styles.label}>Lyrics & Chords</label>
          <textarea 
            style={styles.textarea}
            value={currentSong.lyrics}
            onChange={(e) => updateCurrentSong({...currentSong, lyrics: e.target.value})}
            placeholder="[G] Write lyrics here..."
          />
        </div>

        <div style={styles.tabsCol}>
          {currentSong.tracks.map((track, tIdx) => (
            <div key={track.id} style={styles.trackBox}>
              <h4>{track.name} ({track.strings} Strings)</h4>
              {track.tabs.map((line, sIdx) => (
                <div key={sIdx} style={styles.tabLine}>
                  <span style={styles.monoLabel}>S{sIdx+1}|</span>
                  <input 
                    style={styles.monoInput}
                    value={line}
                    onChange={(e) => {
                      const newTracks = [...currentSong.tracks];
                      newTracks[tIdx].tabs[sIdx] = e.target.value;
                      updateCurrentSong({...currentSong, tracks: newTracks});
                    }}
                    placeholder="---------------------------------"
                  />
                </div>
              ))}
            </div>
          ))}

          <div style={styles.adder}>
            <button onClick={() => addTrack(6, "Guitar")} style={styles.smallBtn}>+ 6-Str</button>
            <button onClick={() => addTrack(4, "Bass")} style={styles.smallBtn}>+ 4-Str</button>
            <button onClick={() => addTrack(3, "Cigar Box")} style={styles.smallBtn}>+ 3-Str</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  webContainer: { padding: '40px', backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1c1c1e', padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333' },
  mainBtn: { backgroundColor: '#1DB954', border: 'none', padding: '12px 24px', borderRadius: '25px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' },
  editorLayout: { display: 'flex', gap: '40px', marginTop: '20px' },
  lyricsCol: { flex: 1 },
  tabsCol: { flex: 2 },
  textarea: { width: '100%', height: '400px', backgroundColor: '#1c1c1e', color: '#fff', padding: '15px', borderRadius: '8px', border: 'none', fontSize: '16px' },
  trackBox: { backgroundColor: '#111', padding: '20px', borderRadius: '10px', marginBottom: '20px', borderLeft: '4px solid #1DB954' },
  tabLine: { display: 'flex', alignItems: 'center', marginBottom: '5px' },
  monoLabel: { fontFamily: 'monospace', width: '40px', color: '#666' },
  monoInput: { flex: 1, fontFamily: 'monospace', backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '18px', letterSpacing: '2px', outline: 'none' },
  titleInput: { backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '32px', fontWeight: 'bold', width: '100%', marginBottom: '20px', outline: 'none' },
  label: { display: 'block', marginBottom: '10px', color: '#1DB954', fontWeight: 'bold' },
  backBtn: { background: 'none', border: 'none', color: '#1DB954', cursor: 'pointer', marginBottom: '20px', fontSize: '16px' },
  smallBtn: { backgroundColor: '#333', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', marginRight: '10px', cursor: 'pointer' }
};

export default WebTabsApp;