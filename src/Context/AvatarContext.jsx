import { retrunMyAvatar } from "../api/avatar"
import constants from '../constants';

export async function GetMyAvatar() {
    try {
        const response = await retrunMyAvatar(); 
        const avatarUrl = response ? `${constants.dirApi}/${constants.uploadsFolder}/${response.data.avatar.imageFileName}` : null;
        if (response.status === 200) {
            return {
                status: "success",
                data: avatarUrl
            };
        } else {
            throw new Error(response.data.message || 'No users found');
        }
    } catch (error) {
        return {
            status: "error",
            message: error.message
        };
    }
}