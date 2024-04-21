import { useEffect } from 'react';
import { auth } from 'lib/firebase'; // Assuming you have initialized Firebase auth

const SignOut = () => {
  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await auth.signOut();
        // Redirect to sign-in page after sign-out
        window.location.href = "/auth/sign-in";
      } catch (error) {
        console.error('Error signing out:', error.message);
      }
    };

    handleSignOut();
  }, []);

  return null; // No need to render anything
};

export default SignOut;
