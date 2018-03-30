import { isEmpty, isLoaded } from "react-redux-firebase";

export const mirLoader = async (firebase, state) => {
  const { auth, isInitializing, profile, updateProfile } = firebase;
  if (
    isInitializing === true ||
    isEmpty(auth) ||
    isEmpty(profile) ||
    !isLoaded(auth) ||
    !isLoaded(profile)
  ) {
    console.log("Loading");
    return false;
  } else {
    console.log("Loading complete");
    console.log("Applying user variables");
    if (profile.role === undefined) updateProfile({ role: "Normal" });
    return true;
  }
};
