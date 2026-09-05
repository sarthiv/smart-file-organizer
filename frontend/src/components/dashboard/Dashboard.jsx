import { useEffect, useState } from "react";

import {
  Files,
  FolderCheck,
  Copy,
  CalendarDays,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import api from "../../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";


function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/organizer/statistics");

      setStatistics(response.data.statistics);

    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard statistics.");

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadStatistics();
  }, []);


  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-400">
          Loading dashboard...
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="rounded-xl border border-red-900 bg-red-950/30 p-5">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    );
  }


  const cards = [
    {
      title: "Total Activities",
      value: statistics?.total_activities ?? 0,
      icon: Files,
    },
    {
      title: "Organized Files",
      value: statistics?.organized_files ?? 0,
      icon: FolderCheck,
    },
    {
      title: "Duplicate Moves",
      value: statistics?.duplicate_moves ?? 0,
      icon: Copy,
    },
    {
      title: "Date Organized",
      value: statistics?.date_organized_files ?? 0,
      icon: CalendarDays,
    },
    {
      title: "Undo Actions",
      value: statistics?.undo_actions ?? 0,
      icon: RotateCcw,
    },
  ];


  const operationChartData = Object.entries(
    statistics?.operation_counts || {}
  ).map(([operation, count]) => ({
    operation,
    count,
  }));


  const performanceChartData = [
    {
      status: "Successful",
      count: statistics?.success_count ?? 0,
    },
    {
      status: "Failed",
      count: statistics?.failed_count ?? 0,
    },
  ];


  const categoryChartData = statistics?.categories || [];


  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Overview of your file organization activities.
        </p>
      </div>


      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
            >

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-400">
                    {card.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-white">
                    {card.value}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-800 p-3">

                  <Icon
                    size={22}
                    className="text-slate-300"
                  />

                </div>

              </div>

            </div>
          );
        })}

      </div>


      {/* Performance + Categories */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


        {/* Operation Performance */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-lg font-semibold text-white">
            Operation Performance
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Successful and failed operations.
          </p>


          {/* Successful / Failed Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4">


            {/* Successful */}
            <div className="rounded-lg bg-slate-800 p-4">

              <div className="flex items-center gap-3">

                <CheckCircle2
                  size={22}
                  className="text-emerald-400"
                />

                <span className="text-sm text-slate-400">
                  Successful
                </span>

              </div>

              <p className="mt-3 text-2xl font-bold text-white">
                {statistics?.success_count ?? 0}
              </p>

            </div>


            {/* Failed */}
            <div className="rounded-lg bg-slate-800 p-4">

              <div className="flex items-center gap-3">

                <XCircle
                  size={22}
                  className="text-red-400"
                />

                <span className="text-sm text-slate-400">
                  Failed
                </span>

              </div>

              <p className="mt-3 text-2xl font-bold text-white">
                {statistics?.failed_count ?? 0}
              </p>

            </div>

          </div>


          {/* Performance Chart */}
          <div className="mt-8">

            <h3 className="text-md font-semibold text-white">
              Performance Overview
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Successful versus failed operations.
            </p>


            <div className="mt-5 h-[260px] w-full min-w-0">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={performanceChartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 20,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="status"
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    fill="#34d399"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={70}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>


        {/* File Categories */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-lg">

          <h2 className="text-lg font-semibold text-white">
            File Categories
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Files organized by category.
          </p>


          {/* Category Chart */}
          <div className="mt-8 w-full">

            <h3 className="mb-2 text-md font-semibold text-white">
              Category Distribution
            </h3>

            <p className="mb-3 text-sm text-slate-400">
              Visual representation of file categories.
            </p>

            <div className="h-[260px] w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={categoryChartData}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    label
                  >

                    {categoryChartData.map(
                      (entry, index) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "#38bdf8",
                              "#818cf8",
                              "#34d399",
                              "#fbbf24",
                              "#f472b6",
                              "#a78bfa",
                            ][index % 6]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>


      {/* Operations */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-lg">

        <h2 className="text-lg font-semibold text-white">
          Operations
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Number of times each operation has been performed.
        </p>


        {/* Operation Cards */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-lg">

          {Object.entries(
            statistics?.operation_counts || {}
          ).map(([operation, count]) => (

            <div
              key={operation}
              className="rounded-lg border border-slate-800 bg-slate-950 p-4"
            >

              <p className="text-xs uppercase tracking-wide text-slate-500">
                {operation}
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {count}
              </p>

            </div>

          ))}

        </div>


        {/* Operation Chart */}
        <div className="mt-8">

          <h3 className="text-md font-semibold text-white">
            Operation Activity
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Visual representation of completed operations.
          </p>


          <div className="mt-6 h-[350px] w-full min-w-0">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={operationChartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="operation"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 12,
                  }}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#38bdf8"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* Refresh */}
      <button
        onClick={loadStatistics}
        className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
      >
        Refresh Statistics
      </button>

    </div>
  );
}


export default Dashboard;