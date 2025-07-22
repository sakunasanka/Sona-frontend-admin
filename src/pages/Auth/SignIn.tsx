import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Checkbox, Input } from '../../components/ui';
import API from '../../api/api';


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    try {
      const response = await API.post('/auth/signin', { email, password });


    // 🔍 Check full response
    console.log('Login response:', response.data);


    const token = response.data?.data?.token;


    if (token) {
      localStorage.setItem('token', token);
      console.log('Token stored:', token);
    } else {
      console.warn('Token is missing in the response');
    }
      // Redirect
      navigate('/admin-dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || 'Signin failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-red-200">
      <Card
        title={<span className="block text-center text-3xl font-bold m-8">Sign In</span>}
        className="w-4/12 min-h-[600px] border-stone-500 border-2"
      >
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input type="email" placeholder="Email" label="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" label="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <Checkbox label="Remember email" />


            <Button variant="rounded" className="w-full py-3" type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>


            {error && <p className="text-center text-sm text-red-600">{error}</p>}


            <p className="text-center text-sm text-gray-500 pt-4">
              Do not have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">Sign Up</a><br />
              <a href="/forgot_password" className="text-blue-600 hover:underline">Forgot password</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};


export default SignIn;
