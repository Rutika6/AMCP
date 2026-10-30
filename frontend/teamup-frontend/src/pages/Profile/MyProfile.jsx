import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import ProfileCard from '../../components/profile/ProfileCard';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import ErrorState from '../../components/common/ErrorState';
import { useFetch } from '../../hooks/useFetch';
import { profileService } from '../../services/profileService';

export default function MyProfile() {
  const { data: profile, loading, error, refetch } = useFetch(() => profileService.getMyProfile(), []);

  return (
    <MainLayout>
      <h1>My Profile</h1>
      {loading ? <Loader /> : error || !profile ? <ErrorState message="Unable to load your profile." onRetry={refetch} /> : (
        <>
          <ProfileCard profile={profile} />
          <div style={{ marginTop: 16 }}>
            <Link to="/profile/edit">
              <Button>Edit Profile</Button>
            </Link>
          </div>
        </>
      )}
    </MainLayout>
  );
}
