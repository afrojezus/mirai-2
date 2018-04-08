import { isEmpty, isLoaded } from 'react-redux-firebase';

export const mirLoader = async (firebase) =>
{
  const {
    auth, isInitializing, profile, updateProfile,
  } = firebase;
  if (
    isInitializing === true ||
    isEmpty(auth) ||
    isEmpty(profile) ||
    !isLoaded(auth) ||
    !isLoaded(profile)
  )
  {
    console.log('Loading');
    return false;
  }
  console.log('Loading complete');
  console.log('Applying user variables');
  if (profile.role === undefined) updateProfile({ role: 'Normal' });
  return true;
};

export default mirLoader;
