import { useEffect, useState } from "react";

import {
  Settings as SettingsIcon,
  ShieldCheck,
  FolderLock,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Server,
  Database,
} from "lucide-react";

import api from "../../services/api";


function Settings() {
  const [folderPath, setFolderPath] = useState("");
  const [protectedFolders, setProtectedFolders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Load protected folders
  const loadProtectedFolders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/organizer/protected-folders"
      );

      const folders =
        response.data.protected_folders ||
        response.data.folders ||
        response.data.result ||
        [];

      setProtectedFolders(
        Array.isArray(folders) ? folders : []
      );

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to load protected folders."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadProtectedFolders();
  }, []);


  // Add protected folder
  const handleAddFolder = async () => {
    if (!folderPath.trim()) {
      setError("Please enter a folder path.");
      return;
    }

    try {
      setAdding(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/organizer/protected-folders",
        null,
        {
          params: {
            path: folderPath.trim(),
          },
        }
      );

      setSuccess(
        response.data.message ||
        "Protected folder added successfully."
      );

      setFolderPath("");

      await loadProtectedFolders();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to add protected folder."
      );

    } finally {
      setAdding(false);
    }
  };


  // Remove protected folder
  const handleRemoveFolder = async (path) => {
    try {
      setError("");
      setSuccess("");

      await api.delete(
        "/organizer/protected-folders",
        {
          params: {
            path: path,
          },
        }
      );

      setSuccess(
        "Protected folder removed successfully."
      );

      await loadProtectedFolders();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to remove protected folder."
      );
    }
  };


  return (
    <div className="space-y-8">


      {/* Header */}
      <div>

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-slate-800 p-3">

            <SettingsIcon
              size={26}
              className="text-slate-200"
            />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-white">
              Settings
            </h1>

            <p className="mt-1 text-slate-400">
              Manage application safety and preferences.
            </p>

          </div>

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


      {/* Protected Folders */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">


        {/* Section Header */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="rounded-xl bg-slate-800 p-3">

              <ShieldCheck
                size={22}
                className="text-emerald-400"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold text-white">
                Protected Folders
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Folders listed here cannot be organized by
                the application.
              </p>

            </div>

          </div>


          <button
            onClick={loadProtectedFolders}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
          >

            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>


        {/* Add Folder */}

        <div className="mt-6">

          <label className="mb-2 block text-sm font-medium text-slate-300">
            Add Protected Folder
          </label>


          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <FolderLock
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={folderPath}
                onChange={(event) =>
                  setFolderPath(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAddFolder();
                  }
                }}
                placeholder="C:\Users\YourName\Important"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-slate-500"
              />

            </div>


            <button
              onClick={handleAddFolder}
              disabled={adding}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Plus size={18} />

              {adding
                ? "Adding..."
                : "Add Protected Folder"}

            </button>

          </div>


          <p className="mt-2 text-xs text-slate-500">
            Example: C:\Users\YourName\Documents
          </p>

        </div>


        {/* Protected Folder List */}

        <div className="mt-8">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h3 className="text-md font-semibold text-white">
                Protected Folder List
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {protectedFolders.length} protected folder
                {protectedFolders.length !== 1 ? "s" : ""}
              </p>

            </div>

          </div>


          {/* Loading */}

          {loading && (

            <div className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-10 text-center">

              <p className="text-sm text-slate-500">
                Loading protected folders...
              </p>

            </div>

          )}


          {/* Folder List */}

          {!loading && protectedFolders.length > 0 && (

            <div className="space-y-3">

              {protectedFolders.map((folder, index) => (

                <div
                  key={`${folder}-${index}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 px-5 py-4 transition hover:bg-slate-800/40"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="rounded-lg bg-slate-800 p-2.5">

                      <FolderLock
                        size={19}
                        className="text-slate-400"
                      />

                    </div>


                    <div className="min-w-0">

                      <p className="truncate text-sm text-slate-200">
                        {folder}
                      </p>

                      <p className="mt-1 text-xs text-emerald-400">
                        Protected
                      </p>

                    </div>

                  </div>


                  <button
                    onClick={() =>
                      handleRemoveFolder(folder)
                    }
                    className="shrink-0 rounded-lg border border-red-900/60 bg-red-950/30 p-2.5 text-red-400 transition hover:bg-red-950/60 hover:text-red-300"
                    title="Remove protected folder"
                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              ))}

            </div>

          )}


          {/* Empty */}

          {!loading && protectedFolders.length === 0 && (

            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950 px-5 py-12 text-center">

              <ShieldCheck
                size={38}
                className="mx-auto text-slate-600"
              />

              <h3 className="mt-4 text-lg font-semibold text-slate-300">
                No custom protected folders
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Add a folder above to prevent the organizer
                from modifying its files.
              </p>

            </div>

          )}

        </div>

      </div>


      {/* Safety Information */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex items-start gap-3">

          <div className="rounded-xl bg-slate-800 p-3">

            <ShieldCheck
              size={22}
              className="text-slate-300"
            />

          </div>

          <div>

            <h2 className="text-lg font-semibold text-white">
              Safety Protection
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Smart File Organizer prevents accidental
              modification of protected system locations.
            </p>

          </div>

        </div>


        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl bg-slate-800 p-4">

            <ShieldCheck
              size={20}
              className="text-emerald-400"
            />

            <h3 className="mt-3 text-sm font-semibold text-white">
              Protected Paths
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Protected folders are checked before
              organization.
            </p>

          </div>


          <div className="rounded-xl bg-slate-800 p-4">

            <FolderLock
              size={20}
              className="text-sky-400"
            />

            <h3 className="mt-3 text-sm font-semibold text-white">
              Safe Operations
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Protected locations cannot be organized
              accidentally.
            </p>

          </div>


          <div className="rounded-xl bg-slate-800 p-4">

            <CheckCircle2
              size={20}
              className="text-violet-400"
            />

            <h3 className="mt-3 text-sm font-semibold text-white">
              Database Stored
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Custom protected folders are stored in
              SQLite.
            </p>

          </div>

        </div>

      </div>


      {/* System Information */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h2 className="text-lg font-semibold text-white">
          System Information
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Current application configuration.
        </p>


        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">


          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

            <Server
              size={22}
              className="text-sky-400"
            />

            <p className="mt-3 text-xs text-slate-500">
              Backend
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              FastAPI
            </p>

            <p className="mt-1 text-xs text-emerald-400">
              API configured
            </p>

          </div>


          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

            <Database
              size={22}
              className="text-violet-400"
            />

            <p className="mt-3 text-xs text-slate-500">
              Database
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              SQLite + SQLAlchemy
            </p>

            <p className="mt-1 text-xs text-emerald-400">
              Database configured
            </p>

          </div>


          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

            <SettingsIcon
              size={22}
              className="text-slate-400"
            />

            <p className="mt-3 text-xs text-slate-500">
              Application
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              Smart File Organizer
            </p>

            <p className="mt-1 text-xs text-emerald-400">
              System ready
            </p>

          </div>


        </div>

      </div>


    </div>
  );
}


export default Settings;