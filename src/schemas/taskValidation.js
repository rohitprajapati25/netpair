import * as Yup from 'yup';

export const taskValidationSchema = Yup.object({
  task_title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title too long')
    .required('Task title is required'),
  project_id: Yup.string().required('Project is required'),
  assigned_to: Yup.string().required('Assignee is required'),
  description: Yup.string().max(2000, 'Description too long'),
  priority: Yup.string().oneOf(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
  start_date: Yup.date()
    .required('Start date required')
    .max(new Date(), 'Start date cannot be in future'),
  due_date: Yup.date()
    .required('Due date required')
    .min(Yup.ref('start_date'), 'Due date must be after start date')
});

export const taskStatusSchema = Yup.object({
  status: Yup.string().required('Status required'),
  progress: Yup.number().min(0).max(100).optional(),
  comments: Yup.string().optional()
});

