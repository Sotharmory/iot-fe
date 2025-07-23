import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://165.232.169.151:3000/api';
const AUTH_HEADER = { headers: { Authorization: 'meichan-auth' } };

type Code = { code: string; type: string; expires_at: string };
type Card = { id: string; enrolled_at: string };
type Log = { method: string; code: string; time: string; success: boolean };

export default function App() {
  const [code, setCode] = useState('');
  const [ttl, setTtl] = useState(300);
  const [type, setType] = useState('otp');
  const [nfcId, setNfcId] = useState('');
  const [message, setMessage] = useState('');

  const [codes, setCodes] = useState<Code[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [logPage, setLogPage] = useState(1);
  const LOG_LIMIT = 20;

  const handleCreateCode = async () => {
    try {
      const res = await axios.post(`${API_URL}/create-code`, { code, ttlSeconds: Number(ttl), type }, AUTH_HEADER);
      setMessage(`Code ${res.data.code} created!`);
      fetchActive();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.error || 'Error creating code');
      } else {
        setMessage('Error creating code');
      }
    }
  };

  const handleDeleteCode = async () => {
    try {
      const res = await axios.post(`${API_URL}/delete-code`, { code }, AUTH_HEADER);
      setMessage(res.data.message);
      fetchActive();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.error || 'Error deleting code');
      } else {
        setMessage('Error deleting code');
      }
    }
  };

  const handleUnlock = async () => {
    try {
      const res = await axios.post(`${API_URL}/unlock`, { code }, AUTH_HEADER);
      setMessage(`Unlocked via ${res.data.method}`);
      fetchLogs(logPage);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.error || 'Unlock failed');
      } else {
        setMessage('Unlock failed');
      }
    }
  };

  const handleEnroll = async () => {
    try {
      const body = nfcId ? { id: nfcId } : {};
      const res = await axios.post(`${API_URL}/enroll`, body, AUTH_HEADER);
      setMessage(res.data.message || `Card ${res.data.id} enrolled`);
      fetchActive();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.error || 'Enroll failed');
      } else {
        setMessage('Enroll failed');
      }
    }
  };

  const handleDisenroll = async () => {
    try {
      const res = await axios.post(`${API_URL}/disenroll`, { id: nfcId }, AUTH_HEADER);
      setMessage(res.data.message);
      fetchActive();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.error || 'Disenroll failed');
      } else {
        setMessage('Disenroll failed');
      }
    }
  };

  const fetchActive = async () => {
    try {
      const [passRes, nfcRes] = await Promise.all([
        axios.get(`${API_URL}/active-passwords`, AUTH_HEADER),
        axios.get(`${API_URL}/active-nfc-cards`, AUTH_HEADER),
      ]);
      setCodes(passRes.data);
      setCards(nfcRes.data);
    } catch (err) {
      console.error('Error fetching active items');
    }
  };

  const fetchLogs = async (page = 1) => {
    try {
      const res = await axios.get(`${API_URL}/logs?page=${page}&limit=${LOG_LIMIT}`, AUTH_HEADER);
      setLogs(res.data);
    } catch (err) {
      console.error('Error fetching logs');
    }
  };

  useEffect(() => {
    const socket = io('http://165.232.169.151:3000');
    fetchActive();
    fetchLogs(logPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    socket.on('password-update', fetchActive);
    socket.on('nfc-update', fetchActive);
    socket.on('log-update', () => {
      // optional: set new logs if you implement log view
      console.log('New unlock attempt');
    });
    socket.on('new-log', (log) => {
      setLogs(prev => [log, ...prev.slice(0, 99)]); // limit to last 100 logs
    });

    return () => {
      socket.disconnect();
    };
  }, [logPage]);



  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-center">
      <h1 className="text-2xl font-bold">ESP32 Access Manager</h1>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Enter 6-digit code or NFC ID"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border rounded p-2 w-full"
        />

        <div className="flex justify-between gap-2">
          <button onClick={handleUnlock} className="bg-blue-500 text-white px-4 py-2 rounded w-1/2">Unlock</button>
          <button onClick={handleDeleteCode} className="bg-red-500 text-white px-4 py-2 rounded w-1/2">Delete Code</button>
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="number"
          value={ttl}
          onChange={(e) => setTtl(Number(e.target.value))}
          className="border rounded p-2 w-full"
          placeholder="TTL in seconds"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="border rounded p-2 w-full">
          <option value="otp">OTP</option>
          <option value="static">Static</option>
        </select>
        <button onClick={handleCreateCode} className="bg-green-500 text-white px-4 py-2 rounded w-full">Create Code</button>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="NFC ID (leave blank to trigger ESP32)"
          value={nfcId}
          onChange={(e) => setNfcId(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <div className="flex justify-between gap-2">
          <button onClick={handleEnroll} className="bg-purple-500 text-white px-4 py-2 rounded w-1/2">Enroll NFC</button>
          <button onClick={handleDisenroll} className="bg-yellow-500 text-white px-4 py-2 rounded w-1/2">Disenroll NFC</button>
        </div>
      </div>

      <div className="text-left mt-6">
        <h2 className="text-xl font-semibold">Active Passwords</h2>
        <table className="table-auto w-full border mt-2 text-sm">
          <thead>
            <tr>
              <th className="border p-2">Code</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Expires At</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.code}>
                <td className="border p-2">{c.code}</td>
                <td className="border p-2">{c.type}</td>
                <td className="border p-2">{new Date(c.expires_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-left mt-6">
        <h2 className="text-xl font-semibold">Enrolled NFC Cards</h2>
        <table className="table-auto w-full border mt-2 text-sm">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Enrolled At</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => (
              <tr key={c.id}>
                <td className="border p-2">{c.id}</td>
                <td className="border p-2">{new Date(c.enrolled_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-left mt-6">
        <h2 className="text-xl font-semibold">Unlock Logs</h2>
        <table className="table-auto w-full border mt-2 text-sm">
          <thead>
            <tr>
              <th className="border p-2">ID / Code</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, i) => (
              <tr key={i}>
                <td className="border p-2">{l.code}</td>
                <td className="border p-2">{new Date(l.time).toLocaleString()}</td>
                <td className={`border p-2 ${l.success ? 'text-green-600' : 'text-red-600'}`}>
                  {l.success ? 'Success' : 'Failed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-2">
          <button
            disabled={logPage === 1}
            onClick={() => setLogPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Prev
          </button>
          <span>Page {logPage}</span>
          <button
            onClick={() => setLogPage((prev) => prev + 1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      </div>

      {message && <div className="mt-4 text-sm text-gray-700">{message}</div>}
    </div>
  );
}