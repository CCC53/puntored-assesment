import { Chip, ChipProps } from "@mui/material";
import { ChipStatusProps } from "@/app/types/components.types";

export default function ChipStatus({ value }: ChipStatusProps) {
    const statusMap: Record<string, { label: string; color: ChipProps['color'] }> = {
        '01': { label: 'Creado', color: 'info' },
        '02': { label: 'Pagado', color: 'success' },
        '03': { label: 'Cancelado', color: 'error' },
        '04': { label: 'Expirado', color: 'warning' },
    };

    const getStatusDetails = (value: string): { label: string; color: ChipProps['color'] } => {
        return statusMap[value] ?? { label: value, color: 'default' };
    };

    return <Chip label={getStatusDetails(value).label} color={getStatusDetails(value).color} />;
}