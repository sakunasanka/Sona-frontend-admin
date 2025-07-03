import React from 'react'
import { Button, Card, CardContent,Checkbox, Input } from '../../components/ui'

const SignIn = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-red-200  ">
      
        <Card
        title={<span className="block text-center text-3xl font-bold m-8">Sign In</span>}
        className="w-4/12 min-h-[600px] border-stone-500 border-2"
        >
        <CardContent>
          <form className="space-y-5">
          <Input
            type="text"
            placeholder="User Name"
            label="User Name"
            required
          />
          
          <Input
            type="password"
            placeholder="Password"
            label="Password"
            required
          />

          <Checkbox
            label="Remember user name"
        /> 
           
          <Button variant="rounded" className="w-full py-3 ">
            Sign In
          </Button>

          <p className="text-center text-sm text-gray-500 pt-4">
            Do not have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign Up
            </a><br /> 

            <a href="/forgot_password" className="text-blue-600 hover:underline" >forgot password</a> 
          </p>
          </form>
        </CardContent>
        </Card>
      </div>
       
  )
}

export default SignIn