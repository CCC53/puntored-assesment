"use client";
import { useState, Suspense } from 'react';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './dashboard.module.css';
import { AuthService } from '../api/services/auth.service';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

const MenuIcon = dynamic(() => import('@mui/icons-material/Menu'), { ssr: false });
const DashboardIcon = dynamic(() => import('@mui/icons-material/Dashboard'), { ssr: false });
const BarChartIcon = dynamic(() => import('@mui/icons-material/BarChart'), { ssr: false });
const LogoutIcon = dynamic(() => import('@mui/icons-material/Logout'), { ssr: false });

const AppBar = dynamic(() => import('@mui/material/AppBar'), { ssr: false });
const Drawer = dynamic(() => import('@mui/material/Drawer'), { ssr: false });
const IconButton = dynamic(() => import('@mui/material/IconButton'), { ssr: false });
const Toolbar = dynamic(() => import('@mui/material/Toolbar'), { ssr: false });
const List = dynamic(() => import('@mui/material/List'), { ssr: false });
const ListItem = dynamic(() => import('@mui/material/ListItem'), { ssr: false });
const ListItemButton = dynamic(() => import('@mui/material/ListItemButton'), { ssr: false });
const ListItemIcon = dynamic(() => import('@mui/material/ListItemIcon'), { ssr: false });
const ListItemText = dynamic(() => import('@mui/material/ListItemText'), { ssr: false });
const Button = dynamic(() => import('@mui/material/Button'), { ssr: false });

const drawerWidth = 240;

const routes = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/dashboard/stats', label: 'Estadísticas', icon: <BarChartIcon /> },
];

const LoadingFallback = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
    </Box>
);

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const router = useRouter();
    const pathname = usePathname();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        setOpen(false);
    };

    return (
        <Box>
            <Suspense fallback={<LoadingFallback />}>
                <AppBar
                    position="fixed"
                    sx={{
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        zIndex: theme.zIndex.drawer + 1
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="primary"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Image
                                src="https://www.bancamia.com.co/wp-content/uploads/2024/10/logo-punto-red-negro-comprimida.png"
                                alt="Logo"
                                width={120}
                                height={70}
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Suspense>

            <Suspense fallback={<LoadingFallback />}>
                <Drawer
                    sx={{
                        width: { xs: '100%', sm: drawerWidth },
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: { xs: '100%', sm: drawerWidth },
                            boxSizing: 'border-box',
                            backgroundColor: theme.palette.background.default,
                            borderRight: { xs: 'none', sm: '1px solid rgba(0, 0, 0, 0.12)' },
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <Toolbar />
                    <Box sx={{ flex: 1, overflowY: 'auto' }}>
                        <List>
                            {routes.map((route) => (
                                <ListItem key={route.path} disablePadding>
                                    <ListItemButton
                                        onClick={() => handleNavigation(route.path)}
                                        sx={{
                                            backgroundColor: pathname === route.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                            },
                                            borderRadius: '8px',
                                            margin: '4px 8px',
                                            padding: '8px 16px',
                                        }}
                                    >
                                        <ListItemIcon>
                                            {route.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={route.label}
                                            sx={{
                                                color: pathname === route.path ? 'primary.main' : 'inherit',
                                                '& .MuiTypography-root': {
                                                    fontWeight: pathname === route.path ? 600 : 400,
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                        <Button
                            variant='contained'
                            className={styles.logout}
                            onClick={() => {
                                AuthService.logout();
                                router.push('/login');
                            }}
                            startIcon={<LogoutIcon className={styles.logoutIcon} />}
                        >
                            Cerrar sesión
                        </Button>
                    </Box>
                </Drawer>
            </Suspense>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    padding: theme.spacing(6),
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    marginLeft: 0,
                    width: '100%',
                    marginBottom: '150px',
                    ...(open && {
                        width: `calc(100% - ${drawerWidth}px)`,
                        marginLeft: `${drawerWidth}px`,
                        transition: theme.transitions.create(['margin', 'width'], {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }),
                }}
            >
                <Toolbar />
                <Suspense fallback={<LoadingFallback />}>
                    {children}
                </Suspense>
                <Box
                    sx={{
                        mt: 'auto',
                        py: { xs: 1.5, sm: 2 },
                        px: { xs: 2, sm: 3 },
                        backgroundColor: 'white',
                        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                        position: 'fixed',
                        bottom: 0,
                        width: '100%',
                        left: 0,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: { xs: 1, sm: 2 },
                        role: 'contentinfo',
                        height: { xs: 'auto', sm: '60px' },
                        minHeight: { xs: '60px', sm: '60px' }
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        width: { xs: '100%', sm: 'auto' },
                        justifyContent: { xs: 'center', sm: 'flex-start' }
                    }}>
                        <Image
                            src="https://www.bancamia.com.co/wp-content/uploads/2024/10/logo-punto-red-negro-comprimida.png"
                            alt="Logo"
                            width={80}
                            height={40}
                            style={{ objectFit: 'contain' }}
                        />
                        <Box sx={{ 
                            borderLeft: '1px solid rgba(0, 0, 0, 0.12)', 
                            height: 24, 
                            display: { xs: 'none', sm: 'block' } 
                        }} />
                    </Box>
                    <Box sx={{ 
                        fontSize: '0.875rem', 
                        color: 'text.secondary',
                        width: { xs: '100%', sm: 'auto' },
                        textAlign: { xs: 'center', sm: 'left' },
                        mt: { xs: 0.5, sm: 0 }
                    }}>
                        &copy; {new Date().getFullYear()} Carlos Calette.
                    </Box>
                </Box>
            </Box>
        </Box>
    );
} 