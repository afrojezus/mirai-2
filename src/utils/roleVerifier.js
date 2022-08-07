import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { UserAuthWrapper } from "redux-auth-wrapper";
import { history } from "../store";
import { LoadingScreen } from "../components/layouts";
import { UNAUTHED_REDIRECT } from "../constants";

const locationHelper = locationHelperBuilder({});

export const UserHasPermission = permission =>
  UserAuthWrapper({
    wrapperDisplayName: "UserHasPermission",
    AuthenticatingComponent: LoadingScreen,
    allowRedirectBack: false,
    redirectPath: (state, ownProps) =>
      locationHelper.getRedirectQueryParam(ownProps) || "/setup",
    authenticatingSelector: ({ firebase: { auth, isInitializing, profile } }) =>
      !auth.isLoaded || !profile.isLoaded || isInitializing === true,
    authenticatedSelector: ({ firebase: { auth } }) =>
      auth.isLoaded && !auth.isEmpty,
    redirectAction: newLoc => dispatch => {
      history.replace(newLoc); // or routerActions.replace
      dispatch({ type: UNAUTHED_REDIRECT });
    }
  });
