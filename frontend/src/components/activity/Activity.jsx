import { useEffect, useState } from "react";
import {
  History,
  FolderOpen,
  Copy,
  CalendarDays,
  RotateCcw,
  Activity as ActivityIcon,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

import { getActivity } from "../../services/api";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivities = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getActivity();

      setActivities(data.activities || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Could not load activity history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const getActionIcon = (action) => {
    switch (action) {
      case "ORGANIZE":
        return FolderOpen;

      case "DUPLICATE_MOVE":
        return Copy;

      case "DATE_ORGANIZE":
        return CalendarDays;

      case "UNDO":
        return RotateCcw;

      default:
        return ActivityIcon;
    }
  };

  const getActionName = (action) => {
    switch (action) {
      case "ORGANIZE":
        return "File Organization";

      case "DUPLICATE_MOVE":
        return "Duplicate Move";

      case "DATE_ORGANIZE":
        return "Date Organization";

      case "UNDO":
        return "Undo Action";

      default:
        return action;
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-slate-800 p-3">
            <History
              size={26}
              className="text-slate-200"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">
              Activity
            </h1>

            <p className="mt-1 text-slate-400">
              View your file organization history.
            </p>
          </div>

        </div>

        <button
          onClick={loadActivities}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-900/60 bg-red-950/30 p-4">

          <XCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-400"
          />

          <p className="text-sm text-red-300">
            {error}
          </p>

        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-16 text-center">

          <RefreshCw
            size={32}
            className="mx-auto animate-spin text-slate-500"
          />

          <p className="mt-4 text-sm text-slate-400">
            Loading activity history...
          </p>

        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        activities.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 px-6 py-16 text-center">

            <History
              size={42}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-4 text-lg font-semibold text-slate-300">
              No activity yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your file organization activities will appear here.
            </p>

          </div>
        )}

      {/* Activity Table */}
      {!loading &&
        !error &&
        activities.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

            <div className="border-b border-slate-800 px-6 py-5">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Activity History
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    {activities.length} recorded activities
                  </p>
                </div>

                <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-300">
                  {activities.length}
                </span>

              </div>

            </div>

            <div className="max-h-[600px] overflow-auto">

              <table className="w-full text-left">

                <thead className="sticky top-0 bg-slate-950">

                  <tr>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Details
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-800">

                  {activities.map((activity) => {

                    const Icon = getActionIcon(
                      activity.action
                    );

                    return (
                      <tr
                        key={activity.id}
                        className="transition hover:bg-slate-800/40"
                      >

                        {/* Action */}
                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="rounded-lg bg-slate-800 p-2">

                              <Icon
                                size={18}
                                className="text-slate-300"
                              />

                            </div>

                            <div>

                              <p className="text-sm font-medium text-slate-200">
                                {getActionName(
                                  activity.action
                                )}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                ID #{activity.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Details */}
                        <td className="max-w-[550px] px-6 py-5">

                          <p className="break-all text-sm text-slate-400">
                            {activity.details}
                          </p>

                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">

                          <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-400">

                            <CheckCircle2 size={14} />

                            Success

                          </span>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>
        )}

    </div>
  );
}

export default Activity;