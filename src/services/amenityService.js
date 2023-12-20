import { https } from "./axiosClient";

export let amenityService = {
    getAmenityList: () => {
        return https.get(`/api/v1/amenity`);
    },
    addAmenity: async (values) => {
        return await https.post(`/api/v1/amenity`, values);
    },
    update: (idAmenity, data) => {
        return https.put(`/api/v1/amenity/${idAmenity}`, data);
    },
    delete: (idAmenity) => {
        return https.delete(`/api/v1/amenity/${idAmenity}`);
    },
    getAmenityById: (id) => {
        return https.get(`/api/v1/amenity/${id}`);
    }
}