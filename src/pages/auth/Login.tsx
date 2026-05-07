import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authServices';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <input className="border p-2 w-full rounded" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border p-2 w-full rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};