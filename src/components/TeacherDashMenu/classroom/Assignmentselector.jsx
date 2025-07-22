import React, { useState } from "react";
import { Edit, Book } from "lucide-react";
import ClassroomAssignments from "./AssignmentManage";
import ManualAssignments from "./ManualAssignment";

const AssignmentSelector = () => {
  const [activeTab, setActiveTab] = useState("manualAssignments");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("manualAssignments")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "manualAssignments"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Edit className="inline mr-2 h-4 w-4" />
            Manual Assignments
          </button>
          <button
            onClick={() => setActiveTab("classroomAssignments")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "classroomAssignments"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Book className="inline mr-2 h-4 w-4" />
            Classroom Assignments
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "classroomAssignments" && <ClassroomAssignments />}
        {activeTab === "manualAssignments" && <ManualAssignments />}
      </div>
    </div>
  );
};

export default AssignmentSelector;
