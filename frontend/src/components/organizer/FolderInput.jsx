import { useState } from "react";

function FolderInput({ onScan }) {
  const [path, setPath] = useState("");

  const handleScan = () => {
    if (!path.trim()) {
      return;
    }

    onScan(path);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter folder path"
        value={path}
        onChange={(event) => setPath(event.target.value)}
      />

      <button onClick={handleScan}>
        Scan Folder
      </button>
    </div>
  );
}

export default FolderInput;