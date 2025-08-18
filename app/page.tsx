"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";

// --- Initial Data & Configuration ---
import { courseDataRaw } from "./data/CourseData";
import { initialSubjectLinks } from "./data/SubjectLinks";
import { subjectImages } from "./data/Images";


const initialPyqLink =
  "https://practicepaper.in/gate-cse/topic-wise-practice-of-gate-cse-previous-year-papers";

// --- Helper Functions ---
const getTodayString = () => new Date().toISOString().split("T")[0];

const parseDurationToMinutes = (durationStr = "0m") => {
  let totalMinutes = 0;
  const hoursMatch = durationStr.match(/(\d+)h/);
  const minutesMatch = durationStr.match(/(\d+)m/);
  if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;
  if (minutesMatch) totalMinutes += parseInt(minutesMatch[1], 10);
  return totalMinutes;
};

const formatMinutesToHM = (minutes: any) => {
  if (isNaN(minutes) || minutes < 0) return "0h 0m";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
};

const parseCourseData = (rawData: any) => {
  const lines = rawData.trim().split("\n");
  const subjects = [];
  let currentSubject = null;
  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;
    if (line.includes("•")) {
      if (currentSubject) {
        const [name, duration] = line.split("•").map((s) => s.trim());
        currentSubject.lessons.push({
          id: crypto.randomUUID(),
          name,
          duration,
          durationInMinutes: parseDurationToMinutes(duration),
        });
      }
    } else {
      if (currentSubject) subjects.push(currentSubject);
      currentSubject = {
        name: line,
        lessons: [],
        link: initialSubjectLinks[line] || "",
        pyqLink: "", // Add individual PYQ link property
      };
    }
  });
  if (currentSubject) subjects.push(currentSubject);
  return subjects;
};

// --- Child Components ---

const ThemeToggle = ({ theme, toggleTheme }) => {
  // Apply theme class to html element when theme changes
  React.useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:opacity-80 transition-opacity"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === "light" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    )}
  </button>
  );
};

const MotivationalQuote = () => {
  const [quote, setQuote] = useState("");
  const quotes = [
    "The secret of getting ahead is getting started.",
    "Believe you can and you're halfway there.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "It does not matter how slowly you go as long as you do not stop.",
    "The expert in anything was once a beginner.",
    "Strive for progress, not perfection.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Don't watch the clock; do what it does. Keep going.",
    "The only way to do great work is to love what you do.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
  ];

  useEffect(() => {
    const today = getTodayString();
    const savedQuoteData = JSON.parse(localStorage.getItem("dailyQuote"));
    if (savedQuoteData && savedQuoteData.date === today) {
      setQuote(savedQuoteData.quote);
    } else {
      const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(newQuote);
      localStorage.setItem(
        "dailyQuote",
        JSON.stringify({ quote: newQuote, date: today })
      );
    }
  }, []);

  return (
    <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg border border-blue-200 dark:from-blue-900/50 dark:to-indigo-900/50 dark:border-blue-800/50">
      <p className="text-lg font-medium text-slate-700 dark:text-gray-300">
        "{quote}"
      </p>
    </div>
  );
};

const Lesson = ({ lesson, isCompleted, onToggle }) => (
  <div
    className={`flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-indigo-50/50 dark:hover:bg-gray-800/50 transition-colors ${
      isCompleted ? "completed-lesson" : ""
    }`}
  >
    <div className="flex items-center min-w-0 flex-grow">
      <input
        type="checkbox"
        id={`lesson-check-${lesson.id}`}
        className="custom-checkbox mr-4 flex-shrink-0"
        checked={isCompleted}
        onChange={onToggle}
      />
      <label
        htmlFor={`lesson-check-${lesson.id}`}
        onClick={(e: React.MouseEvent<HTMLLabelElement>) => {
          const target = e.target as HTMLElement | null;
          if (target && target.nodeName !== "INPUT") {
            onToggle();
          }
        }}
        className={`cursor-pointer text-sm truncate w-full !text-inherit ${
          isCompleted
            ? 'text-gray-500 dark:text-gray-400 line-through'
            : 'text-slate-700 dark:text-white'
        }`}
      >
        {lesson.name}
      </label>
    </div>
    <span className="text-xs !text-slate-100 dark:text-gray-500 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded flex-shrink-0 ml-2">
      {lesson.duration}
    </span>
  </div>
);

