import React, { useState, useRef } from "react";

const SyllabusManagement = () => {
  const [syllabusData, setSyllabusData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const streamInputRef = useRef(null);
  const patternInputRef = useRef(null);
  const yearInputRef = useRef(null);
  const syllabusFileRef = useRef(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !streamInputRef.current ||
      !patternInputRef.current ||
      !yearInputRef.current ||
      !syllabusFileRef.current
    ) {
      alert("Some form fields are missing!");
      return;
    }

    const stream = streamInputRef.current.value;
    const pattern = patternInputRef.current.value;
    const year = yearInputRef.current.value;
    const fileInput = syllabusFileRef.current;

    if (!fileInput.files.length) {
      alert("Please select a syllabus file.");
      return;
    }

    const file = fileInput.files[0];
    const fileSize = (file.size / 1024 / 1024).toFixed(2) + " MB";

    setSyllabusData([
      ...syllabusData,
      { stream, pattern, year, size: fileSize, file },
    ]);
    closeModal();
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

  const handleDownload = (file, stream, pattern, year) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formatStream(stream)}_${pattern}_${formatYear(
      year
    )}_Syllabus.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000); // Delay URL revoke
  };

  return (
    <div className="container mx-auto p-4">
      <div className="header flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Syllabus Management
        </h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={openModal}
        >
          Add New Syllabus
        </button>
      </div>

      <div className="filters grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          id="pattern"
          className="filter-select p-2 border rounded w-full"
        >
          <option value="">All Patterns</option>
          <option value="2024">2024 Pattern</option>
          <option value="2019">2019 Pattern</option>
        </select>
        <select id="stream" className="filter-select p-2 border rounded w-full">
          <option value="">All Streams</option>
          <option value="computer">Computer Engineering</option>
          <option value="it">Information Technology</option>
          <option value="mechanical">Mechanical Engineering</option>
          <option value="electrical">
            Electronics and Telecommunication Engineering
          </option>
          <option value="civil">Civil Engineering</option>
        </select>
        <select id="year" className="filter-select p-2 border rounded w-full">
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
            className="syllabus-card p-4 bg-white rounded shadow"
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
              <span className="syllabus-size text-gray-600">{entry.size}</span>
              <button
                className="download-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() =>
                  handleDownload(
                    entry.file,
                    entry.stream,
                    entry.pattern,
                    entry.year
                  )
                }
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="modal-header flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Syllabus</h2>
              <button className="close-btn text-gray-600" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form id="syllabusForm" onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <label htmlFor="streamInput" className="block text-gray-700">
                  Stream
                </label>
                <select
                  id="streamInput"
                  ref={streamInputRef}
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
                  value={filterPattern}
                  onChange={(e) => setFilterPattern(e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="">All Patterns</option>
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
                  ref={yearInputRef}
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
                  ref={syllabusFileRef}
                  accept=".pdf"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="form-buttons flex justify-end gap-4">
                <button
                  type="button"
                  className="cancel-btn px-4 py-2 border rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
