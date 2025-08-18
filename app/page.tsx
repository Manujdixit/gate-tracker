"use client";

import { useState, useEffect } from "react";
import { courseDataRaw } from "./data/CourseData";
import { subjectImages } from "./data/Images";
import { initialSubjectLinks } from "./data/SubjectLinks";

// Parse course data
function parseCourseData(rawData) {
  const subjects = {};
  const lines = rawData.trim().split('\n');
  let currentSubject = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check if this line is a subject (no bullet point and no duration)
    if (!trimmedLine.includes('•') && !trimmedLine.match(/\d+[hm]/)) {
      currentSubject = trimmedLine;
      subjects[currentSubject] = [];
    } else if (currentSubject && trimmedLine.includes('•')) {
      // This is a lesson
      const parts = trimmedLine.split('•');
      if (parts.length >= 2) {
        const title = parts[0].trim();
        const duration = parts[1].trim();
        subjects[currentSubject].push({ title, duration });
      }
    }
  }

  return subjects;
}

export default function Home() {
  const [subjects, setSubjects] = useState({});
  const [completedLessons, setCompletedLessons] = useState({});
  const [showLessons, setShowLessons] = useState({});
  const [subjectLinks, setSubjectLinks] = useState(initialSubjectLinks);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [todaysLessons, setTodaysLessons] = useState([]);

  useEffect(() => {
    const parsedData = parseCourseData(courseDataRaw);
    setSubjects(parsedData);

    // Load saved data
    const savedCompleted = localStorage.getItem('completedLessons');
    const savedLinks = localStorage.getItem('subjectLinks');
    const savedTheme = localStorage.getItem('theme');
    const savedTodaysLessons = localStorage.getItem('todaysLessons');

    if (savedCompleted) {
      setCompletedLessons(JSON.parse(savedCompleted));
    }
    if (savedLinks) {
      setSubjectLinks(JSON.parse(savedLinks));
    }
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    if (savedTodaysLessons) {
      setTodaysLessons(JSON.parse(savedTodaysLessons));
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleLessonCompletion = (subject, lessonIndex) => {
    const key = `${subject}-${lessonIndex}`;
    const newCompleted = { ...completedLessons };
    
    if (newCompleted[key]) {
      delete newCompleted[key];
    } else {
      newCompleted[key] = true;
    }
    
    setCompletedLessons(newCompleted);
    localStorage.setItem('completedLessons', JSON.stringify(newCompleted));
  };

  const toggleShowLessons = (subject) => {
    setShowLessons(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  const updateSubjectLink = (subject, newLink) => {
    const updatedLinks = { ...subjectLinks, [subject]: newLink };
    setSubjectLinks(updatedLinks);
    localStorage.setItem('subjectLinks', JSON.stringify(updatedLinks));
  };

  const addToTodaysLessons = (subject, lesson, lessonIndex) => {
    const lessonWithSubject = { 
      ...lesson, 
      subject, 
      lessonIndex,
      id: `${subject}-${lessonIndex}-${Date.now()}`
    };
    
    // Check if lesson already exists in today's list
    const exists = todaysLessons.some(
      item => item.subject === subject && item.lessonIndex === lessonIndex
    );
    
    if (!exists) {
      const updatedLessons = [...todaysLessons, lessonWithSubject];
      setTodaysLessons(updatedLessons);
      localStorage.setItem('todaysLessons', JSON.stringify(updatedLessons));
    }
  };

  const removeFromTodaysLessons = (lessonId) => {
    const updatedLessons = todaysLessons.filter(lesson => lesson.id !== lessonId);
    setTodaysLessons(updatedLessons);
    localStorage.setItem('todaysLessons', JSON.stringify(updatedLessons));
  };

  const clearTodaysLessons = () => {
    setTodaysLessons([]);
    localStorage.removeItem('todaysLessons');
  };

  const getCompletedCount = (subject) => {
    return subjects[subject]?.filter((_, index) => 
      completedLessons[`${subject}-${index}`]
    ).length || 0;
  };

  const getTotalDuration = (subject) => {
    return subjects[subject]?.reduce((total, lesson) => {
      const duration = lesson.duration;
      const hours = duration.match(/(\d+)h/) ? parseInt(duration.match(/(\d+)h/)[1]) : 0;
      const minutes = duration.match(/(\d+)m/) ? parseInt(duration.match(/(\d+)m/)[1]) : 0;
      return total + (hours * 60) + minutes;
    }, 0) || 0;
  };

  const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getProgressPercentage = (subject) => {
    const total = subjects[subject]?.length || 0;
    const completed = getCompletedCount(subject);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Group today's lessons by subject
  const groupedTodaysLessons = todaysLessons.reduce((acc, lesson) => {
    if (!acc[lesson.subject]) {
      acc[lesson.subject] = [];
    }
    acc[lesson.subject].push(lesson);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GATE Tracker
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track your GATE CSE preparation</p>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Lessons Section */}
        {todaysLessons.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Lessons</h2>
              <button
                onClick={clearTodaysLessons}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-6">
              {Object.entries(groupedTodaysLessons).map(([subject, lessons]) => (
                <div key={subject} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subject}</h3>
                    <span className="ml-3 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600"
                      >
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleLessonCompletion(lesson.subject, lesson.lessonIndex)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              completedLessons[`${lesson.subject}-${lesson.lessonIndex}`]
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                            }`}
                          >
                            {completedLessons[`${lesson.subject}-${lesson.lessonIndex}`] && '✓'}
                          </button>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.duration}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromTodaysLessons(lesson.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors"
                          aria-label="Remove from today's lessons"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Subjects Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(subjects).map(([subject, lessons]) => {
              const completedCount = getCompletedCount(subject);
              const totalLessons = lessons.length;
              const progressPercentage = getProgressPercentage(subject);
              const totalDuration = getTotalDuration(subject);

              return (
                <div key={subject} className="subject-card rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {/* Subject Header */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={subjectImages[subject] || "https://placehold.co/600x400/6366F1/FFFFFF?text=Subject"}
                      alt={subject}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-2">{subject}</h3>
                      <div className="flex items-center space-x-4 text-white/90 text-sm">
                        <span>{totalLessons} lessons</span>
                        <span>{formatDuration(totalDuration)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subject Content */}
                  <div className="p-6">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {completedCount}/{totalLessons} ({progressPercentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Subject Link */}
                    <div className="mb-4">
                      <input
                        type="url"
                        value={subjectLinks[subject] || ''}
                        onChange={(e) => updateSubjectLink(subject, e.target.value)}
                        placeholder="Enter course link..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mb-4">
                      {subjectLinks[subject] && (
                        <a
                          href={subjectLinks[subject]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-center text-sm font-medium"
                        >
                          Open Course
                        </a>
                      )}
                      <button
                        onClick={() => toggleShowLessons(subject)}
                        className="flex-1 show-lessons-btn border border-current py-2 px-4 rounded-lg transition-colors text-center text-sm font-medium"
                      >
                        {showLessons[subject] ? 'Hide Lessons' : 'Show Lessons'}
                      </button>
                    </div>

                    {/* Lessons List */}
                    {showLessons[subject] && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                          {lessons.map((lesson, index) => {
                            const isCompleted = completedLessons[`${subject}-${index}`];
                            const isInTodaysList = todaysLessons.some(
                              item => item.subject === subject && item.lessonIndex === index
                            );
                            
                            return (
                              <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                  isCompleted
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <button
                                    onClick={() => toggleLessonCompletion(subject, index)}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                      isCompleted
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                                    }`}
                                  >
                                    {isCompleted && '✓'}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${
                                      isCompleted 
                                        ? 'text-green-800 dark:text-green-200 line-through' 
                                        : 'text-gray-900 dark:text-white'
                                    }`}>
                                      {lesson.title}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{lesson.duration}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => addToTodaysLessons(subject, lesson, index)}
                                  disabled={isInTodaysList}
                                  className={`ml-2 p-1 rounded transition-colors text-sm ${
                                    isInTodaysList
                                      ? 'text-green-600 dark:text-green-400 cursor-not-allowed'
                                      : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300'
                                  }`}
                                  title={isInTodaysList ? 'Already in today\'s list' : 'Add to today\'s lessons'}
                                >
                                  {isInTodaysList ? '✓' : '+'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}