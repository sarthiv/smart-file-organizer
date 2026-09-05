import { useEffect, useState } from "react";
import {
  ListFilter,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Tag,
} from "lucide-react";

import {
  addRule,
  getRules,
  deleteRule,
} from "../../services/api";


function RuleManager() {
  const [extension, setExtension] = useState("");
  const [category, setCategory] = useState("");

  const [rules, setRules] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingRules, setLoadingRules] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // Load existing rules
  const loadRules = async () => {
    try {
      setLoadingRules(true);
      setError("");

      const data = await getRules();

      setRules(data.rules || {});

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to load custom rules."
      );

    } finally {
      setLoadingRules(false);
    }
  };


  useEffect(() => {
    loadRules();
  }, []);


  // Add new rule
  const handleAddRule = async () => {
    if (!extension.trim()) {
      setError("Please enter a file extension.");
      return;
    }

    if (!category.trim()) {
      setError("Please enter a category.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await addRule(
        extension.trim(),
        category.trim()
      );

      setSuccess(
        data.message ||
        "Custom rule added successfully."
      );

      setExtension("");
      setCategory("");

      await loadRules();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to add custom rule."
      );

    } finally {
      setLoading(false);
    }
  };


  // Delete rule
  const handleDeleteRule = async (ruleExtension) => {
    try {
      setError("");
      setSuccess("");

      await deleteRule(ruleExtension);

      setSuccess(
        "Custom rule deleted successfully."
      );

      await loadRules();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to delete custom rule."
      );
    }
  };


  const ruleEntries = Object.entries(rules);


  return (
    <div className="space-y-8">


      {/* Header */}
      <div>

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-slate-800 p-3">

            <ListFilter
              size={26}
              className="text-slate-200"
            />

          </div>

          <div>

            <h1 className="text-3xl font-bold text-white">
              Custom Rules
            </h1>

            <p className="mt-1 text-slate-400">
              Create custom file organization rules.
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


      {/* Add Rule */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

        <div className="mb-5">

          <h2 className="text-lg font-semibold text-white">
            Add New Rule
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Tell the organizer where a specific file type
            should be placed.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


          {/* Extension */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              File Extension
            </label>

            <div className="relative">

              <Tag
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={extension}
                onChange={(event) =>
                  setExtension(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAddRule();
                  }
                }}
                placeholder=".csv"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-slate-500"
              />

            </div>

            <p className="mt-2 text-xs text-slate-500">
              Example: .csv, .json, .log
            </p>

          </div>


          {/* Category */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Destination Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleAddRule();
                }
              }}
              placeholder="Data"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-slate-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Example: Data, Projects, Documents
            </p>

          </div>

        </div>


        {/* Add Button */}

        <div className="mt-5">

          <button
            onClick={handleAddRule}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Plus size={18} />

            {loading
              ? "Adding..."
              : "Add Rule"}

          </button>

        </div>

      </div>


      {/* Existing Rules */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

          <div>

            <h2 className="text-lg font-semibold text-white">
              Existing Rules
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Custom rules currently configured.
            </p>

          </div>


          <button
            onClick={loadRules}
            disabled={loadingRules}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
          >

            <RefreshCw
              size={16}
              className={
                loadingRules
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>


        {/* Loading */}

        {loadingRules && (

          <div className="flex items-center justify-center px-6 py-16">

            <p className="text-sm text-slate-500">
              Loading rules...
            </p>

          </div>

        )}


        {/* Rules */}

        {!loadingRules && ruleEntries.length > 0 && (

          <div className="divide-y divide-slate-800">

            {ruleEntries.map(
              ([ruleExtension, ruleCategory]) => (

                <div
                  key={ruleExtension}
                  className="flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-slate-800/40"
                >

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="rounded-lg bg-slate-800 p-3">

                      <Tag
                        size={20}
                        className="text-slate-400"
                      />

                    </div>


                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <span className="rounded-md bg-slate-800 px-2 py-1 font-mono text-sm text-slate-200">
                          {ruleExtension}
                        </span>

                        <span className="text-slate-600">
                          →
                        </span>

                        <span className="text-sm font-medium text-slate-300">
                          {ruleCategory}
                        </span>

                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        Files with this extension will be
                        assigned to this category.
                      </p>

                    </div>

                  </div>


                  <button
                    onClick={() =>
                      handleDeleteRule(ruleExtension)
                    }
                    className="shrink-0 rounded-lg border border-red-900/60 bg-red-950/30 p-2.5 text-red-400 transition hover:bg-red-950/60 hover:text-red-300"
                    title="Delete rule"
                  >

                    <Trash2 size={18} />

                  </button>

                </div>

              )
            )}

          </div>

        )}


        {/* Empty State */}

        {!loadingRules && ruleEntries.length === 0 && (

          <div className="px-6 py-16 text-center">

            <ListFilter
              size={42}
              className="mx-auto text-slate-600"
            />

            <h3 className="mt-4 text-lg font-semibold text-slate-300">
              No custom rules
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Add your first custom rule above to control
              how specific file types are organized.
            </p>

          </div>

        )}

      </div>


    </div>
  );
}


export default RuleManager;