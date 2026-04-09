import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { RiCloseLine, RiLoader2Line } from "react-icons/ri";
import { assetSchema } from '../../schemas/assetValidation.js';

const AssetModal = ({ 
  isOpen, 
  onClose, 
  initialData = {}, 
  onSave, 
  employees = [],
  saving,
  editingAsset 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              {editingAsset ? "Edit Asset" : "New Asset"}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource identification</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-rose-50 rounded-full transition-all text-slate-400 hover:text-rose-500"
            disabled={saving}
          >
            <RiCloseLine size={28} />
          </button>
        </div>
        
        <Formik
initialValues={{
            name: initialData?.name || '',
            category: initialData?.category || '',
            status: initialData?.status || 'Available',
            serialNumber: initialData?.serialNumber || '',
            purchaseDate: initialData?.purchaseDate ? initialData.purchaseDate.split('T')[0] : '',
            assignedTo: initialData?.assignedTo?._id || initialData?.assignedTo || '',
            location: initialData?.location || '',
            notes: initialData?.notes || ''
          }}
          validateOnChange={true}
          validateOnBlur={true}
          validationSchema={assetSchema}
          enableReinitialize={true}
          onSubmit={onSave}
        >
          {({ errors, touched, isValid, dirty, isSubmitting }) => {
            const isSaving = saving || isSubmitting;

            return (
              <Form className="space-y-6 relative">
                {isSaving && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-[2rem] bg-white/90 backdrop-blur-sm">
                    <div className="animate-pulse space-y-3">
                      <div className="h-12 bg-slate-200 rounded-xl w-48 mx-auto"></div>
                      <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
                    </div>
                  </div>
                )}

                <fieldset disabled={isSaving} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">
                      Asset Name *
                    </label>
                    <Field 
                      name="name"
                      className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold outline-none transition-all ${
                        errors.name && touched.name 
                          ? 'border-rose-300 bg-rose-50' 
                          : 'border-slate-100 focus:border-blue-500 focus:bg-white'
                      }`}
                      placeholder="e.g. MacBook Pro M3"
                    />
                    <ErrorMessage name="name" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Category *</label>
                      <Field as="select" name="category" className={`w-full px-4 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-600 outline-none ${
                        errors.category && touched.category 
                          ? 'border-rose-300 bg-rose-50' 
                          : 'border-slate-100 focus:border-blue-500 focus:bg-white'
                      }`}>
                        <option value="">Select Category</option>
                        <option value="IT Asset">IT Asset</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Office Supplies">Office Supplies</option>
                      </Field>
                      <ErrorMessage name="category" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Status *</label>
                      <Field as="select" name="status" className={`w-full px-4 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-600 outline-none ${
                        errors.status && touched.status 
                          ? 'border-rose-300 bg-rose-50' 
                          : 'border-slate-100 focus:border-blue-500 focus:bg-white'
                      }`}>
                        <option value="Available">Available</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Damaged">Damaged</option>
                        <option value="Disposed">Disposed</option>
                      </Field>
                      <ErrorMessage name="status" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Assigned Employee</label>
                    <Field as="select" name="assignedTo" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all">
                      <option value="">No Assignment</option>
{employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>{emp.name || 'N/A'} ({emp.designation || 'N/A'})</option>
                      ))}
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Serial Number</label>
                      <Field 
                        name="serialNumber"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all"
                        placeholder="Optional"
                      />
                      <ErrorMessage name="serialNumber" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Purchase Date</label>
                      <Field 
                        type="date"
                        name="purchaseDate"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all"
                      />
                      <ErrorMessage name="purchaseDate" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Location</label>
                    <Field 
                      name="location"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all"
                      placeholder="e.g. Floor 2, Room B12"
                    />
                    <ErrorMessage name="location" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Notes</label>
                    <Field 
                      as="textarea" 
                      name="notes"
                      rows="3"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:bg-white outline-none transition-all resize-none"
                      placeholder="Additional information..."
                    />
                    <ErrorMessage name="notes" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                  </div>
                </fieldset>

                <div className="flex gap-4 mt-10">
                  <button 
                    type="button"
                    onClick={onClose} 
                    className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all" 
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`flex-[2] py-4 font-bold rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 ${
                      isValid && dirty && !isSaving 
                        ? 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700' 
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                    disabled={!isValid || !dirty || isSaving}
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 bg-slate-200 rounded-full animate-spin"></div>
                          <span>{editingAsset ? 'Updating...' : 'Saving...'}</span>
                        </div>
                      </span>
                    ) : (
                      editingAsset ? 'Update Asset' : 'Create Asset'
                    )}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AssetModal;
