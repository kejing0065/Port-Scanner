from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import socket
from concurrent.futures import ThreadPoolExecutor
from typing import List
from pydantic import BaseModel


class ScanRequest(BaseModel):
    target: str
    start_port: int
    end_port: int

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

def port_scanner(target, port):

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)
    try:
        result = s.connect_ex((target, port))

        if result == 0:
            return port
        else:
            return None
    finally:
        s.close()


@app.post("/scan")
async def start_scan(request_data: ScanRequest):
    target = request_data.target
    start_port = request_data.start_port
    end_port = request_data.end_port

    open_ports = []
    opened = 0
    closed = 0

    with ThreadPoolExecutor(max_workers = 100) as executor:
        results = [executor.submit(port_scanner, target, port) for port in range(start_port, end_port + 1)]

        for r in results:
            res = r.result()
            if res:
                print("Port", res, " is open.")
                open_ports.append(res)
                opened += 1
            else:
                closed += 1

        print("Total Opened port(s): ", opened)
        print("Total Closed port(s): ", closed)
        print("Open ports:", open_ports)

    return {
        "status": "Scan completed",
        "target": target,
        "open_ports": open_ports,
        "opened": opened,
        "closed": closed
    }