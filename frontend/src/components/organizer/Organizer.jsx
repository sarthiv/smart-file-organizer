import { useState } from "react";
import {
  FolderOpen,
  Search,
  FileText,
  Image,
  Music,
  Video,
  Code,
  Archive,
  File,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Play,
} from "lucide-react";

import {
  scanFolder,
  organizeFolder,
  undoLastAction,
} from "../../services/api";

function Organizer() {
  const [folderPath, setFolderPath] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleScan = async () => {
    if (!folderPath.trim()) {
      setError("Please enter a folder path.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setFiles([]);

    try {
      const data = await scanFolder(folderPath);

      setFiles(data.files || []);

      if (!data.files || data.files.length === 0) {
        setSuccess("Folder scanned successfully. No files found.");
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Could not scan the folder."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOrganize = async () => {
    if (!folderPath.trim()) {
      setError("Please enter a folder path.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await organizeFolder(folderPath);

      setSuccess(
        data.message ||
        "Files organized successfully."
      );

      // Refresh file list after organization
      const refreshed = await scanFolder(folderPath);
      setFiles(refreshed.files || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Could not organize the folder."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await undoLastAction();

      setSuccess(
        `Last action undone successfully. Restored: ${data.result.source}`
      );

      const refreshed = await scanFolder(folderPath);
      setFiles(refreshed.files || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Could not undo the last action."
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Documents":
        return FileText;

      case "Images":
        return Image;

      case "Music":
        return Music;

      case "Videos":
        return Video;

      case "Code":
        return Code;

      case "Archives":
        return Archive;

      default:
        return File;
    }
  };

  const categoryCounts = files.reduce(
    (counts, file) => {
      const category = file.category || "Others";

      counts[category] =
        (counts[category] || 0) + 1;

      return counts;
    },
    {}
  );

  const categories = Object.entries(categoryCounts);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-800 p-3">
            <FolderOpen
              size={26}
              className="text-slate-200"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              File Organizer
            </h1>

            <p className="mt-1 text-slate-400">
              Scan, organize and manage your files safely.
            </p>
          </div>
        </div>
      </div>

      {/* Folder Input */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">
            Select Folder
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Enter the path of the folder you want to organize.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">
            <FolderOpen
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={folderPath}
              onChange={(event) =>
                setFolderPath(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleScan();
                }
              }}
              placeholder="C:\Users\YourName\Downloads"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-slate-500"
            />
          </div>

          <button
            onClick={handleScan}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search size={18} />

            {loading ? "Scanning..." : "Scan Folder"}
          </button>

        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-900/60 bg-red-950/30 p-4">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-400"
          />

          <p className="text-sm text-red-300">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-4">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-emerald-400"
          />

          <p className="text-sm text-emerald-300">
            {success}
          </p>
        </div>
      )}

      {/* File Statistics */}
      {files.length > 0 && (
        <>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Scan Results
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {files.length} files found in the selected folder.
                </p>
              </div>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">

              {categories.map(([category, count]) => {
                const Icon = getCategoryIcon(category);

                return (
                  <div
                    key={category}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <Icon
                        size={20}
                        className="text-slate-400"
                      />

                      <span className="text-xl font-bold text-white">
                        {count}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                      {category}
                    </p>
                  </div>
                );
              })}

            </div>
          </div>

          {/* File List */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Files
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Preview how your files are classified.
                </p>
              </div>

              <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300">
                {files.length} files
              </span>
            </div>

            <div className="max-h-[420px] overflow-auto">

              <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-950">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      File Name
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Extension
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Size
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">

                  {files.map((file) => {
                    const Icon = getCategoryIcon(
                      file.category
                    );

                    return (
                      <tr
                        key={file.path}
                        className="transition hover:bg-slate-800/40"
                      >
                        <td className="max-w-[320px] px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Icon
                              size={18}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="truncate text-sm text-slate-200">
                              {file.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                            {file.extension || "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-300">
                            {file.category}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-400">
                          {formatFileSize(file.size)}
                        </td>
                      </tr>
                    );
                  })}

                </tbody>
              </table>

            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              onClick={handleOrganize}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play size={18} />

              {loading
                ? "Organizing..."
                : "Organize Files"}
            </button>

            <button
              onClick={handleUndo}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw size={18} />

              Undo Last Action
            </button>

          </div>
        </>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        files.length === 0 &&
        !success && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-16 text-center">

            <FolderOpen
              size={42}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-4 text-lg font-semibold text-slate-300">
              No folder scanned
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Enter a folder path above and click
              "Scan Folder" to start organizing your files.
            </p>

          </div>
        )}

    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const size =
    bytes / Math.pow(1024, index);

  return `${size.toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}

export default Organizer;