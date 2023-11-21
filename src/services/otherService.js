import { https } from './axiosClient';

export let otherService = {
    add:
        (idUser, idRoom) => {
            return https.post(`/api/v1/wishlist/${idUser}/addWishlist/${idRoom}`,);
        },

};
