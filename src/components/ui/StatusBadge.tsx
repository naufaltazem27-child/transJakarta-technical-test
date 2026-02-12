import classNames from "classnames";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const formatStatus = (s: string) => s.replace(/_/g, " ");

  const badgeClass = classNames(
    "px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wide border",
    {
      "bg-green-100 text-green-700 border-green-200":
        status === "IN_TRANSIT_TO",
      "bg-blue-100 text-blue-700 border-blue-200": status === "INCOMING_AT",
      "bg-red-100 text-red-700 border-red-200": status === "STOPPED_AT",
      "bg-gray-100 text-gray-700 border-gray-200": ![
        "IN_TRANSIT_TO",
        "INCOMING_AT",
        "STOPPED_AT",
      ].includes(status),
    },
  );

  return <span className={badgeClass}>{formatStatus(status)}</span>;
};
