'use client';
import dynamic from 'next/dynamic';

export const LazyChipStatus = dynamic(() => import('./ChipStatus'), { ssr: false });
export const LazyInfoRow = dynamic(() => import('./InfoRow'), { ssr: false });
export const LazyModalInformation = dynamic(() => import('./ModalInformation'), { ssr: false });
export const LazyPaymentFilters = dynamic(() => import('./PaymentFilters'), { ssr: false });
export const LazyPaymentsTable = dynamic(() => import('./PaymentsTable'), { ssr: false });
export const LazyDynamicForm = dynamic(() => import('./DynamicForm'), { ssr: false });
export const LazyCopyBlock = dynamic(() => import('./CopyBlock'), { ssr: false }); 
export const LazyPaymentStatsChart = dynamic(() => import('./PaymentStatsChart'), { ssr: false });
export const LazyLoadingOverlay = dynamic(() => import('./LoadingOverlay'), { ssr: true });
export const LazyNoDataInfo = dynamic(() => import('./NoDataInfo'), { ssr: true });