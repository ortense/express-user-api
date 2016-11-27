import * as decorator from 'express-decorators';
import HTTPStatus     from 'http-status'

const responseError = (response, error) => {
	const message = { mensagem: error.message }
	console.log(message)
	response.status(HTTPStatus.INTERNAL_SERVER_ERROR).json(message)
}

@decorator.controller('/usuario')
export default class Usuario {
	constructor(UsuarioModel, TelefoneModel) {
		this.UsuarioModel  = UsuarioModel
		this.TelefoneModel = TelefoneModel
	}

	@decorator.use
	async isPrivateRoute(request, response, next) {
		try {
			const auth  = request.headers.authorization || ''
			const token = auth.split('Bearer ')[1]
			const validation = await this.UsuarioModel.verifySession(token)

			if (validation.authorization) {
				request.user = validation.user
				next()
			}
			else {
				response.status(HTTPStatus.UNAUTHORIZED)
					.json({mensagem:validation.mensagem})
			}
		}
		catch(error) { responseError(response, error) }
	}

	@decorator.get('/')
    async getAll(request, response) {
		try {
			const userList = await this.UsuarioModel.findAll({
				where: {},
				include: [{
					model: this.TelefoneModel,
					as: 'telefones',
					attributes: ['ddd', 'numero']
				}]
			})
			response.status(HTTPStatus.OK).json(userList)
		}
		catch(error) { responseError(response, error) }
    }

	@decorator.get('/:id')
	async getById(request, response){
		try {
			const user = await this.UsuarioModel.findOne({
				where: {id: request.params.id},
				include: [{
					model: this.TelefoneModel,
					as: 'telefones',
					attributes: ['ddd', 'numero']
				}]
			})
			response.status(HTTPStatus.OK).json(user)
		}
		catch(error) { responseError(response, error) }
	}

	@decorator.put('/:id')
	async update(request, response) {
		try {
			const updates = await this.UsuarioModel.update(
				request.body,
				{where: {id: request.params.id}
			})
			response.status(HTTPStatus.OK).json(updates)
		}
		catch(error) { responseError(response, error) }
	}
}
