import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, GraduationCap, School, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { gasService } from './services/gasService';
import { StudentCard } from './components/StudentCard';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [schoolCode, setSchoolCode] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!schoolCode.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await gasService.fetchBySchoolCode(schoolCode);
      if (result.success && Array.isArray(result.data)) {
        setStudents(result.data);
        if (result.data.length === 0) {
          setError('No students found for this school code.');
        }
      } else {
        setError(result.message || 'Failed to fetch students or invalid data format.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero Section */}
      <header className="bg-indigo-700 text-white py-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-md rounded-2xl mb-6"
          >
            <GraduationCap size={40} className="text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Student Data Management
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-indigo-100 text-lg max-w-2xl mx-auto"
          >
            Enter your UDise School Code to manage student ration card status and family IDs.
          </motion.p>
        </div>
      </header>

      {/* Search Section */}
      <main className="max-w-6xl mx-auto px-6 -mt-8 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <School size={20} />
              </div>
              <input
                type="text"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value)}
                placeholder="Enter UDise School Code (e.g., 9050300901)"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-lg font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg shadow-indigo-200 disabled:bg-slate-400 disabled:shadow-none"
            >
              {isLoading ? (
                <RefreshCw size={24} className="animate-spin" />
              ) : (
                <>
                  <Search size={24} />
                  Search Students
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results Section */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-slate-400"
              >
                <RefreshCw size={48} className="animate-spin mb-4 text-indigo-500" />
                <p className="text-xl font-medium">Fetching student records...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-50 border border-red-100 rounded-3xl p-12 flex flex-col items-center text-center"
              >
                <div className="bg-red-100 p-4 rounded-full mb-4 text-red-600">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-red-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-700 text-lg">{error}</p>
                <button 
                  onClick={() => handleSearch()}
                  className="mt-6 text-red-600 font-bold hover:underline flex items-center gap-1"
                >
                  Try again <ChevronRight size={18} />
                </button>
              </motion.div>
            ) : students.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {students.map((student, idx) => (
                  <StudentCard 
                    key={`${student['Serial Number']}-${idx}`} 
                    student={student} 
                    onUpdateSuccess={handleSearch}
                  />
                ))}
              </motion.div>
            ) : hasSearched ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-slate-400"
              >
                <AlertCircle size={48} className="mb-4" />
                <p className="text-xl font-medium">No records found for this code.</p>
              </motion.div>
            ) : (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-slate-300"
              >
                <Search size={64} className="mb-4 opacity-20" />
                <p className="text-xl font-medium">Search results will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2026 Student Data Management System</p>
        <p className="mt-1">Powered by Google Apps Script & React</p>
      </footer>
    </div>
    </ErrorBoundary>
  );
}
