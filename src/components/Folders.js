import React, { createContext, useContext, useState } from 'react';

const FoldersContext = createContext();

export const useFolders = () => {
  return useContext(FoldersContext);
};

const FoldersProvider = ({ children }) => {
  const [folders, setFolders] = useState([
    { id: '1', name: 'Folder 1' },
    { id: '2', name: 'Folder 2' },
  ]);

  const moveScript = (scriptId, folderId) => {
    // Logic to move the script to the new folder
    console.log(`Moving script ${scriptId} to folder ${folderId}`);
  };

  return (
    <FoldersContext.Provider value={{ folders, moveScript }}>
      {children}
    </FoldersContext.Provider>
  );
};

export default FoldersProvider;