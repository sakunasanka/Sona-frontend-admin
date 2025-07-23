import React from 'react'
import { Button, Card, CardContent, Input } from '../../components/ui'
 
const SignUp = () => {
  return (
    // <div>SignUp</div>
    <div className="flex justify-center items-center min-h-screen bg-red-200  ">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-7xl w-full">
      {/* Image Side */}
      <div className="md:w-2/3 hidden md:block">
        <img
          src="/assets/images/signup.jpg"
          alt="Sign Up"
          className="object-cover min-h-[350px] min-w-[150px] m-40  "
        //   onError={(e) => {
        // (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x600?text=Sign+Up";
        //   }}
        />
      </div>
      {/* Card Side */}
      <div className="w-full md:w-1/2 flex items-center  min-h-[700px]">
        <Card
        title={<span className="block text-center text-3xl font-bold m-8">Sign Up</span>}
        className="w-full min-h-[700px] border-stone-500 border-2"
        >
        <CardContent>
          <form className="space-y-5">
          <Input
            type="text"
            placeholder="Full Name"
            label="Full Name"
            required
          />
          <Input
            type="email"
            placeholder="Email Address"
            label="Email Address"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            label="Password"
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            label="Confirm Password"
            required
          />
          <Button variant="rounded" className="w-full py-3">
            Sign Up
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Log In
            </a></p>
          </form>
        </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}

export default SignUp