import {returnAllUsers} from "../api/auth"

export async function returnUsers() {
    try {
        const response = await returnAllUsers();
        if (response.status === 200) {
            return {
                status: "success",
                data: response.data.user
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
