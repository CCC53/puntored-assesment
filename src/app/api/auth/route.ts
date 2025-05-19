import { NextResponse } from 'next/server';
import { API_CONFIG } from '../config';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const response = await fetch(`${API_CONFIG.BASE_URL}/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 