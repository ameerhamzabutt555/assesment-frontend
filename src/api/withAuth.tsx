"use client"; // Ensure this is a Client Component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateToken } from './auth';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const WithAuth: React.FC = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); // New state to handle loading

    useEffect(() => {
      const token = localStorage.getItem('token'); // Get the token





      const validateUserToken = async (token:string) => {
        try {
          const userData = await validateToken(token); // Await the validation
          localStorage.setItem('userId', userData);
          // localStorage.setItem('userId', userData.data.decoded.userId);
          setIsLoading(false); // Stop loading once the token is verified
        } catch (error) {
          console.error("Token validation error:", error);
          router.push('/'); // Redirect to login if token is invalid
        }}
      
      

      if (!token) {
        router.push('/'); // Redirect to login page if no token is found
      } else {
        validateUserToken(token); // Validate the toke
        // localStorage.setItem('userId', validateUserToken.data.decoded.userId);
        setIsLoading(false); // Stop loading once the token is verified
      }
    }, [router]);

    if (isLoading) {
      return null; // Render nothing or a spinner while checking auth
    }

    return <WrappedComponent {...props} />; // Render the wrapped component if authenticated
  };

  return WithAuth;
};

export default withAuth;
