import { useState } from "react";
import {
  Copy,
  FolderOpen,
  Search,
  FileText,
  Move,
  CheckCircle2,
  AlertCircle,
  Hash,
} from "lucide-react";

import {
  getDuplicatePreview,
  moveDuplicate,
} from "../../services/api";

function Duplicates() {
  const [folderPath, setFolderPath] = useState("");
  const [duplicateGroups, setDuplicateGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checked, setChecked] = useState(false);

  const handleScan = async () => {
    if (!folderPath.trim()) {
      setError("Please enter a folder path.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setChecked(false);
    setDuplicateGroups([]);

    try {
      const data = await getDuplicatePreview(folderPath);

      const preview =
        data.preview ||
        data.duplicates ||
        [];

      setDuplicateGroups(preview);
      setChecked(true);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Could not check for duplicate files."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (filePath) => {
    setMoving(filePath);
    setError("");
    setSuccess("");

    try {
      const data = await moveDuplicate(filePath);

      setSuccess(
        data.message ||
        "Duplicate file moved successfully."
      );

      // Remove moved duplicate from current UI
      setDuplicateGroups((currentGroups) =>
        currentGroups
          .map((group) => {
            if (group.duplicate !== filePath) {
              return group;
            }

            return null;
          })
          .filter(Boolean)
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Could not move duplicate file."
      );
    } finally {
      setMoving("");
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-slate-800 p-3">
            <Copy
              size={26}
              className="text-slate-200"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Duplicate Files
            </h1>

            <p className="mt-1 text-slate-400">
              Find identical files and safely move duplicates.
            </p>
          </div>

        </div>
      </div>

      {/* Folder Selection */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

        <h2 className="text-lg font-semibold text-white">
          Find Duplicates
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Enter the folder you want to check for duplicate files.
        </p>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row">

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

            {loading
              ? "Checking..."
              : "Find Duplicates"}
          </button>

        </div>
      </div>

      {/* Error */}
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

      {/* Success */}
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

      {/* No Duplicates */}
      {checked && duplicateGroups.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-16 text-center">

          <CheckCircle2
            size={42}
            className="mx-auto text-emerald-500"
          />

          <h2 className="mt-4 text-lg font-semibold text-slate-300">
            No duplicate files found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            All files in the selected folder appear to be unique.
          </p>

        </div>
      )}

      {/* Duplicate Groups */}
      {duplicateGroups.length > 0 && (
        <div className="space-y-5">

          <div>
            <h2 className="text-xl font-semibold text-white">
              Duplicate Groups
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Review identical files before moving duplicates.
            </p>
          </div>

          {duplicateGroups.map((group, index) => (
            <div
              key={`${group.duplicate}-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
            >

              {/* Group Header */}
              <div className="border-b border-slate-800 px-6 py-5">

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-slate-800 p-2">
                      <Copy
                        size={20}
                        className="text-slate-300"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        Duplicate Group {index + 1}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Identical file detected
                      </p>
                    </div>

                  </div>

                  <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-400">
                    SHA-256 Match
                  </span>

                </div>

                {group.hash && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-950 p-3">

                    <Hash
                      size={16}
                      className="mt-0.5 shrink-0 text-slate-500"
                    />

                    <p className="break-all text-xs text-slate-500">
                      {group.hash}
                    </p>

                  </div>
                )}

              </div>

              {/* Original */}
              <div className="border-b border-slate-800 px-6 py-5">

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Original File
                </p>

                <div className="flex items-start gap-3">

                  <FileText
                    size={20}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <p className="break-all text-sm text-slate-300">
                    {group.original}
                  </p>

                </div>

              </div>

              {/* Duplicate */}
              <div className="px-6 py-5">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div className="min-w-0 flex-1">

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Duplicate File
                    </p>

                    <div className="flex items-start gap-3">

                      <Copy
                        size={20}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <p className="break-all text-sm text-slate-300">
                        {group.duplicate}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      handleMove(group.duplicate)
                    }
                    disabled={moving === group.duplicate}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <Move size={18} />

                    {moving === group.duplicate
                      ? "Moving..."
                      : "Move Duplicate"}

                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Duplicates;