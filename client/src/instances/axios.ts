import axios from "axios";
import { ApiUrl } from "./urls";

export default axios.create({
    baseURL: ApiUrl,
    withCredentials: true,
});