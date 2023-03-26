import {delete as axiosDelete, get, post} from "axios";
import {globalModalStore} from "../components/AppContent";

const backendBaseURI = "http://localhost:8080";

export const backendGet = async (url, conf = {}) => {
  return get(backendBaseURI + url, conf)
    .then( (response) => { return response.data } )
    .catch( (response) => {
      globalModalStore.showError(response)
    } )
}

export const backendPost = async (url, data = {}, conf = {}) => {
  let response = await post(backendBaseURI + url, data, conf);
  return response.data;
}

export const backendDelete = async (url, conf = {}) => {
  let response = await axiosDelete(backendBaseURI + url, conf)
  return response.data;
}
