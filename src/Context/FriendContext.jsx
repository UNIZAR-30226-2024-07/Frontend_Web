import {
    PendingFriend,
    eliminateFriend,
    addFriend,
    returnListFriend,
    acceptFriend,
    rejectFriend,
    returnAllReceivedFriends
  } from "../api/friend";

import { returnAvatarByID } from "../api/avatar"

  import constants from '../constants';
  
  export async function returnFriends() {
    try {
      const response = await returnListFriend();
      console.group("la respuesta ha sido: " , response.status);
      console.log("El resultado de la lista de amigos es: " ,response);
      if (response.status === 200) {
        console.log("El resultado de la lista de amigos es: " ,response.data.friend);
        return {
          status: "success",
          data: response.data.friend
        };
      } else {
        console.log("HE DADO UN ERROR");
        throw new Error(response.data.message || 'No users found');
      }
    } catch (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  }
  
  export async function returnPendingFriends() {
    try {
      const response = await PendingFriend();
      console.group("la respuesta ha sido AAAAAAAAAAAAAAAAAAAAAA: " , response.status);
      if (response.status === 200) {
        return {
          status: "success",
          data: response.data.user
        };
      } else {
        console.log("HE DADO UN ERROR A");
        throw new Error(response.data.message || 'No users found');
      }
    } catch (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  }
  
  export async function returnFriendsAvatar(users) {
    if (users.length === 0) {
      return { status: "success", data: [] };
    }
  
    try {
      const updatedUsers = await Promise.all(users.map(async user => {
        if (!user._id) {
          throw new Error('User ID is not defined');
        }
  
        try {
          const avatarResponse = await returnAvatarByID(user._id);
          const avatarUrl = avatarResponse ? `${constants.dirApi}/${constants.uploadsFolder}/${avatarResponse.avatar.imageFileName}` : null;
          console.log("URL del avatar:", avatarUrl);
          return { ...user, avatar: avatarUrl };
        } catch (avatarError) {
          console.error("Error obteniendo avatar:", avatarError);
          return user;
        }
      }));
  
      console.log("Usuarios actualizados con avatares:", updatedUsers);
      return { status: "success", data: updatedUsers };
    } catch (error) {
      console.error("Error en returnFriendsAvatar:", error);
      return { status: "error", message: error.message };
    }
  }
  
  export async function addFriends(userID) {
    try {
      const response = await addFriend(userID);
      console.group("la respuesta ha sido AAAAAAAAAAAAAAAAAAAAAA: " , response.status);
      if (response.status === 200) {

        return {
          status: "success",
          data: response.data.user
        };
      } else {
        console.log("HE DADO UN ERROR A");
        throw new Error(response.data.message || 'Error al enviar solicitud');
      }
    } catch (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  }
  
  export async function eliminateFriends(userID) {
    try {
      const response = await eliminateFriend(userID);
      console.group("la respuesta ha sido AAAAAAAAAAAAAAAAAAAAAA: " , response.status);
      if (response.status === 200) {
        return {
          status: "success",
          data: response.data.user
        };
      } else {
        console.log("HE DADO UN ERROR A");
        throw new Error(response.data.message || 'Error al enviar solicitud');
      }
    } catch (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  }
  
  export async function acceptFriends(userID) {
    try {
    console.log("El ID ES:",userID);
    const response = await acceptFriend(userID);
    console.group("la respuesta ha sido AAAAAAAAAAAAAAAAAAAAAA: " , response.status);
      if (response.status === 200) {
        return {
          status: "success",
          data: response.data.user
        };
      } else {
        console.log("HE DADO UN ERROR A");
        throw new Error(response.data.message || 'Error al enviar solicitud');
      }
    } catch (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  }
  
  export async function rejectFriends(userID) {
    try {
      const response = await rejectFriend(userID);
      console.group("la respuesta ha sido AAAAAAAAAAAAAAAAAAAAAA: " , response.status);
      if (response.status === 200) {
        return {
          
          status: "success",
          data: response.data.user
        };
      } else {
        console.log("HE DADO UN ERROR A");
        throw new Error(response.data.message || 'Error al enviar solicitud');
      }
    } catch (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  }
  
  export async function returnAllReceived() {
    try {
      const response = await returnAllReceivedFriends();
      console.group("la respuesta ha sido AAAAAAAAAAAAAAAAAAAAAA: " , response.status);
      console.log(response.status);
      if (response.status === 200) {
        return {
          status: "success",
          data: response.data.friend 
        };
      } else {
        console.log("HE DADO UN ERROR A");
        throw new Error(response.message || 'No users found');
      }
    } catch (error) {
      return {
        status: "error",
        message: error.message
      };
    }
  }
  