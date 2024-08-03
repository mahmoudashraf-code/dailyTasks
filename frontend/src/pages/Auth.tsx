import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPassword, setJoinPassword] = useState('');

  const validateSignIn = () => {
    if (!signInEmail || !signInPassword) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields for sign in.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const validateJoin = () => {
    if (!joinName || !joinEmail || !joinPassword) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields to create an account.',
        variant: 'destructive',
      });
      return false;
    }
    // Add email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(joinEmail)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateSignIn()) return; // Validate before proceeding

    try {
      const response = await axios.post('/api/auth/login', {
        email: signInEmail,
        password: signInPassword,
      });
      saveAndNavigate(response.data.token);
    } catch (error) {
      toast({
        title: 'Daily Tasks',
        description: 'Failed to sign in. Please check your credentials.',
        variant: 'destructive',
      });
    }
  };

  const handleJoin = async () => {
    if (!validateJoin()) return; // Validate before proceeding

    try {
      const response = await axios.post('/api/auth/join', {
        name: joinName,
        email: joinEmail,
        password: joinPassword,
      });
      saveAndNavigate(response.data.token);
    } catch (error) {
      toast({
        title: 'Daily Tasks',
        description: 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const saveAndNavigate = async (token: string) => {
    localStorage.setItem('token', token); // Store JWT token
    navigate('/app'); // Redirect to the app
    axios.defaults.headers['authorization'] = `Bearer ${token}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Tabs defaultValue="signin" className="w-[500px] p-6 bg-white rounded-lg shadow-lg">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="signin" className="py-2">
            Sign In
          </TabsTrigger>
          <TabsTrigger value="join" className="py-2">
            Join
          </TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Access your account by signing in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signInEmail">Email</Label>
                <Input
                  id="signInEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signInPassword">Password</Label>
                <Input
                  id="signInPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full" onClick={handleSignIn}>
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="join">
          <Card>
            <CardHeader>
              <CardTitle>Join</CardTitle>
              <CardDescription>Create a new account to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="joinName">Name</Label>
                <Input
                  id="joinName"
                  placeholder="Enter your name"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinEmail">Email</Label>
                <Input
                  id="joinEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={joinEmail}
                  onChange={(e) => setJoinEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinPassword">Password</Label>
                <Input
                  id="joinPassword"
                  type="password"
                  placeholder="Create a password"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleJoin}>
                Create Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