const Subject = ({
  subject,
  completedLessons,
  onLessonToggle,
  onEdit,
  globalPyqLink,
  isExpanded,
  onToggle
}) => {
  const { completedDuration, totalDuration } = useMemo(() => {
    let completed = 0;
    const total = subject.lessons.reduce(
      (sum, l) => sum + l.durationInMinutes,
      0
    );
    subject.lessons.forEach((l) => {
      if (completedLessons[l.id]) {
        completed += l.durationInMinutes;
      }
    });
    return { completedDuration: completed, totalDuration: total };
  }, [subject.lessons, completedLessons]);

  const completedCount = useMemo(
    () => subject.lessons.filter((l) => !!completedLessons[l.id]).length,
    [subject.lessons, completedLessons]
  );

  const progress =
    subject.lessons.length > 0
      ? (completedCount / subject.lessons.length) * 100
      : 0;
  const imageLink =
    subjectImages[subject.name] ||
    "https://placehold.co/600x400/cccccc/FFFFFF?text=GATE+CSE";
  const finalPyqLink = subject.pyqLink || globalPyqLink;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(subject.name);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(subject.name);
  };

  const handleCardClick = () => {
    onToggle(subject.name);
  };

  return (
    <div 
      className="subject-card rounded-2xl shadow-lg border border-white/30 dark:border-gray-700/50 overflow-hidden transition-all duration-300 flex flex-col cursor-pointer hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500 h-full flex flex-col"
      onClick={handleCardClick}
    >
      <img
        src={imageLink}
        alt={subject.name}
        className="w-full h-32 object-cover flex-shrink-0"
      />
      <div className="p-5 flex flex-col flex-grow min-h-0">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
              {subject.name}
            </h2>
            <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
              {completedCount} / {subject.lessons.length} lessons
            </p>
            <p className="text-xs text-slate-500 dark:text-gray-500 mt-1 font-mono">
              {formatMinutesToHM(completedDuration)} /{" "}
              {formatMinutesToHM(totalDuration)}
            </p>
          </div>
          <button
            onClick={handleEditClick}
            className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
            aria-label={`Edit ${subject.name}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-slate-600 dark:text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 ml-3 w-16 text-right">
            {progress.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          {subject.link && (
            <a
              href={subject.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-sm w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition-transform transform hover:scale-105"
            >
              Course
            </a>
          )}
          <a
            href={finalPyqLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-sm w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition-transform transform hover:scale-105"
          >
            PYQ
          </a>
        </div>
        <button
          onClick={handleToggle}
          className="mt-4 show-lessons-btn font-semibold text-sm w-full text-left transition-colors text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center justify-between"
          aria-expanded={isExpanded}
          aria-controls={`lessons-${subject.name.replace(/\s+/g, '-').toLowerCase()}`}
        >
          <span>{isExpanded ? 'Hide' : 'Show'} Lessons</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div
        id={`lessons-${subject.name.replace(/\s+/g, '-').toLowerCase()}`}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 max-h-[350px] overflow-y-auto pr-2 -mr-2 custom-scrollbar">
          {subject.lessons.map((lesson) => (
            <Lesson
              key={lesson.id}
              lesson={lesson}
              isCompleted={!!completedLessons[lesson.id]}
              onToggle={(e) => {
                e.stopPropagation();
                onLessonToggle(lesson.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PacingTracker = ({
  totalLessons,
  totalCompleted,
  targetDate,
  onTargetDateChange,
  streaks,
}) => {
  const paceInfo = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const lessonsRemaining = totalLessons - totalCompleted;
    if (lessonsRemaining <= 0) {
      return {
        status: "Completed",
        color: "text-green-500 dark:text-green-400",
        projection: "Congratulations!",
        requiredPace: 0,
      };
    }

    const daysRemaining = Math.max(
      0,
      Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    );
    if (daysRemaining <= 0) {
      return {
        status: "Past Due",
        color: "text-red-500 dark:text-red-400",
        projection: "Target date is in the past.",
        requiredPace: Infinity,
      };
    }

    const requiredPace = lessonsRemaining / daysRemaining;

    const firstCompletionDate =
      streaks.length > 0 ? new Date(streaks.sort()[0]) : today;
    firstCompletionDate.setHours(0, 0, 0, 0);
    const daysSinceStart = Math.max(
      1,
      Math.ceil(
        (today.getTime() - firstCompletionDate.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    );
    const currentPace = totalCompleted / daysSinceStart;

    let projection = "N/A";
    if (currentPace > 0) {
      const daysToComplete = lessonsRemaining / currentPace;
      const projectedDate = new Date();
      projectedDate.setDate(today.getDate() + daysToComplete);
      projection = projectedDate.toLocaleDateString("en-CA"); // YYYY-MM-DD format
    }

    let status = "On Track";
    let color = "text-green-500 dark:text-green-400";
    if (currentPace < requiredPace * 0.9) {
      status = "Lagging Behind";
      color = "text-red-500 dark:text-red-400";
    } else if (currentPace > requiredPace * 1.1) {
      status = "Ahead";
      color = "text-blue-500 dark:text-blue-400";
    }

    return { status, color, projection, requiredPace: requiredPace.toFixed(2) };
  }, [totalLessons, totalCompleted, targetDate, streaks]);

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div className="bg-white/50 dark:bg-gray-800/20 p-4 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
        <h3 className="font-semibold text-slate-700 dark:text-gray-300">
          Target Date
        </h3>
        <input
          type="date"
          value={targetDate}
          onChange={onTargetDateChange}
          className="mt-2 p-2 border rounded-md w-full bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
        />
        <p className="text-xs mt-2 text-slate-600 dark:text-gray-400">
          Required Pace: {paceInfo.requiredPace} lessons/day
        </p>
      </div>
      <div className="bg-white/50 dark:bg-gray-800/20 p-4 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
        <h3 className="font-semibold text-slate-700 dark:text-gray-300">
          Pacing Status
        </h3>
        <p className={`text-3xl font-bold mt-2 ${paceInfo.color}`}>
          {paceInfo.status}
        </p>
      </div>
      <div className="bg-white/50 dark:bg-gray-800/20 p-4 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
        <h3 className="font-semibold text-slate-700 dark:text-gray-300">
          Projected Completion
        </h3>
        <p className="text-2xl font-bold text-slate-800 dark:text-gray-200 mt-2">
          {paceInfo.projection}
        </p>
      </div>
    </div>
  );
};

const EditSubjectModal = ({ subject, isOpen, onClose, onSave, onDelete }) => {
  const [lessons, setLessons] = useState([]);
  const [link, setLink] = useState("");
  const [pyqLink, setPyqLink] = useState("");
  const [bulkLessons, setBulkLessons] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (subject) {
      setLessons(JSON.parse(JSON.stringify(subject.lessons))); // Deep copy
      setLink(subject.link || "");
      setPyqLink(subject.pyqLink || "");
      setBulkLessons("");
      setShowDeleteConfirm(false);
    }
  }, [subject]);

  if (!isOpen) return null;

  const handleSave = () => {
    let allLessons = [...lessons];
    if (bulkLessons.trim()) {
      const newLessons = bulkLessons
        .trim()
        .split("\n")
        .map((line) => {
          if (line.includes("•")) {
            const [name, duration] = line.split("•").map((s) => s.trim());
            return {
              id: crypto.randomUUID(),
              name,
              duration,
              durationInMinutes: parseDurationToMinutes(duration),
            };
          }
          return null;
        })
        .filter(Boolean);
      allLessons = [...allLessons, ...newLessons];
    }
    const updatedLessons = allLessons.map((l) => ({
      ...l,
      durationInMinutes: parseDurationToMinutes(l.duration),
    }));
    onSave(subject.name, updatedLessons, link, pyqLink);
    onClose();
  };

  const handleDeleteSubject = () => {
    onDelete(subject.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold dark:text-white">
            Edit {subject?.name}
          </h2>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Course Link
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="mt-1 block w-full input-style"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Individual PYQ Link (Overrides Global)
            </label>
            <input
              type="text"
              value={pyqLink}
              onChange={(e) => setPyqLink(e.target.value)}
              className="mt-1 block w-full input-style"
              placeholder="https://..."
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mt-4 mb-2 dark:text-white">
              Add Multiple Lessons
            </h3>
            <textarea
              value={bulkLessons}
              onChange={(e) => setBulkLessons(e.target.value)}
              className="mt-1 block w-full input-style h-24"
              placeholder="Lesson Name 1 • 1h 30m&#10;Lesson Name 2 • 45m"
            ></textarea>
          </div>
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center">
              <h3 className="text-lg font-bold dark:text-white">
                Are you sure?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 my-2">
                This will permanently delete the subject and all its lessons.
              </p>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubject}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AddSubjectModal = ({ isOpen, onClose, onSave }) => {
  const [subjectName, setSubjectName] = useState("");
  const [subjectLink, setSubjectLink] = useState("");
  const [lessonsRaw, setLessonsRaw] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (!subjectName.trim()) {
      alert("Subject name is required.");
      return;
    }
    const newSubject = {
      name: subjectName,
      lessons: [],
      link: subjectLink,
    };
    const lines = lessonsRaw.trim().split("\n");
    lines.forEach((line) => {
      line = line.trim();
      if (line && line.includes("•")) {
        const [name, duration] = line.split("•").map((s) => s.trim());
        newSubject.lessons.push({
          id: crypto.randomUUID(),
          name,
          duration,
          durationInMinutes: parseDurationToMinutes(duration),
        });
      }
    });
    onSave(newSubject);
    onClose();
    setSubjectName("");
    setSubjectLink("");
    setLessonsRaw("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white">Add New Subject</h2>
        </div>
        <div className="p-4 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject Name
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="mt-1 block w-full input-style"
              placeholder="e.g., Aptitude"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Course Link (Optional)
            </label>
            <input
              type="text"
              value={subjectLink}
              onChange={(e) => setSubjectLink(e.target.value)}
              className="mt-1 block w-full input-style"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Lessons
            </label>
            <textarea
              value={lessonsRaw}
              onChange={(e) => setLessonsRaw(e.target.value)}
              className="mt-1 block w-full input-style h-40"
              placeholder="Lesson Name 1 • 1h 30m&#10;Lesson Name 2 • 45m"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Paste lessons, one per line, with name and duration separated by
              '•'.
            </p>
          </div>
        </div>
        <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Subject
          </button>
        </div>
      </div>
    </div>
  );
};

const TodaysLessons = ({ lessons, completedLessons, onLessonToggle }) => (
  <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
    <h3 className="font-semibold text-slate-700 dark:text-gray-300 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-green-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      Today's Lessons
    </h3>
    <div className="mt-2 text-sm text-slate-600 dark:text-gray-400">
      {lessons.length > 0 ? (
        <div className="space-y-1">
          {lessons.map((l) => (
            <Lesson
              key={l.id}
              lesson={l}
              isCompleted={!!completedLessons[l.id]}
              onToggle={() => onLessonToggle(l.id)}
            />
          ))}
        </div>
      ) : (
        "Select ongoing subjects and set targets to see your lessons for today!"
      )}
    </div>
  </div>
);

const RevisionReminder = ({ completedLast7Days }) => (
  <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
    <h3 className="font-semibold text-slate-700 dark:text-gray-300 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-blue-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
      Weekly Revision Reminders
    </h3>
    <div className="mt-2 text-sm text-slate-600 dark:text-gray-400">
      {completedLast7Days > 0
        ? "You've been working hard! Don't forget to revise what you've learned this week."
        : "No lessons need revision this week. Keep completing lessons to build your revision schedule!"}
    </div>
  </div>
);

const AddTestSeries = ({ onAddTest }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !date) {
      alert("Test Name and Date are required.");
      return;
    }
    onAddTest({ id: crypto.randomUUID(), name, date, time, desc });
    setName("");
    setDate("");
    setTime("");
    setDesc("");
  };

  return (
    <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
      <h3 className="font-semibold text-slate-700 dark:text-gray-300 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-purple-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          <path
            fillRule="evenodd"
            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
            clipRule="evenodd"
          />
        </svg>
        Add Test Series
      </h3>
      <form onSubmit={handleSubmit} className="mt-2 space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Test Name e.g., GATE Mock Test 1"
          className="w-full input-style"
        />
        <div className="flex space-x-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full input-style"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full input-style"
          />
        </div>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description (Optional)"
          className="w-full input-style h-16"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Add Test
        </button>
      </form>
    </div>
  );
};

const UpcomingTests = ({ tests, onDeleteTest }) => (
  <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
    <h3 className="font-semibold text-slate-700 dark:text-gray-300 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-orange-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
          clipRule="evenodd"
        />
      </svg>
      Upcoming Tests
    </h3>
    <div className="mt-2 text-sm text-slate-600 dark:text-gray-400 space-y-2">
      {tests.length > 0
        ? tests
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((test) => (
              <div
                key={test.id}
                className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{test.name}</p>
                  <p className="text-xs text-slate-600 dark:text-gray-400">
                    {new Date(test.date).toLocaleDateString()} {test.time}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteTest(test.id)}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))
        : "No upcoming tests scheduled. Add some test series to stay organized!"}
    </div>
  </div>
);

const PyqLinkEditor = ({ globalLink, onGlobalLinkChange }) => {
  const [currentLink, setCurrentLink] = useState(globalLink);

  const handleSave = () => {
    onGlobalLinkChange(currentLink);
    // A small visual feedback could be added here, e.g., a temporary "Saved!" message.
  };

  return (
    <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
      <h3 className="font-semibold text-slate-700 dark:text-gray-300 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2 text-teal-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>
        PYQ Link Editor
      </h3>
      <div className="mt-2 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
            Global PYQ Link
          </label>
          <input
            type="text"
            value={currentLink}
            onChange={(e) => setCurrentLink(e.target.value)}
            placeholder="https://..."
            className="w-full input-style"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Save Global Link
        </button>
      </div>
    </div>
  );
};

const MultiSubjectSelector = ({
  subjects,
  ongoingSubjects,
  onOngoingChange,
}) => {
  const handleCheck = (subjectName) => {
    const newOngoing = { ...ongoingSubjects };
    if (newOngoing[subjectName] !== undefined) {
      delete newOngoing[subjectName];
    } else {
      newOngoing[subjectName] = "1"; // Default to 1 lesson as a string
    }
    onOngoingChange(newOngoing);
  };

  const handleTargetChange = (subjectName, value) => {
    const newOngoing = { ...ongoingSubjects };
    newOngoing[subjectName] = value;
    onOngoingChange(newOngoing);
  };

  return (
    <div className="p-4 rounded-xl bg-card-bg backdrop-blur-sm border border-border-color">
      <h3 className="font-semibold text-slate-700 dark:text-gray-300">
        Ongoing Subjects & Daily Targets
      </h3>
      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
        {subjects.map((subject) => (
          <div key={subject.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`subject-${subject.name}`}
                checked={ongoingSubjects[subject.name] !== undefined}
                onChange={() => handleCheck(subject.name)}
                className="custom-checkbox mr-3"
              />
              <label htmlFor={`subject-${subject.name}`} className="text-sm">
                {subject.name}
              </label>
            </div>
            {ongoingSubjects[subject.name] !== undefined && (
              <input
                type="text"
                value={ongoingSubjects[subject.name]}
                onChange={(e) =>
                  handleTargetChange(subject.name, e.target.value)
                }
                className="w-16 text-center p-1 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  
  const handleSubjectToggle = (subjectName: string) => {
    setExpandedSubject(prev => prev === subjectName ? null : subjectName);
  };
  
  const [appState, setAppState] = useState(() => {
    try {
      const savedState = localStorage.getItem("gateTrackerState");
      const defaultTargetDate = new Date();
      defaultTargetDate.setMonth(defaultTargetDate.getMonth() + 6);

      const initialState = {
        subjects: parseCourseData(courseDataRaw),
        completedLessons: {},
        streaks: [],
        targetDate: defaultTargetDate.toISOString().split("T")[0],
        testSeries: [],
        theme: "light",
        ongoingSubjects: {}, // { "Subject Name": "dailyTargetAsString" }
        todaysPlan: { date: null, lessonIds: [] },
        pyqLink: initialPyqLink,
      };

      if (savedState) {
        const loaded = JSON.parse(savedState);
        // Ensure pyqLink exists, if not, add it from initial constant
        if (!loaded.pyqLink) {
          loaded.pyqLink = initialPyqLink;
        }
        return { ...initialState, ...loaded };
      }
      return initialState;
    } catch (error) {
      console.error("Could not load state from local storage", error);
      const defaultTargetDate = new Date();
      defaultTargetDate.setMonth(defaultTargetDate.getMonth() + 6);
      return {
        subjects: parseCourseData(courseDataRaw),
        completedLessons: {},
        streaks: [],
        targetDate: defaultTargetDate.toISOString().split("T")[0],
        testSeries: [],
        theme: "light",
        ongoingSubjects: {},
        todaysPlan: { date: null, lessonIds: [] },
        pyqLink: initialPyqLink,
      };
    }
  });

  // Apply theme on initial load and when it changes
  useEffect(() => {
    const html = document.documentElement;
    if (appState.theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
  }, [appState.theme]);

  const [history, setHistory] = useState([]);
  const [editingSubjectName, setEditingSubjectName] = useState(null);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  const updateStateAndHistory = (newState) => {
    setHistory((prevHistory) => [...prevHistory.slice(-9), appState]);
    setAppState(newState);
  };

  useEffect(() => {
    localStorage.setItem("gateTrackerState", JSON.stringify(appState));
  }, [appState]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      appState.theme === "dark"
    );
  }, [appState.theme]);

  useEffect(() => {
    const today = getTodayString();
    if (appState.todaysPlan.date !== today) {
      let lessonIdsForToday = [];
      for (const subjectName in appState.ongoingSubjects) {
        const target = parseInt(appState.ongoingSubjects[subjectName], 10) || 1;
        const subject = appState.subjects.find((s) => s.name === subjectName);
        if (subject) {
          const nextLessonIds = subject.lessons
            .filter((l) => !appState.completedLessons[l.id])
            .slice(0, target)
            .map((l) => l.id);
          lessonIdsForToday.push(...nextLessonIds);
        }
      }
      setAppState((prevState) => ({
        ...prevState,
        todaysPlan: { date: today, lessonIds: lessonIdsForToday },
      }));
    }
  }, [
    appState.ongoingSubjects,
    appState.subjects,
    appState.completedLessons,
    appState.todaysPlan.date,
  ]);

  const { totalLessons, totalCompleted } = useMemo(() => {
    const lessons = appState.subjects.flatMap((s) => s.lessons);
    return {
      totalLessons: lessons.length,
      totalCompleted: Object.keys(appState.completedLessons).length,
    };
  }, [appState.subjects, appState.completedLessons]);

  const overallProgress =
    totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0;

  const currentStreak = useMemo(() => {
    const uniqueDates = [...new Set(appState.streaks)].sort() as string[];
    if (uniqueDates.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const date = new Date(String(uniqueDates[i]));
      date.setHours(0, 0, 0, 0);
      const diff = (today.getTime() - date.getTime()) / (1000 * 3600 * 24);
      if (diff === streak) {
        streak++;
      } else if (diff > streak) {
        break;
      }
    }
    if (uniqueDates.length > 0) {
      const lastDate = new Date(String(uniqueDates[uniqueDates.length - 1]));
      lastDate.setHours(0, 0, 0, 0);
      const diffFromToday =
        (today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
      if (diffFromToday > 1) return 0;
    }
    return streak;
  }, [appState.streaks]);

  const handleLessonToggle = useCallback(
    (lessonId) => {
      const newState = JSON.parse(JSON.stringify(appState));
      const { completedLessons, streaks } = newState;
      const today = getTodayString();

      if (completedLessons[lessonId]) {
        const completionDate = completedLessons[lessonId].date;
        delete completedLessons[lessonId];
        if (
          !Object.values(completedLessons).some(
            (l: any) => l.date === completionDate
          )
        ) {
          const index = streaks.indexOf(completionDate);
          if (index > -1) streaks.splice(index, 1);
        }
      } else {
        completedLessons[lessonId] = { date: today };
        if (!streaks.includes(today)) streaks.push(today);
      }
      updateStateAndHistory(newState);
    },
    [appState]
  );

  const handleUpdateSubject = (
    subjectName,
    updatedLessons,
    updatedLink,
    updatedPyqLink
  ) => {
    const newState = JSON.parse(JSON.stringify(appState));
    newState.subjects = newState.subjects.map((s) =>
      s.name === subjectName
        ? {
            ...s,
            lessons: updatedLessons,
            link: updatedLink,
            pyqLink: updatedPyqLink,
          }
        : s
    );
    updateStateAndHistory(newState);
  };

  const handleAddNewSubject = (newSubject) => {
    const newState = JSON.parse(JSON.stringify(appState));
    newState.subjects.push(newSubject);
    updateStateAndHistory(newState);
  };

  const handleDeleteSubject = (subjectName) => {
    const newState = JSON.parse(JSON.stringify(appState));
    newState.subjects = newState.subjects.filter((s) => s.name !== subjectName);
    if (newState.ongoingSubjects[subjectName]) {
      delete newState.ongoingSubjects[subjectName];
    }
    updateStateAndHistory(newState);
  };

  const handleAddTest = (newTest) => {
    const newState = JSON.parse(JSON.stringify(appState));
    newState.testSeries.push(newTest);
    updateStateAndHistory(newState);
  };

  const handleDeleteTest = (testId) => {
    const newState = JSON.parse(JSON.stringify(appState));
    newState.testSeries = newState.testSeries.filter((t) => t.id !== testId);
    updateStateAndHistory(newState);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setAppState(lastState);
    }
  };

  const handleGlobalPyqLinkChange = (newLink) => {
    updateStateAndHistory({ ...appState, pyqLink: newLink });
  };

  const toggleTheme = () =>
    updateStateAndHistory({
      ...appState,
      theme: appState.theme === "light" ? "dark" : "light",
    });
  const handleTargetDateChange = (e) =>
    updateStateAndHistory({ ...appState, targetDate: e.target.value });
  const handleOngoingSubjectsChange = (newOngoing) => {
    const newState = { ...appState, ongoingSubjects: newOngoing };
    newState.todaysPlan = { date: "FORCE_REGEN", lessonIds: [] };
    updateStateAndHistory(newState);
  };

  const editingSubject = useMemo(
    () => appState.subjects.find((s) => s.name === editingSubjectName),
    [editingSubjectName, appState.subjects]
  );

  const { todaysLessons, completedLast7Days, totalDailyTarget } =
    useMemo(() => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const completedInLastWeek = Object.values(
        appState.completedLessons
      ).filter((c: any) => new Date(c.date) > sevenDaysAgo).length;

      const allLessons = appState.subjects.flatMap((s) => s.lessons);
      const lessonsForToday = appState.todaysPlan.lessonIds
        .map((id) => allLessons.find((l) => l.id === id))
        .filter(Boolean);

      const dailyTargetSum = (
        Object.values(appState.ongoingSubjects) as string[]
      ).reduce((sum: number, val: string) => sum + (parseInt(val, 10) || 0), 0);

      return {
        todaysLessons: lessonsForToday,
        completedLast7Days: completedInLastWeek,
        totalDailyTarget: dailyTargetSum,
      };
    }, [appState]);

  const todaysCompletionsCount = useMemo(() => {
    const today = getTodayString();
    return Object.values(appState.completedLessons).filter(
      (l: any) => l.date === today
    ).length;
  }, [appState.completedLessons]);

  return (
    <>
      <style>{`
                :root { --bg-color: #f8fafc; --text-color: #1e293b; --card-bg: rgba(255, 255, 255, 0.8); --header-bg: rgba(255, 255, 255, 0.9); --border-color: rgba(203, 213, 225, 0.6); --input-bg: #fff; }
                html.dark { --bg-color: #0f172a; --text-color: #e2e8f0; --card-bg: rgba(30, 41, 59, 0.5); --header-bg: rgba(30, 41, 59, 0.6); --border-color: rgba(51, 65, 85, 0.5); --input-bg: #1e293b; }
                body { font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-color); background-image: radial-gradient(hsla(210, 40%, 85%, 0.8) 1px, transparent 1px); background-size: 1.5rem 1.5rem; transition: background-color 0.3s, color 0.3s; }
                html.dark body { background-image: radial-gradient(hsla(222, 47%, 20%, 1) 1px, transparent 1px); }
                .lesson-list { transition: max-height 0.5s ease-in-out, opacity 0.3s ease-in-out; max-height: 400px; overflow-y: auto; opacity: 1; }
                .lesson-list.collapsed { max-height: 0; opacity: 0; }
                .custom-checkbox { -webkit-appearance: none; appearance: none; background-color: var(--input-bg); margin: 0; font: inherit; color: currentColor; width: 1.15em; height: 1.15em; border: 0.15em solid #cbd5e1; border-radius: 0.25em; transform: translateY(-0.075em); display: grid; place-content: center; cursor: pointer; }
                html.dark .custom-checkbox { border-color: #4b5563; }
                .custom-checkbox::before { content: ""; width: 0.65em; height: 0.65em; transform: scale(0); transition: 120ms transform ease-in-out; box-shadow: inset 1em 1em #4f46e5; transform-origin: bottom left; clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%); }
                .custom-checkbox:checked::before { transform: scale(1); }
                .input-style { padding: 0.5rem 0.75rem; border-radius: 0.375rem; border: 1px solid #d1d5db; background-color: var(--input-bg); color: var(--text-color); }
                html.dark .input-style { border-color: #4b5563; }
                .bg-card-bg { background-color: var(--card-bg); }
                .border-border-color { border-color: var(--border-color); }
            `}</style>

      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <header className="relative bg-header-bg backdrop-blur-xl p-6 rounded-2xl shadow-lg mb-8 border border-border-color">
          <ThemeToggle theme={appState.theme} toggleTheme={toggleTheme} />
          <div className="absolute top-4 left-4">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l6 6"
                />
              </svg>
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
              GATE CSE Progress Tracker
            </h1>
          </div>
          <MotivationalQuote />

          <div className="mt-6">
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium text-indigo-700 dark:text-indigo-400">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
                {overallProgress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>

          <PacingTracker
            totalLessons={totalLessons}
            totalCompleted={totalCompleted}
            targetDate={appState.targetDate}
            onTargetDateChange={handleTargetDateChange}
            streaks={appState.streaks}
          />

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-white/50 dark:bg-gray-800/20 p-4 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
              <h3 className="font-semibold text-slate-700 dark:text-gray-300">
                Total Daily Target
              </h3>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                {totalDailyTarget}
              </p>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                Completed today: {todaysCompletionsCount}
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/20 p-4 rounded-xl backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
              <h3 className="font-semibold text-slate-700 dark:text-gray-300">
                Current Streak
              </h3>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                {currentStreak} Day{currentStreak !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-slate-600 dark:text-gray-400">
                Keep up the momentum!
              </p>
            </div>
          </div>
        </header>

        <MultiSubjectSelector
          subjects={appState.subjects}
          ongoingSubjects={appState.ongoingSubjects}
          onOngoingChange={handleOngoingSubjectsChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          <TodaysLessons
            lessons={todaysLessons}
            completedLessons={appState.completedLessons}
            onLessonToggle={handleLessonToggle}
          />
          <RevisionReminder completedLast7Days={completedLast7Days} />
          <AddTestSeries onAddTest={handleAddTest} />
          <UpcomingTests
            tests={appState.testSeries}
            onDeleteTest={handleDeleteTest}
          />
          <PyqLinkEditor
            globalLink={appState.pyqLink}
            onGlobalLinkChange={handleGlobalPyqLinkChange}
          />
        </div>

        <div className="mb-6 text-center">
          <button
            onClick={() => setIsAddSubjectModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            + Add New Subject
          </button>
        </div>

        <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {appState.subjects.map((subject) => (
            <Subject
              key={subject.name}
              subject={subject}
              completedLessons={appState.completedLessons}
              onLessonToggle={handleLessonToggle}
              onEdit={setEditingSubjectName}
              globalPyqLink={appState.pyqLink}
              isExpanded={expandedSubject === subject.name}
              onToggle={handleSubjectToggle}
            />
          ))}
        </main>

        <EditSubjectModal
          isOpen={!!editingSubject}
          subject={editingSubject}
          onClose={() => setEditingSubjectName(null)}
          onSave={handleUpdateSubject}
          onDelete={handleDeleteSubject}
        />
        <AddSubjectModal
          isOpen={isAddSubjectModalOpen}
          onClose={() => setIsAddSubjectModalOpen(false)}
          onSave={handleAddNewSubject}
        />
      </div>
    </>
  );
}
