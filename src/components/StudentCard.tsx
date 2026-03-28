import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MapPin, Phone, School, GraduationCap, Save, RefreshCw, ClipboardList, FileText, HelpCircle, Clock } from 'lucide-react';
import { gasService } from '../services/gasService';

interface StudentCardProps {
  student: any;
  onUpdateSuccess: () => void;
}

const STATUS_OPTIONS = [
  'Non NFSA FamilyId Created',
  'Non NFSA FamilyId Applied',
  'Child Added in Ration Card',
  'Added in Ration Card'
];

const RATION_CARD_OPTIONS = ['Created', 'Not created'];
const FAMILY_ID_OPTIONS = ['Not Applied', 'Applied', 'Created'];

export const StudentCard: React.FC<StudentCardProps> = ({ student, onUpdateSuccess }) => {
  const [rationStatus, setRationStatus] = useState(String(student['Ration Card Status'] || ''));
  const [status, setStatus] = useState(String(student.status || ''));
  const [familyIdStatus, setFamilyIdStatus] = useState(String(student['Family ID status'] || ''));
  const [familyId, setFamilyId] = useState(String(student['New FamilyId'] || ''));
  const [reason, setReason] = useState(String(student.Reason || ''));
  const [isUpdating, setIsUpdating] = useState(false);

  const hasExistingData = student.status || student['New FamilyId'] || student['Ration Card Status'];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleUpdate = async () => {
    // Validation
    const trimmedReason = String(reason).trim();
    const trimmedFamilyId = String(familyId).trim();

    if (familyIdStatus === 'Not Applied' && !trimmedReason) {
      alert('Please provide a reason for not applying for Family ID.');
      return;
    }

    if ((familyIdStatus === 'Applied' || familyIdStatus === 'Created') && !trimmedFamilyId) {
      alert('Please provide the New Family ID.');
      return;
    }

    if (rationStatus === 'Created' && !status) {
      alert('Please select a status for the Ration Card.');
      return;
    }

    setIsUpdating(true);
    const updatedData = {
      ...student,
      'Ration Card Status': rationStatus,
      status: rationStatus === 'Created' ? status : '',
      'Family ID status': familyIdStatus,
      'New FamilyId': (familyIdStatus === 'Applied' || familyIdStatus === 'Created') ? familyId : '',
      Reason: familyIdStatus === 'Not Applied' ? reason : ''
    };

    const result = await gasService.updateStudentRecord(updatedData);
    setIsUpdating(false);

    if (result.success) {
      alert('Data updated successfully!');
      onUpdateSuccess();
    } else {
      alert('Error updating data: ' + result.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <User size={20} />
          <h3 className="font-bold text-lg">{student.StudentName}</h3>
        </div>
        <span className="bg-indigo-500 px-3 py-1 rounded-full text-xs font-medium">
          S.No: {student['Serial Number']}
        </span>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={16} className="mt-1 flex-shrink-0 text-indigo-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Address</p>
                <p>{student.StudentAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <User size={16} className="mt-1 flex-shrink-0 text-indigo-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Parent Name</p>
                <p>{student.ParentName}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <GraduationCap size={16} className="mt-1 flex-shrink-0 text-indigo-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Class</p>
                <p>{student.Class}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2 text-gray-600">
              <School size={16} className="mt-1 flex-shrink-0 text-indigo-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">School</p>
                <p>{student.School_Name} ({student.SchoolType})</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <Phone size={16} className="mt-1 flex-shrink-0 text-indigo-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Guardian Mobile</p>
                <p>{student.GuardianMobileNo}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin size={16} className="mt-1 flex-shrink-0 text-indigo-500" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Nyay Panchayat</p>
                <p>{student['Nyay Panchayat']}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <ClipboardList size={14} className="text-indigo-500" />
                Ration Card Status
              </label>
              <select
                value={rationStatus}
                onChange={(e) => setRationStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50"
              >
                <option value="">Select Status</option>
                {RATION_CARD_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <AnimatePresence>
              {rationStatus === 'Created' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <FileText size={14} className="text-indigo-500" />
                    Status <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50"
                  >
                    <option value="">Select Status</option>
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <ClipboardList size={14} className="text-indigo-500" />
                Family ID Status
              </label>
              <select
                value={familyIdStatus}
                onChange={(e) => setFamilyIdStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50"
              >
                <option value="">Select Status</option>
                {FAMILY_ID_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <AnimatePresence>
              {(familyIdStatus === 'Applied' || familyIdStatus === 'Created') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <FileText size={14} className="text-indigo-500" />
                    New Family ID <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    value={familyId}
                    onChange={(e) => setFamilyId(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 ${!String(familyId).trim() ? 'border-red-200' : 'border-gray-300'}`}
                    placeholder="Enter Family ID (Required)"
                  />
                </motion.div>
              )}

              {familyIdStatus === 'Not Applied' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                    <HelpCircle size={14} className="text-indigo-500" />
                    Reason <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-gray-50 ${!String(reason).trim() ? 'border-red-200' : 'border-gray-300'}`}
                    placeholder="Enter Reason (Required)"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
              isUpdating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : hasExistingData 
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-200' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
            }`}
          >
            {isUpdating ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : hasExistingData ? (
              <>
                <RefreshCw size={20} />
                Update Record
              </>
            ) : (
              <>
                <Save size={20} />
                Submit Record
              </>
            )}
          </button>

          {student.Timestamp && (
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 italic pt-2">
              <Clock size={10} />
              <span>Last Updated: {formatDate(student.Timestamp)}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
