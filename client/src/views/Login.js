import React, { Component } from 'react'

export default class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		}
		// this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleSubmit(event) {
		event.preventDefault();

		let formData = new FormData(event.currentTarget);
		let username = formData.get("username");

		console.log(username)

	}
	render() {
		return (
			<div>
				<p>You must log in to view the page at </p>

				<form onSubmit={this.handleSubmit}>
					<label>
						Username: <input name="username" type="text" />
					</label>{" "}
					<button type="submit">Login</button>
				</form>
			</div>
		)
	}
}
