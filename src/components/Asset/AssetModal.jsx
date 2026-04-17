import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { RiCloseLine, RiLoader2Line, RiArchiveLine } from "react-icons/ri";
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

  const handleClose = (isSubmitting) => {
    if (isSubmitting || saving) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in duration-200 flex flex-col max-h-[90vh] sm:max-h-[95vh] overflow-hidden">

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
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${editingAsset ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                      <RiArchiveLine size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-800 tracking-tight leading-tight">
                        {editingAsset ? "Edit Asset" : "New Asset"}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource identification</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleClose(isSubmitting)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-rose-500 disabled:opacity-40"
                    disabled={isSaving}
                  >
                    <RiCloseLine size={22} />
                  </button>
                </div>

                <Form className="flex-1 flex flex-col overflow-hidden">
                  {/* Scrollable content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-5 relative">
                    {isSaving && (
                      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/90 backdrop-blur-sm">
                        <div className="animate-pulse space-y-3">
                          <div className="h-12 bg-slate-200 rounded-xl w-48 mx-auto"></div>
                          <div className="h-4 bg-slate-200 rounded w-32 mx-auto"></div>
                        </div>
                      </div>
                    )}

                    <fieldset disabled={isSaving} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                          Asset Name *
                        </label>
                        <Field
                          name="name"
                          className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium outline-none transition-all focus:bg-white ${
                            errors.name && touched.name
                              ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                              : 'border-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                          }`}
                          placeholder="e.g. MacBook Pro M3"
                        />
                        <ErrorMessage name="name" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category *</label>
                          <Field as="select" name="category" className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-600 outline-none transition-all focus:bg-white ${
                            errors.category && touched.category
                              ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                              : 'border-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
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
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status *</label>
                          <Field as="select" name="status" className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl text-sm font-medium text-slate-600 outline-none transition-all focus:bg-white ${
                            errors.status && touched.status
                              ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                              : 'border-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
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
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assigned Employee</label>
                        <Field as="select" name="assignedTo" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all">
                          <option value="">No Assignment</option>
                          {Array.isArray(employees) && employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>{emp.name || 'N/A'} ({emp.designation || 'N/A'})</option>
                          ))}
                        </Field>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Serial Number</label>
                          <Field
                            name="serialNumber"
                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Optional"
                          />
                          <ErrorMessage name="serialNumber" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Purchase Date</label>
                          <Field
                            type="date"
                            name="purchaseDate"
                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          />
                          <ErrorMessage name="purchaseDate" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
                        <Field
                          name="location"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                          placeholder="e.g. Floor 2, Room B12"
                        />
                        <ErrorMessage name="location" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Notes</label>
                        <Field
                          as="textarea"
                          name="notes"
                          rows="3"
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                          placeholder="Additional information..."
                        />
                        <ErrorMessage name="notes" component="div" className="text-rose-500 text-xs mt-1 ml-1 font-medium" />
                      </div>
                    </fieldset>
                  </div>

                  {/* Footer — sticky, outside scroll */}
                  <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleClose(isSubmitting)}
                      className="flex-1 py-3 font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition-all disabled:opacity-50"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 py-3 font-bold rounded-xl text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 ${
                        isValid && dirty && !isSaving
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                      disabled={!isValid || !dirty || isSaving}
                    >
                      {isSaving ? (
                        <span className="flex items-center justify-center gap-2">
                          <RiLoader2Line className="animate-spin" size={16} />
                          <span>{editingAsset ? 'Updating...' : 'Saving...'}</span>
                        </span>
                      ) : (
                        editingAsset ? 'Update Asset' : 'Create Asset'
                      )}
                    </button>
                  </div>
                </Form>
              </>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AssetModal;
