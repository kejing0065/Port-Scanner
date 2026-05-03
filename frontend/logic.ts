import { useState } from 'react';

interface ScanResponse {
    status: string;
    target: string;
    open_ports: number[];
    opened: number;
    closed: number;
}

export const useScanner = () => {
    const [result, setResult] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);


    const startScan = async (ip: string, start_port: number, end_port: number) => {
        setLoading(true);
        setResult([]);

        try {
            const response = await fetch('http://localhost:8000/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    target: ip,
                    start_port: start_port,
                    end_port: end_port,
                })
            });

            if (!response.ok) {
                throw new Error("Server unavailable");
            }

            const data: ScanResponse = await response.json();
            setResult(data.open_ports);

        } catch(err) {
            console.error('Error:', err);
        }
        setLoading(false);
    };

    return { result, loading, startScan };
};