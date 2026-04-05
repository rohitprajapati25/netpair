import * as yup from 'yup';

export const assetSchema = yup.object({
  name: yup
    .string()
    .required('Asset name is required')
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  category: yup
    .string()
    .required('Category required')
    .oneOf(['IT Asset', 'Furniture', 'Electronics', 'Office Supplies'], 'Invalid category'),
  status: yup
    .string()
    .required('Status required')
    .oneOf(['Available', 'Assigned', 'Damaged', 'Disposed'], 'Invalid status'),
  serialNumber: yup
    .string()
    .trim()
    .max(50, 'Serial number too long')
    .nullable(),
  purchaseDate: yup
    .date()
    .nullable()
    .max(new Date(), 'Future dates not allowed'),
  assignedTo: yup
    .string()
    .nullable(),
  location: yup
    .string()
    .trim()
    .max(100, 'Location too long')
    .nullable(),
  notes: yup
    .string()
    .trim()
    .max(1000, 'Notes too long')
    .nullable()
});

export default assetSchema;
