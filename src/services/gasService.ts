/**
 * Service to interact with Google Apps Script
 */

const GAS_URL = 'https://script.google.com/macros/s/AKfycbxytkB4-W6UEnBCf6lJr0s44QJFFKWNhwNbmXh87SHGCf2sWoI1CBUDI0-GFswcueeLog/exec';

export const gasService = {
  async fetchBySchoolCode(schoolCode: string) {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'fetchBySchoolCode', schoolCode }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      return { success: false, message: 'Network error' };
    }
  },

  async updateStudentRecord(studentData: any) {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'updateStudentRecord', data: studentData }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating student:', error);
      return { success: false, message: 'Network error' };
    }
  }
};
