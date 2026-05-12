import React, { useState } from 'react';
import { useFolders } from './Folders';

const Scripts = ({ scripts }) => {
  const { folders, moveScript } = useFolders();
  const [draggedScript, setDraggedScript] = useState(null);

  const handleDragStart = (script) => {
    setDraggedScript(script);
  };

  const handleDrop = (folderId) => {
    if (draggedScript) {
      moveScript(draggedScript.id, folderId);
      setDraggedScript(null);
    }
  };

  return (
    <div>
      {scripts.map((script) => (
        <div
          key={script.id}
          draggable
          onDragStart={() => handleDragStart(script)}
          className="script-item"
        >
          {script.name}
        </div>
      ))}
      <div className="folders">
        {folders.map((folder) => (
          <div
            key={folder.id}
            onDrop={() => handleDrop(folder.id)}
            onDragOver={(e) => e.preventDefault()}
            className="folder-item"
          >
            {folder.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scripts;