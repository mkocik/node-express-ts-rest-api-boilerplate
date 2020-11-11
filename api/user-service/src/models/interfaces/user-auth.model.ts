import {Password} from "../../common/password";
import {UUID} from "../../common/UUID";

export interface UserAuthModel {
    getPassword(): Password | undefined
    getId(): UUID | undefined
}
