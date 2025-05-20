import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Button, Box, Stack } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LazyCopyBlock } from "./LazyComponents";
import { DialogProps, FieldConfig } from "@/app/types/components.types";
import { cancelFields, paymentFields } from "@/app/types/fields.types";

export default function DynamicForm({ isOpen, formType = 'payment', onClose, onSubmit, selectedRow }: DialogProps) {
    const fields = formType === 'payment' ? paymentFields : cancelFields;

    const [formState, setFormState] = useState<{ values: Record<string, any>; errors: Record<string, string>; touched: Record<string, boolean>; }>({
        values: fields.reduce((acc, field) => ({
            ...acc,
            [field.name]: field.type === 'date' ? null : ''
        }), {}),
        errors: {},
        touched: {}
    });

    const resetForm = () => {
        setFormState({
            values: fields.reduce((acc, field) => ({
                ...acc,
                [field.name]: field.type === 'date' ? null : ''
            }), {}),
            errors: {},
            touched: {}
        });
    };

    const validateField = (field: FieldConfig, value: any): string => {
        if (field.required && !value) {
            return `${field.label} es requerido`;
        }
        if (field.validation) {
            return field.validation(value);
        }
        return '';
    };

    const handleChange = (field: FieldConfig) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null,
        dateValue?: Date | null
    ) => {
        const value = field.type === 'date' ? dateValue : event?.target.value;

        setFormState(prev => {
            const newValues = { ...prev.values, [field.name]: value };
            const error = prev.touched[field.name] ? validateField(field, value) : '';

            return {
                ...prev,
                values: newValues,
                errors: { ...prev.errors, [field.name]: error }
            };
        });
    };

    const handleBlur = (field: FieldConfig) => () => {
        setFormState(prev => ({
            ...prev,
            touched: { ...prev.touched, [field.name]: true },
            errors: {
                ...prev.errors,
                [field.name]: validateField(field, prev.values[field.name])
            }
        }));
    };

    const isFormValid = () => {
        const allErrors = fields.map(field => validateField(field, formState.values[field.name]));
        return !allErrors.some(error => error !== '');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (onSubmit) {
                await onSubmit(formState.values);
                resetForm();
            }
            if (onClose) onClose();
        } catch (error) {
            setFormState(prev => ({
                ...prev,
                errors: { ...prev.errors, general: 'Error al procesar la solicitud. Por favor, intente nuevamente.' }
            }));
        }
    };

    const renderField = (field: FieldConfig) => {
        if (field.type === 'date') {
            return (
                <DatePicker
                    key={field.name}
                    label={field.label}
                    value={formState.values[field.name]}
                    onChange={(newValue) => handleChange(field)(null, newValue)}
                    onClose={() => handleBlur(field)()}
                    slotProps={{
                        textField: {
                            required: field.required,
                            error: formState.touched[field.name] && Boolean(formState.errors[field.name]),
                            helperText: formState.touched[field.name] && formState.errors[field.name]
                        }
                    }}
                />
            );
        }

        return (
            <TextField
                key={field.name}
                required={field.required}
                fullWidth
                label={field.label}
                type={field.type === 'disabled' ? 'text' : field.type}
                placeholder={field.placeholder}
                value={formState.values[field.name]}
                onChange={handleChange(field)}
                onBlur={handleBlur(field)}
                error={formState.touched[field.name] && Boolean(formState.errors[field.name])}
                helperText={formState.touched[field.name] && formState.errors[field.name]}
                disabled={field.type === 'disabled'}
                InputProps={{
                    ...(field.startAdornment && {
                        startAdornment: field.startAdornment
                    })
                }}
            />
        );
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && formType === 'cancel' && selectedRow?.reference) {
            setFormState(prev => ({
                ...prev,
                values: { ...prev.values, reference: selectedRow.reference }
            }));
        }
    }, [formType, isOpen, selectedRow]);

    return (
        <Dialog maxWidth="sm" fullWidth open={isOpen} 
            onClose={() => {
                resetForm();
                if (onClose) onClose();
            }}
        >
            <DialogTitle>
                {formType === 'payment' ? 'Crear Nuevo Pago' : 'Cancelar Pago'}
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        {fields.map(renderField)}
                        {formState.errors.general && (
                            <Box color="error.main">{formState.errors.general}</Box>
                        )}
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button onClick={onClose}>Cancelar</Button>
                            <Button type="submit" variant="contained" color="primary" disabled={!isFormValid()}>
                                {formType === 'payment' ? 'Crear Pago' : 'Confirmar Cancelación'}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}