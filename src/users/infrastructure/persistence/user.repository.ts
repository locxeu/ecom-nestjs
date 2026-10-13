import { AuthUser } from "../../../auth/domain/user";
import { UpdateUserProfileInput } from "src/users/domain/update-user-profile.input";

export abstract class UserRepository {
    abstract findUserById(id: number): Promise<AuthUser | null>
    abstract updateUserProfile(id: number, data: UpdateUserProfileInput): Promise<AuthUser>
}