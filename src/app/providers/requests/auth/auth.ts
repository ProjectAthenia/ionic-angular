import {RequestHandlerProvider} from '../../request-handler/request-handler';
import {User} from '../../../models/user/user';

/**
 * All requests needed for handling authentication within the app
 */
export default class Auth {

    /**
     * Default constructor
     * @param requestHandler
     */
    constructor(private requestHandler: RequestHandlerProvider) {
    }

    /**
     * Runs the sign in request
     *
     * @param email
     * @param password
     * @param invalidCredentialsHandler
     */
    signIn(email: string, password: string, invalidCredentialsHandler: (error) => void): Promise<any> {
        const data = {
            email: email,
            password: password,
        };

        return this.requestHandler.post('auth/login', false, true, data, {
            401 : invalidCredentialsHandler
        });
    }

    /**
     * Runs the request to load initial information needed during the auth flow
     */
    async loadInitialInformation(): Promise<User> {
        return this.requestHandler.get('users/me', true, true, [
            'registrations',
            'registrations.assets',
            'registrations.eventParticipants',
            'registrations.eventParticipants.assets',
            'registrations.eventParticipants.completedSurvey',
            'registrations.registrationOption',
            'subscriptions',
            'subscriptions.membershipPlan',
        ]).then((response) => {
            const user = new User(response);
            return new Promise<User> (resolve => {
                resolve(user);
            });
        });
    }

    /**
     * Runs an update for the user
     *
     * @param user
     * @param userData
     */
    async updateUser(user: User, userData: any): Promise<User> {
        return this.requestHandler.put('users/' + user.id, true, true, userData)
            .then((response) => {
                const userResponse = new User(response);
                return new Promise<User> (resolve => {
                    resolve(userResponse);
                }
            );
        });
    }
}
