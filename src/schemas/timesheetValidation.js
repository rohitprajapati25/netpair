import * as Yup from 'yup';

export const timesheetValidationSchema = Yup.object({
  date: Yup.date().required('Date required').max(new Date(), 'Cannot log future hours'),
  project_id: Yup.string().required('Project required'),
  task_id: Yup.string().optional(),
  hours_worked: Yup.number()
    .min(0, 'Hours must be positive')
    .max(24, 'Max 24 hours/day')
    .required('Hours worked required'),
  work_description: Yup.string()
    .min(10, 'Minimum 10 characters')
    .max(2000, 'Max 2000 characters')
    .required('Work description required')
});

export const timesheetApprovalSchema = Yup.object({
  status: Yup.string().oneOf(['Approved', 'Rejected']).required(),
  rejection_reason: Yup.string().when('status', {
    is: 'Rejected',
    then: (schema) => schema.min(10).required('Rejection reason required'),
    otherwise: (schema) => schema.notRequired()
  })
});

