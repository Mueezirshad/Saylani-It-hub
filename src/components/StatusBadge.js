export default function StatusBadge({ status }) {
    // Status ke mutabiq styling color map karna
    const colors = {
      Submitted: "bg-blue-100 text-blue-800 border-blue-200",
      "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Resolved: "bg-green-100 text-green-800 border-green-200",
      Pending: "bg-orange-100 text-orange-800 border-orange-200",
      Found: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
  
    const defaultStyle = "bg-gray-100 text-gray-800 border-gray-200";
    const currentStyle = colors[status] || defaultStyle;
  
    return (
      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${currentStyle}`}>
        {status}
      </span>
    );
  }