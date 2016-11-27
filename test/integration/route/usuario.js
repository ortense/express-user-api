describe('Integration: Route Usuario', () => {
	const Usuario     = app.datasource.models.Usuario
	const Telefone    = app.datasource.models.Telefone
	const defaultUser = {
		id: 1,
		nome: 'Test User',
		email: 'test@mail.com',
		senha: 'testPassword',
		telefones: [
			{ddd: '11', numero: '987654321'},
			{ddd: '21', numero: '87654321'}
		]
	}

	let token

	before(done => {
		app.datasource.database.sync().done(() => {
			done()
		})
	})

	beforeEach(done => {
		Usuario
			.destroy({ where: {} })
			.then(Telefone.destroy({where: {}}))
			.then(() => Usuario.create(
				defaultUser, {
					include: [{	model: Telefone, as: 'telefones'}]
				}))
			.then(user => {
				token = user.token
				done()
			})
	})

	describe('GET /usuario', () => {
		it('should return a list of users', done => {
			request.get('/usuario')
				.set('Authorization', `Bearer ${token}`)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					expect(res.body[0].nome).to.eql(defaultUser.nome)
        			expect(res.body[0].email).to.eql(defaultUser.email)
        			done(err)
				})
		})

		it('should include a list of phones', done => {
			request.get('/usuario')
				.set('Authorization', `Bearer ${token}`)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					expect(res.body[0].telefones).to.eql(defaultUser.telefones)
        			done(err)
				})
		})
	})

	describe('GET /usuario/:id', () => {
		it('should return a users by id', done => {
			request.get(`/usuario/${defaultUser.id}`)
				.set('Authorization', `Bearer ${token}`)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					expect(res.body.nome).to.eql(defaultUser.nome)
        			expect(res.body.email).to.eql(defaultUser.email)
        			done(err)
				})
		})

		it('should include a list of phones', done => {
			request.get(`/usuario/${defaultUser.id}`)
				.set('Authorization', `Bearer ${token}`)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					expect(res.body.telefones).to.eql(defaultUser.telefones)
        			done(err)
				})
		})

		it('should return unauthorized to request without token', done => {
			request.get(`/usuario/${defaultUser.id}`)
				.expect('Content-Type', /json/)
				.expect(401)
				.end((err, res) => {
					expect(res.body.mensagem)
						.to.have.string('Não autorizado')
        			done(err)
				})
		})
	})

	describe('PUT /usuario/:id', () => {
		const userUpdate = {
        	id: 1,
        	nome: 'User Updated',
		}

		it('should update a user', done => {
			request.put(`/usuario/${defaultUser.id}`)
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${token}`)
				.send(userUpdate)
				.expect('Content-Type', /json/)
				.expect(200)
				.end((err, res) => {
					expect(res.body).to.eql([1])
					done(err)
				})
		})
	})
})
