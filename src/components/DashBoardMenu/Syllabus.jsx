import React, { useState, useEffect } from "react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const SyllabusManagement = () => {
  const [syllabusData, setSyllabusData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState("");
  const [pattern, setPattern] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const streamOptions = [
    { value: "computer", label: "Computer" },
    { value: "it", label: "IT" },
    { value: "mechanical", label: "Mechanical" },
    { value: "electrical", label: "Electrical" },
    { value: "civil", label: "Civil" },
  ];

  const patternOptions = [
    { value: "2024", label: "2024" },
    { value: "2019", label: "2019" },
  ];

  const yearOptions = [
    { value: "FE", label: "FE" },
    { value: "SE", label: "SE" },
    { value: "TE", label: "TE" },
    { value: "BE", label: "BE" },
  ];

  useEffect(() => {
    const fetchSyllabi = async () => {
      try {
        const adminId = sessionStorage.getItem("adminId");

        if (!adminId) {
          console.error("Admin ID not found in sessionStorage");
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/syllabi/getsyllabi/${adminId}`
        );

        console.log("Received syllabus data from API:", response.data);

        if (Array.isArray(response.data)) {
          const sortedSyllabi = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setSyllabusData(sortedSyllabi);
        } else {
          console.error("API did not return an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching syllabi:", error);
      }
    };

    fetchSyllabi();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!stream || !pattern || !year || !file) {
      alert("All fields are required!");
      return;
    }

    setIsSending(true);

    try {
      const adminId = sessionStorage.getItem("adminId");

      if (!adminId) {
        alert("Admin ID not found. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const fileResponse = await axios.post(
        `${API_BASE_URL}/api/syllabi/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { fileID } = fileResponse.data;

      const syllabusData = {
        stream,
        pattern,
        year,
        fileId: fileID,
        adminId,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/syllabi/putsyllabi`,
        syllabusData
      );

      setSyllabusData((prevData) => [response.data, ...prevData]);
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting syllabus:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDownload = async (fileId) => {
    if (!fileId) {
      alert("No file available for download.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/syllabi/files/${fileId}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "syllabus.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download the syllabus. Please try again.");
    }
  };

  const handleDelete = async (syllabusId) => {
    try {
      const adminId = sessionStorage.getItem("adminId");

      if (!adminId) {
        alert("Admin ID not found. Please log in again.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/api/syllabi/delete/${syllabusId}`, {
        data: { adminId },
      });

      setSyllabusData((prevData) =>
        prevData.filter((syllabus) => syllabus._id !== syllabusId)
      );
      alert("Syllabus deleted successfully!");
    } catch (error) {
      console.error("Error deleting syllabus:", error);
      alert("Failed to delete syllabus");
    }
  };

  const formatStream = (stream) => {
    const streamNames = {
      computer: "Computer Engineering",
      it: "Information Technology",
      mechanical: "Mechanical Engineering",
      electrical: "Electronics and Telecommunication Engineering",
      civil: "Civil Engineering",
    };
    return streamNames[stream] || stream;
  };

  const formatYear = (year) => {
    const yearNames = {
      FE: "First Year",
      SE: "Second Year",
      TE: "Third Year",
      BE: "Fourth Year",
    };
    return yearNames[year] || year;
  };

  const [filterPattern, setFilterPattern] = useState("");
  const [filterStream, setFilterStream] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const filterSyllabi = () => {
    return syllabusData.filter(
      (entry) =>
        (filterPattern === "" ||
          entry.pattern.toLowerCase().includes(filterPattern.toLowerCase())) &&
        (filterStream === "" ||
          entry.stream.toLowerCase().includes(filterStream.toLowerCase())) &&
        (filterYear === "" ||
          entry.year.toLowerCase().includes(filterYear.toLowerCase()))
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="header flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Syllabus Management
        </h1>
        <button
          className="bg-purple-700 text-white px-6 py-3 rounded hover:bg-purple-800 text-lg"
          onClick={() => setIsOpen(true)}
        >
          Add New Syllabus
        </button>
      </div>

      <div className="filters grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          id="pattern"
          className="filter-select p-2 border rounded w-full"
          value={filterPattern}
          onChange={(e) => setFilterPattern(e.target.value)}
        >
          <option value="">All Patterns</option>
          <option value="2024">2024 Pattern</option>
          <option value="2019">2019 Pattern</option>
        </select>
        <select
          id="stream"
          className="filter-select p-2 border rounded w-full"
          value={filterStream}
          onChange={(e) => setFilterStream(e.target.value)}
        >
          <option value="">All Streams</option>
          <option value="computer">Computer Engineering</option>
          <option value="it">Information Technology</option>
          <option value="mechanical">Mechanical Engineering</option>
          <option value="electrical">
            Electronics and Telecommunication Engineering
          </option>
          <option value="civil">Civil Engineering</option>
        </select>
        <select
          id="year"
          className="filter-select p-2 border rounded w-full"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="">All Years</option>
          <option value="FE">First Year</option>
          <option value="SE">Second Year</option>
          <option value="TE">Third Year</option>
          <option value="BE">Fourth Year</option>
        </select>
      </div>

      <div className="syllabus-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterSyllabi().map((entry, index) => (
          <div
            key={index}
            className="syllabus-card p-4 bg-white rounded shadow relative"
          >
            <div className="syllabus-header mb-2">
              <div className="syllabus-title text-lg font-semibold">
                {formatStream(entry.stream)}
              </div>
              <div className="syllabus-pattern text-gray-600">
                {entry.pattern} Pattern • {formatYear(entry.year)}
              </div>
            </div>
            <div className="syllabus-info flex justify-between items-center mt-4 pt-4 border-t">
              {entry.fileId && (
                <div className="mt-3">
                  <p className="font-semibold text-gray-600">Attached File:</p>
                  <button
                    onClick={() => handleDownload(entry.fileId)}
                    className="text-blue-500 hover:underline"
                  >
                    Download File
                  </button>
                </div>
              )}
              <button
                onClick={() => handleDelete(entry._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Syllabus</h2>
              <button
                className="close-btn text-gray-600 text-xl"
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="form-group mb-4">
                <label htmlFor="streamInput" className="block text-gray-700">
                  Stream
                </label>
                <select
                  id="streamInput"
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Stream</option>
                  <option value="computer">Computer Engineering</option>
                  <option value="it">Information Technology</option>
                  <option value="mechanical">Mechanical Engineering</option>
                  <option value="electrical">
                    Electronics & Telecommunication Engineering
                  </option>
                  <option value="civil">Civil Engineering</option>
                </select>
              </div>
              <div className="form-group mb-4">
                <label htmlFor="patternInput" className="block text-gray-700">
                  Pattern
                </label>
                <select
                  id="patternInput"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Pattern</option>
                  <option value="2024">2024 Pattern</option>
                  <option value="2019">2019 Pattern</option>
                </select>
              </div>
              <div className="form-group mb-4">
                <label htmlFor="yearInput" className="block text-gray-700">
                  Year
                </label>
                <select
                  id="yearInput"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Year</option>
                  <option value="FE">First Year</option>
                  <option value="SE">Second Year</option>
                  <option value="TE">Third Year</option>
                  <option value="BE">Fourth Year</option>
                </select>
              </div>
              <div className="form-group mb-4">
                <label htmlFor="syllabusFile" className="block text-gray-700">
                  Upload Syllabus (PDF)
                </label>
                <input
                  type="file"
                  id="syllabusFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="form-buttons flex justify-end gap-4">
                <button
                  type="button"
                  className="cancel-btn px-6 py-3 border rounded text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn bg-purple-700 text-white px-6 py-3 rounded hover:bg-purple-800 text-lg"
                >
                  Add Syllabus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusManagement;
