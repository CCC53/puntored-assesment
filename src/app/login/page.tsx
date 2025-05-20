"use client"; 
import { useState, Suspense } from 'react';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import { AuthService } from '../api/services/auth.service';
import { ErrorHandler } from '../api/utils/errorHandler';
import { FormValues, FormErrors } from '../types/form.types';
import styles from './page.module.css';

const TextField = dynamic(() => import('@mui/material/TextField'), { ssr: false });
const Button = dynamic(() => import('@mui/material/Button'), { ssr: false });
const Paper = dynamic(() => import('@mui/material/Paper'), { ssr: false });
const FormBox = dynamic(() => import('@mui/material/Box'), { 
    ssr: false,
    loading: () => (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    )
});

export default function Login() {
    const theme = useTheme();
    const [values, setValues] = useState<FormValues>({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState<FormErrors>({
        username: '',
        password: ''
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({
        username: false,
        password: false
    });

    const validateUsername = (username: string): string => {
        if (!username) {
            return 'El username es requerido';
        }
        if (username.length < 3) {
            return 'El username debe tener al menos 3 caracteres';
        }
        if (username.length > 20) {
            return 'El username no puede tener más de 20 caracteres';
        }
        return '';
    };

    const validatePassword = (password: string): string => {
        if (!password) {
            return 'La contraseña es requerida';
        }
        if (password.length < 12) {
            return 'La contraseña debe tener al menos 12 caracteres';
        }
        return '';
    };

    const handleChange = (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValues(prev => ({
            ...prev,
            [field]: value
        }));
        if (touched[field]) {
            const validationFunction = field === 'username' ? validateUsername : validatePassword;
            setErrors(prev => ({
                ...prev,
                [field]: validationFunction(value)
            }));
        }
    };

    const handleBlur = (field: keyof FormValues) => () => {
        setTouched(prev => ({
            ...prev,
            [field]: true
        }));
        const value = values[field];
        const validationFunction = field === 'username' ? validateUsername : validatePassword;
        setErrors(prev => ({
            ...prev,
            [field]: validationFunction(value)
        }));
    };

    const isFormValid = (): boolean => {
        const usernameError = validateUsername(values.username);
        const passwordError = validatePassword(values.password);
        
        return Boolean(
            values.username && 
            values.password && 
            !usernameError && 
            !passwordError
        );
    };

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await AuthService.login({ username: values.username, password: values.password });
            window.location.href = '/dashboard';
        } catch (error) {
            const apiError = ErrorHandler.handle(error as any);
            setErrors(prev => ({
                ...prev,
                general: apiError.message
            }));
        }
    };

    return (
        <FormBox 
            className={styles.loginContainer}
            sx={{
                background: theme.palette.background.default
            }}
        >
            <Paper 
                elevation={3} 
                className={styles.paper}
                sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)'
                    }
                }}
            >
                <Image
                    style={{ 
                        marginBottom: theme.spacing(2),
                        objectFit: 'contain',
                        maxWidth: '200px'
                    }}
                    layout="responsive" 
                    height={50} 
                    width={100}
                    src={"https://www.bancamia.com.co/wp-content/uploads/2024/10/logo-punto-red-negro-comprimida.png"} 
                    alt="Logo"
                />
                <Suspense fallback={
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                        <CircularProgress />
                    </Box>
                }>
                    <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
                        <TextField 
                            className={styles.inputLogin}
                            label="Username" 
                            variant="standard" 
                            placeholder="Ingrese su username" 
                            value={values.username}
                            onChange={handleChange('username')}
                            onBlur={handleBlur('username')}
                            error={touched.username && Boolean(errors.username)}
                            helperText={touched.username && errors.username}
                            fullWidth
                            sx={{
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: theme.palette.primary.main
                                }
                            }}
                        />
                        <TextField 
                            className={styles.inputLogin}
                            label="Password" 
                            variant="standard" 
                            placeholder="Ingrese su password" 
                            type="password"
                            value={values.password}
                            onChange={handleChange('password')}
                            onBlur={handleBlur('password')}
                            error={touched.password && Boolean(errors.password)}
                            helperText={touched.password && errors.password}
                            fullWidth
                            sx={{
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: theme.palette.primary.main
                                }
                            }}
                        />
                        {errors.general && (
                            <Box 
                                sx={{ 
                                    color: theme.palette.error.main,
                                    mt: 2,
                                    textAlign: 'center',
                                    typography: 'body2'
                                }}
                            >
                                {errors.general}
                            </Box>
                        )}
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={!isFormValid()}
                            fullWidth
                            sx={{
                                mt: 4,
                                height: 48,
                                fontSize: theme.typography.button.fontSize,
                                fontWeight: theme.typography.button.fontWeight,
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(218, 23, 123, 0.2)'
                                }
                            }}
                        >
                            Iniciar sesión
                        </Button>
                    </form>
                </Suspense>
            </Paper>
        </FormBox>
    );
}