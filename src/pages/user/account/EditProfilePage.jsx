import { useNavigate } from 'react-router-dom';
import EditProfileForm from './EditProfileForm';

export default function EditProfilePage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/user/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <EditProfileForm onClose={handleClose} />
      </div>
    </div>
  );
}
