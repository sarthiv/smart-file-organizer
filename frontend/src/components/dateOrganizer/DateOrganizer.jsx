import { useState } from "react";
import {
  CalendarDays,
  FolderOpen,
  Search,
  FileText,
  Image,
  Music,
  Video,
  Code,
  Archive,
  File,
  Play,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  getDatePreview,
  organizeByDate,
} from "../../services/api";

function DateOrganizer() {
  const [folderPath, setFolderPath] = useState("");
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewChecked, setPreviewChecked] = useState(false);

  const handlePreview = async () => {
    if (!folderPath.trim()) {
      setError("Please enter a folder path.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setPreview([]);
    setPreviewChecked(false);

    try {
      const data = await getDatePreview(folderPath);

      setPreview(data.preview || []);
      setPreviewChecked(true);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Could not create date organization preview."
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
      const data = await organizeByDate(folderPath);

      setSuccess(
        data.message ||
        "Files organized by date successfully."
      );

      setPreview([]);
      setPreviewChecked(false);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Could not organize files by date."
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

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-slate-800 p-3">
            <CalendarDays
              size={26}
              className="text-slate-200"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Date Organizer
            </h1>

            <p className="mt-1 text-slate-400">
              Organize files using their modification date.
            </p>
          </div>

        </div>
      </div>

      {/* Folder Selection */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

        <h2 className="text-lg font-semibold text-white">
          Select Folder
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Preview how your files will be organized by year and month.
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
                  handlePreview();
                }
              }}
              placeholder="C:\Users\YourName\Downloads"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-slate-500"
            />

          </div>

          <button
            onClick={handlePreview}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search size={18} />

            {loading
              ? "Loading..."
              : "Preview Organization"}
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

      {/* Preview */}
      {previewChecked && preview.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-16 text-center">

          <CheckCircle2
            size={42}
            className="mx-auto text-emerald-500"
          />

          <h2 className="mt-4 text-lg font-semibold text-slate-300">
            No files to organize
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No files were found in the selected folder.
          </p>

        </div>
      )}

      {preview.length > 0 && (
        <>
          {/* Summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Organization Preview
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Review the destination before moving files.
                </p>
              </div>

              <span className="w-fit rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300">
                {preview.length} files
              </span>

            </div>

          </div>

          {/* Preview Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <div className="max-h-[500px] overflow-auto">

              <table className="w-full text-left">

                <thead className="sticky top-0 bg-slate-950">
                  <tr>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      File
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Destination
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">

                  {preview.map((file, index) => {
                    const Icon = getCategoryIcon(
                      file.category
                    );

                    return (
                      <tr
                        key={`${file.source}-${index}`}
                        className="transition hover:bg-slate-800/40"
                      >

                        <td className="max-w-[280px] px-6 py-4">

                          <div className="flex items-center gap-3">

                            <Icon
                              size={18}
                              className="shrink-0 text-slate-400"
                            />

                            <span className="truncate text-sm text-slate-300">
                              {file.name}
                            </span>

                          </div>

                        </td>

                        <td className="px-6 py-4">

                          <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
                            {file.category}
                          </span>

                        </td>

                        <td className="max-w-[420px] px-6 py-4">

                          <p className="break-all text-sm text-slate-500">
                            {file.destination}
                          </p>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>

          {/* Action */}
          <button
            onClick={handleOrganize}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Play size={18} />

            {loading
              ? "Organizing..."
              : "Organize by Date"}

          </button>
        </>
      )}

    </div>
  );
}

export default DateOrganizer;