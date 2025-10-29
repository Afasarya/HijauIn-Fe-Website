import {
  Users,
  CreditCard,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  FileText,
} from "lucide-react";

export default function Home() {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$1,250.00",
      change: "+12.5%",
      trend: "up",
      icon: CreditCard,
      description: "Trending up this month",
    },
    {
      title: "New Customers",
      value: "1,234",
      change: "-20%",
      trend: "down",
      icon: Users,
      description: "Down 20% this period",
    },
    {
      title: "Active Accounts",
      value: "45,678",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      description: "Strong user retention",
    },
    {
      title: "Growth Rate",
      value: "4.5%",
      change: "+4.5%",
      trend: "up",
      icon: ArrowUpRight,
      description: "Steady performance increase",
    },
  ];

  const quickStats = [
    { label: "Waste Locations", value: "156", icon: MapPin, color: "emerald" },
    { label: "Articles Published", value: "89", icon: FileText, color: "blue" },
    { label: "Products Listed", value: "234", icon: Package, color: "purple" },
    { label: "Active Users", value: "12.5K", icon: Users, color: "orange" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 max-w-2xl">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Main Metrics - Horizontal Scroll on Mobile */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Key Metrics</h2>
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4 min-w-max sm:min-w-0">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.title}
                  className="w-64 sm:w-auto rounded-xl border border-white/10 bg-[#171717] p-5 sm:p-6 shadow-lg transition-all hover:border-emerald-500/30 hover:shadow-emerald-500/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                    </div>
                    <div
                      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                        metric.trend === "up"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-400">
                      {metric.title}
                    </h3>
                    <p className="mt-2 text-xl sm:text-2xl font-bold text-white">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {metric.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Scroll Hint for Mobile */}
        <p className="text-xs text-gray-500 sm:hidden text-center">
          👈 Swipe to see more metrics
        </p>
      </div>

      {/* Quick Stats - Horizontal Scroll on Mobile */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Quick Stats</h2>
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-4 min-w-max sm:min-w-0">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="w-48 sm:w-auto flex items-center gap-3 sm:gap-4 rounded-xl border border-white/10 bg-[#171717] p-3 sm:p-4"
                >
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 truncate">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Scroll Hint for Mobile */}
        <p className="text-xs text-gray-500 sm:hidden text-center">
          👈 Swipe to see all stats
        </p>
      </div>

      {/* Recent Activity Section - Responsive Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Recent Transactions */}
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      Payment #{1000 + i}
                    </p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-emerald-400 shrink-0">
                  +$150.00
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="rounded-xl border border-white/10 bg-[#171717] p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
            System Status
          </h3>
          <div className="space-y-4">
            {[
              { name: "API Services", status: "Operational", color: "emerald" },
              { name: "Database", status: "Operational", color: "emerald" },
              { name: "CDN", status: "Degraded", color: "yellow" },
              { name: "Auth Services", status: "Operational", color: "emerald" },
            ].map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-sm text-gray-300 truncate">{service.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      service.color === "emerald"
                        ? "bg-emerald-500"
                        : "bg-yellow-500"
                    }`}
                  ></span>
                  <span className="text-xs text-gray-400">
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
