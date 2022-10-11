"use strict";
const { getUserByEmail, createUser } = require("../user/methods");
const { api } = require('../../libs/simple-api');
/**
 * 
 * @param {*} router 
 * 
 */
module.exports = (router) => {
	api({
		router,
		method: 'post',
		path: '/api/login',
		handler: async ({ input, apiError }) => {
			console.log(input.body)
			const { email, password } = input.body;

			const user = await getUserByEmail(email);
			if (!user || password !== user.password) {
				throw apiError({ status: 401, message: "Invalid credentials" })
			}

			return { token: 'mocktoken' };

		}
	})

	api({
		router,
		method: 'post',
		path: '/api/register',
		handler: async ({ input, apiError }) => {
			const { email, password } = input.body;

			try {
				await createUser(email, password);

			} catch (error) {
				if (error.errno === 19) { // if unique email constraint fails
					throw apiError({ status: 400, message: "Invalid user data" }) // Safer to send a generic error than to acknowledge that an email was registered
				}
				// Otherwise internal server error
				throw error;
			}
			return { message: 'User successfully registered' };
		}
	})
}