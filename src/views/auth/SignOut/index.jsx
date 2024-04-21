import { signOut as firebaseSignOut } from 'firebase/auth';
import firebaseAuth from 'lib/firebase';import { useNavigate } from 'react-router-dom'; // Assuming React Router v6

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
      navigate('/auth/sign-in'); // Redirect after signOut
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div onClick={handleSignOut}>
      {/* Your logout UI elements */}
    </div>
  );
};

export default SignOut;

