import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Button, Box, Stack, DialogActions, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Typography } from "@mui/material";
import { DialogProps, FieldConfig } from "@/app/types/components.types";
import { cancelFields, paymentFields } from "@/app/types/fields.types";
import { FormValue, FormValues } from "@/app/types/form.types";
import { LazyCopyBlock } from "./LazyComponents";

export default function DynamicForm({ isOpen, formType = 'payment', onClose, onSubmit, selectedRow, reference, setReference }: DialogProps<FormValue>) {
    const fields = formType === 'payment' ? paymentFields : cancelFields;
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formState, setFormState] = useState<{ values: FormValues; errors: Record<string, string>; touched: Record<string, boolean>; }>({
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
        setShowConfirmation(false);
        setIsSubmitting(false);
    };

    function validateField(field: FieldConfig<FormValue>, value: FormValue) {
        if (field.required && !value) {
            return `${field.label} es requerido`;
        }
        if (field.validation) {
            return field.validation(value);
        }
        return '';
    }

    function handleChange(field: FieldConfig<FormValue>, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null, dateValue?: Date | null) {
        let value: FormValue;
        if (field.type === 'date') {
            value = dateValue ?? null;
        } else {
            value = event?.target.value ?? '';
        }

        if (field.name === 'dueDate' && value instanceof Date) {
            value = new Date(value);
            value.setHours(23, 59, 0, 0);
        }

        setFormState(prev => {
            const newValues = { ...prev.values, [field.name]: value };
            const error = prev.touched[field.name] ? validateField(field, value) : '';

            return {
                ...prev,
                values: newValues,
                errors: { ...prev.errors, [field.name]: error }
            };
        });
    }

    function handleBlur(field: FieldConfig<FormValue>) {
        setFormState(prev => ({
            ...prev,
            touched: { ...prev.touched, [field.name]: true },
            errors: {
                ...prev.errors,
                [field.name]: validateField(field, prev.values[field.name])
            }
        }));
    }

    const isFormValid = () => {
        const allErrors = fields.map(field => validateField(field, formState.values[field.name]));
        return !allErrors.some(error => error !== '');
    };

    const handleOnClose = () => {
        if (onClose) {
            if (formType === 'payment' && setReference) {
                setReference();
            }
            onClose();
        }
        resetForm();
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formType === 'cancel') {
            setShowConfirmation(true);
            return;
        }
        await submitForm();
    };

    const submitForm = async () => {
        try {
            if (formType === 'payment') {
                setIsSubmitting(true);
            }
            if (onSubmit) {
                await onSubmit(formState.values);
                if (formType === 'cancel') {
                    resetForm();
                }
            }
            if (onClose && formType === "cancel") {
                onClose();
            }
        } catch (error) {
            console.log(error);
            setFormState(prev => ({
                ...prev,
                errors: { ...prev.errors, general: 'Error al procesar la solicitud. Por favor, intente nuevamente.' }
            }));
        } finally {
            if (formType === 'payment') {
                setIsSubmitting(false);
            }
        }
    };

    function renderField(field: FieldConfig<FormValue>) {
        if (field.type === 'date') {
            return (
                <DatePicker
                    key={field.name}
                    label={field.label}
                    value={formState.values[field.name] as Date | null}
                    onChange={(newValue) => handleChange(field, null, newValue)}
                    onClose={() => handleBlur(field)}
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
                value={formState.values[field.name] as string}
                onChange={(event) => handleChange(field, event)}
                onBlur={() => handleBlur(field)}
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
    }

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
        <>
            <Dialog maxWidth="sm" fullWidth open={isOpen}
                onClose={() => {
                    resetForm();
                    if (onClose) onClose();
                }}
            >
                <DialogTitle>
                    {formType === 'payment' ? reference ? 'Pago' : 'Crear Nuevo Pago' : 'Cancelar Pago'}
                </DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            {fields.map(renderField)}
                            {
                                reference && <LazyCopyBlock text={reference} />
                            }
                            {formState.errors.general && (
                                <Box color="error.main">{formState.errors.general}</Box>
                            )}
                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button onClick={handleOnClose}>Cancelar</Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={!isFormValid() || reference !== undefined || (formType === 'payment' && isSubmitting)}
                                    startIcon={formType === 'payment' && isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
                                >
                                    {formType === 'payment' ? 'Crear Pago' : 'Confirmar Cancelación'}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Confirmar Cancelación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Está seguro que desea cancelar este pago? Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmation(false)}>No, Cancelar</Button>
                    <Button
                        onClick={() => {
                            setShowConfirmation(false);
                            submitForm();
                        }}
                        variant="contained"
                        color="error"
                    >
                        Sí, Confirmar Cancelación
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}