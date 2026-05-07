import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../../assets/hero.png';
import { register } from '../../services/authServices';

export const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    try {
      await register({ fullName, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <img src={heroImg} className="mx-auto w-32 h-32" alt="Hero" />
        <h1 className="text-2xl font-bold mt-4 text-center">Join Pipelytcs</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <input className="border p-2 w-full rounded" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
          <input className="border p-2 w-full rounded" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border p-2 w-full rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <input className="border p-2 w-full rounded" placeholder="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" type="submit">Create Account</button>
        </form>
        <p className="text-center mt-2 text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
};