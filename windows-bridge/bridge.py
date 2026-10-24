"""
Hamouda XTools Windows Bridge — safe diagnostic prototype.
Lists Android devices visible through ADB (if installed and USB debugging is authorized).
MTP alone does not expose model/build properties to ordinary web pages.
This prototype does not flash, erase, bypass locks, or write device partitions.
"""
from __future__ import annotations
import json, shutil, subprocess, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

HOST = "127.0.0.1"
PORT = 8765
TOKEN = None

def run_adb(*args):
    adb = shutil.which("adb")
    if not adb:
        return {"available": False, "error": "ADB غير موجود. ثبّت Android Platform Tools إذا أردت تشخيص ADB."}
    try:
        p = subprocess.run([adb, *args], capture_output=True, text=True, timeout=8, encoding="utf-8", errors="replace")
        return {"available": True, "returncode": p.returncode, "stdout": p.stdout[:12000], "stderr": p.stderr[:4000]}
    except Exception as e:
        return {"available": False, "error": str(e)}

def get_devices():
    result = run_adb("devices", "-l")
    if not result.get("available") or result.get("returncode") != 0:
        return result
    devices = []
    for line in result.get("stdout", "").splitlines()[1:]:
        line = line.strip()
        if not line:
            continue
        parts = line.split()
        if len(parts) >= 2:
            devices.append({"serial": parts[0], "state": parts[1], "details": " ".join(parts[2:])[:500]})
    return {"available": True, "devices": devices}

class Handler(BaseHTTPRequestHandler):
    def _send(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "https://mahmoudhamouda564-droid.github.io")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)
    def do_OPTIONS(self):
        self._send(204, {})
    def do_GET(self):
        if self.client_address[0] not in ("127.0.0.1", "::1"):
            self._send(403, {"error":"local only"}); return
        path = urlparse(self.path).path
        if path == "/health":
            self._send(200, {"service":"Hamouda XTools Bridge","version":"0.1.0","localOnly":True})
        elif path == "/devices":
            self._send(200, get_devices())
        else:
            self._send(404, {"error":"not found"})
    def log_message(self, fmt, *args):
        print("[Bridge]", fmt % args)

if __name__ == "__main__":
    print("Hamouda XTools Bridge — local diagnostic only")
    print(f"Listening on http://{HOST}:{PORT}")
    print("Keep this running only while you use the website. Ctrl+C to stop.")
    try:
        ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
    except KeyboardInterrupt:
        print("\\nBridge stopped.")
