// import { getUserDetailsByEmail, patchUserDetails } from "@web-app/api/user";
import { AuthRequestDto } from '@dto';
import { ROUTES, STORAGE_KEY } from '@utils/config/constants';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useStore } from '../state-management';
// import { ResponseDto } from '@dto';

export type AuthResponse = {
    email: string,
    data: {
        AuthenticationResult: {
            AccessToken: string,
            IdToken: string,
            RefreshToken: string
        }
    }
};

const useAuth = () => {
    const router = useRouter();

    const updateAuthedUser = useStore((state) => state.updateAuthedUser);
    const removeEventReference = useStore(state => state.removeEventReference);
    const resetAll = useStore(state => state.resetAll);
    const setFlashNotification = useStore(state => state.setFlashNotification);

    // Used for logging and setting new password for NEW_PASSWORD_REQUIRED
    const authenticationUser = async (resp: AuthRequestDto, referenceId: string, isSettingNewPassword?: boolean, shouldUpdate?: boolean) => {

        updateAuthedUser({
            email: resp.email
        });

        if (resp.data?.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
            Cookies.set(STORAGE_KEY.COGNITO_SESSION, resp.data?.Session as string);
            router.push(ROUTES.AUTH_COMPLETE_PROFILE);

            return;
        }

        if (!isSettingNewPassword) {
            setFlashNotification({
                message: 'Sucessfully logged in',
                alertType: 'success'
            })
        } else {
            setFlashNotification({
                title: 'Sucessfully completed new password',
                message: 'User logging in...',
                alertType: 'success'
            })
            Cookies.remove(STORAGE_KEY.COGNITO_SESSION);
        }

        Cookies.set(STORAGE_KEY.ACCESS_TOKEN, resp.data?.AuthenticationResult?.AccessToken as string);
        Cookies.set(STORAGE_KEY.REFRESH_TOKEN, resp.data?.AuthenticationResult?.RefreshToken as string);
        Cookies.set(STORAGE_KEY.SESSION_ID, referenceId);

        // const { email, firstName, lastName } = data;
        // let userDetails: ProfileData = {};

        // TODO update user details if needed
        // ({ data: userDetails } = await getUserDetailsByEmail(email));

        if (shouldUpdate) {
            //     ({ data: userDetails } = await patchUserDetails({
            //         id: userDetails.id,
            //         firstName,
            //         lastName
            //     }))
        }

        router.replace(ROUTES.DASHBOARD);
        removeEventReference(referenceId);
    };

    const clearUserDetails = () => {
        Cookies.remove(STORAGE_KEY.ACCESS_TOKEN);
        Cookies.remove(STORAGE_KEY.REFRESH_TOKEN);
        resetAll();
    }

    return { authenticationUser, clearUserDetails };
};

export default useAuth;
