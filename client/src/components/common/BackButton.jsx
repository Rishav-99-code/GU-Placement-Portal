import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ to, className = "" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      onClick={handleBack}
      variant="ghost"
      className={`flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 ${className}`}
    >
      <ArrowLeft size={16} />
      Back
    </Button>
  );
};

export default BackButton;