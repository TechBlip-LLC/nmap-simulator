import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Wifi, Server, AlertCircle, Info, Network, Code, Layers, Database, Activity, Cpu, Radio, Lock } from 'lucide-react';

interface ScanResult {
  ip: string;
  ports: {
    port: number;
    state: 'open' | 'closed' | 'filtered';
    service: string;
  }[];
  os: string;
}

function App() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [targetIP, setTargetIP] = useState('192.168.1.1');
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [startPort, setStartPort] = useState(1);
  const [endPort, setEndPort] = useState(1024);

  const commonServices: { [key: number]: string } = {
    20: 'ftp-data',
    21: 'ftp',
    22: 'ssh',
    23: 'telnet',
    25: 'smtp',
    53: 'dns',
    80: 'http',
    110: 'pop3',
    143: 'imap',
    443: 'https',
    445: 'microsoft-ds',
    3306: 'mysql',
    3389: 'rdp',
    5432: 'postgresql',
    8080: 'http-proxy'
  };

  const getRandomPortState = () => {
    const states: ('open' | 'closed' | 'filtered')[] = ['open', 'closed', 'filtered'];
    return states[Math.floor(Math.random() * states.length)];
  };

  const getServiceName = (port: number) => {
    return commonServices[port] || 'unknown';
  };

  const simulateScan = () => {
    if (startPort > endPort) {
      alert('Start port must be less than or equal to end port');
      return;
    }

    if (startPort < 1 || endPort > 65535) {
      alert('Ports must be between 1 and 65535');
      return;
    }

    setScanning(true);
    setProgress(0);
    setLogs([]);
    setScanResults([]);

    const totalSteps = 100;
    let currentStep = 0;

    const addLog = (message: string) => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const interval = setInterval(() => {
      currentStep++;
      setProgress(Math.floor((currentStep / totalSteps) * 100));

      if (currentStep === 10) {
        addLog('Starting Nmap 7.94 at ' + new Date().toLocaleString());
        addLog(`Initiating scan against target ${targetIP}`);
        addLog(`Port range: ${startPort}-${endPort}`);
      }

      if (currentStep === 30) {
        addLog('Scanning TCP ports...');
      }

      if (currentStep === 50) {
        addLog('Discovering services...');
        
        const portResults = [];
        for (let port = startPort; port <= endPort; port++) {
          if (Math.random() > 0.7) {
            portResults.push({
              port,
              state: getRandomPortState(),
              service: getServiceName(port)
            });
          }
        }

        setScanResults([
          {
            ip: targetIP,
            ports: portResults,
            os: 'Linux 5.4.x'
          }
        ]);
      }

      if (currentStep === 70) {
        addLog('OS detection attempted...');
      }

      if (currentStep === 90) {
        addLog('Service version detection performed...');
      }

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setScanning(false);
        addLog('Nmap scan completed');
      }
    }, 50);

    return () => clearInterval(interval);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Terminal className="w-8 h-8 text-green-500" />
              <h1 className="text-2xl font-bold">Nmap Simulator</h1>
            </div>
            <button
              onClick={() => setShowArchitecture(!showArchitecture)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
            >
              <Layers className="w-4 h-4" />
              {showArchitecture ? 'Hide Architecture' : 'Show Architecture'}
            </button>
          </div>

          {showArchitecture && (
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <h2 className="text-lg font-semibold">Nmap Architecture</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Core Engine
                  </h3>
                  <p className="text-sm">
                    • Raw packet creation
                    <br />
                    • Host discovery module
                    <br />
                    • Port scanning engine
                    <br />
                    • Parallel scanning system
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    Network Stack
                  </h3>
                  <p className="text-sm">
                    • TCP/IP implementation
                    <br />
                    • Raw socket handling
                    <br />
                    • Protocol libraries
                    <br />
                    • Response analysis
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    NSE (Nmap Scripting Engine)
                  </h3>
                  <p className="text-sm">
                    • Lua script interpreter
                    <br />
                    • Vulnerability scanning
                    <br />
                    • Service detection
                    <br />
                    • Custom script support
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-blue-400 mb-2">Data Flow</h3>
                <p className="text-sm">
                  1. Core Engine initiates target discovery
                  <br />
                  2. Network Stack sends/receives packets
                  <br />
                  3. Response data analyzed by Core Engine
                  <br />
                  4. NSE runs scripts on discovered services
                  <br />
                  5. Results aggregated and reported
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <h2 className="text-lg font-semibold">What is Nmap?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <Network className="w-4 h-4" />
                    Port Scanning
                  </h3>
                  <p className="text-sm">
                    Nmap sends packets to ports (1-65535) to determine if they're:
                    <br />
                    • <span className="text-green-400">Open</span>: Actively accepting connections
                    <br />
                    • <span className="text-red-400">Closed</span>: Accessible but no service running
                    <br />
                    • <span className="text-yellow-400">Filtered</span>: Blocked by firewall
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Service Detection
                  </h3>
                  <p className="text-sm">
                    For open ports, Nmap:
                    <br />
                    • Probes for service name (HTTP, SSH, etc.)
                    <br />
                    • Identifies service versions
                    <br />
                    • Detects security issues
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    OS Detection
                  </h3>
                  <p className="text-sm">
                    Nmap analyzes network responses to:
                    <br />
                    • Identify operating system
                    <br />
                    • Detect OS version
                    <br />
                    • Find system architecture
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Security Notes
                  </h3>
                  <p className="text-sm">
                    Important considerations:
                    <br />
                    • Scanning without permission is illegal
                    <br />
                    • Can trigger security alerts
                    <br />
                    • Best used for authorized testing
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={targetIP}
                  onChange={(e) => setTargetIP(e.target.value)}
                  className="bg-gray-700 text-gray-100 px-4 py-2 rounded-md flex-grow"
                  placeholder="Enter target IP"
                />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Start Port</label>
                  <input
                    type="number"
                    min="1"
                    max="65535"
                    value={startPort}
                    onChange={(e) => setStartPort(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-700 text-gray-100 px-4 py-2 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">End Port</label>
                  <input
                    type="number"
                    min="1"
                    max="65535"
                    value={endPort}
                    onChange={(e) => setEndPort(parseInt(e.target.value) || 1)}
                    className="w-full bg-gray-700 text-gray-100 px-4 py-2 rounded-md"
                  />
                </div>
              </div>

              <button
                onClick={simulateScan}
                disabled={scanning}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-2 rounded-md flex items-center gap-2 justify-center"
              >
                <Shield className="w-4 h-4" />
                {scanning ? 'Scanning...' : 'Start Scan'}
              </button>
            </div>

            {scanning && (
              <div className="mt-4">
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">Progress: {progress}%</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Scan Logs
              </h2>
              <div className="bg-black rounded-md p-4 h-80 overflow-y-auto font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="text-green-400">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Server className="w-5 h-5" />
                Scan Results
              </h2>
              <div className="space-y-4">
                {scanResults.map((result, index) => (
                  <div key={index} className="bg-gray-700 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi className="w-4 h-4" />
                      <span className="font-mono">{result.ip}</span>
                    </div>
                    <div className="text-sm">
                      <p className="mb-2">OS: {result.os}</p>
                      <div className="space-y-1">
                        {result.ports.map((port, portIndex) => (
                          <div
                            key={portIndex}
                            className={`flex items-center gap-2 ${
                              port.state === 'open'
                                ? 'text-green-400'
                                : port.state === 'filtered'
                                ? 'text-yellow-400'
                                : 'text-red-400'
                            }`}
                          >
                            <AlertCircle className="w-3 h-3" />
                            <span>
                              Port {port.port} ({port.service}): {port.state}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-900 py-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-400">Copyright © 2025 Ed Bates (TECHBLIP LLC)</p>
          <p className="text-gray-500 text-sm mt-2">This software is released under the Apache-2.0 License. See the LICENSE file for details</p>
        </div>
      </footer>
    </div>
  );
}

export default App;