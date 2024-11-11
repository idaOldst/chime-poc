import { CognitoCompleteNewPasswordDto, CognitoConfirmCodeDto, CognitoDto, CognitoEmailDto, LoginDto, MessageQueueDto } from "@dto";
import ENV from "../config";
import { AxiosConfig } from "./axiosConfig";

const PROCESS_SNS = `?processSNSqueue=${ENV.API_PROCESS_SNS_QUEUE || true}`;

class AuthApi extends AxiosConfig {
    constructor() {
        super(ENV.API_AUTHENTICATION_URL as string, false, false);
    }

    public login = async (params: LoginDto): Promise<MessageQueueDto<LoginDto>> => {
        return await this.axiosInstance.post(`/login${PROCESS_SNS}`, params);
    };

    public createUser = async (params: CognitoDto): Promise<MessageQueueDto<CognitoDto>> => {
        return await this.axiosInstance.post(`/admin-create-user${PROCESS_SNS}`, params);
    }

    public completeNewPassword = async (params: CognitoCompleteNewPasswordDto): Promise<MessageQueueDto<CognitoCompleteNewPasswordDto>> => {
        return await this.axiosInstance.post(`/complete-new-password${PROCESS_SNS}`, params);
    }

    public forgotPassword = async (params: CognitoEmailDto): Promise<MessageQueueDto<CognitoEmailDto>> => {
        return await this.axiosInstance.post(`/forgot-password${PROCESS_SNS}`, params);
    }

    public confirmPasswordCode = async (params: CognitoConfirmCodeDto): Promise<MessageQueueDto<CognitoConfirmCodeDto>> => {
        return await this.axiosInstance.post(`/confirm-password-code${PROCESS_SNS}`, params);
    }

    public resendConfirmationCode = async (params: CognitoEmailDto): Promise<MessageQueueDto<CognitoEmailDto>> => {
        return await this.axiosInstance.post(`/resend-confirmation-code${PROCESS_SNS}`, params);
    }
}

export default new AuthApi();
