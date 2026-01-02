import React from "react";
import { FiInbox } from "react-icons/fi";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <FiInbox size={48} className="text-gray-600 mb-4" />
      <p className="text-gray-400 text-lg text-center">
        No tasks yet. Add one to get started.
      </p>
    </div>
  );
}
