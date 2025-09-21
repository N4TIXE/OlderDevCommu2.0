// src/components/EditModal.jsx

import React, { useState, useEffect } from 'react';

// isOpen: state บอกว่า modal เปิดอยู่หรือไม่
// onClose: ฟังก์ชันสำหรับปิด modal
// onSave: ฟังก์ชันที่จะทำงานเมื่อกด Save
// title: ชื่อหัวข้อของ modal เช่น "Edit Name"
// fieldName: ชื่อ field ที่จะแก้ไข เช่น "name"
// initialValue: ค่าเริ่มต้นของข้อมูลที่จะแก้ไข
export default function EditModal({ isOpen, onClose, onSave, title, fieldName, initialValue }) {
  const [value, setValue] = useState(initialValue);
  const [password, setPassword] = useState('');

  // อัปเดตค่า value เมื่อ initialValue เปลี่ยน
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(fieldName, value, password);
  };

  return (
    // Backdrop (พื้นหลังสีดำโปร่งแสง)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[2000]">
      {/* กล่อง Modal */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        
        {/* ช่องกรอกข้อมูลที่ต้องการแก้ไข */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-white capitalize" htmlFor={fieldName}>
            New {fieldName}
          </label>
          <input
            type="text"
            id={fieldName}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        {/* ช่องกรอกรหัสผ่านเพื่อยืนยัน */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2 text-white" htmlFor="password">
            Confirm with Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </div>

        {/* ปุ่ม Save และ Cancel */}
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}