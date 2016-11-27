describe('Unit: Model Usuario', ()=> {
	const Usuario = app.datasource.models.Usuario
	const senha   = 'uma senha qualquer'
	const email   = 'test@email.com'

	describe('.encrypt', ()=> {
		it('should always return the same hash for a string.', done => {
			const hash1 = Usuario.encrypt(senha)
			setTimeout(()=> {
				const hash2 = Usuario.encrypt(senha)
				expect(hash2).to.eql(hash1)
				done()
			}, 500)
		})
	})

	describe('.getToken', ()=> {
		it('should return a JWT', ()=> {
			const token = Usuario.getToken(email)
			expect(token).to.be.a('string')
			expect(token.split('.').length).to.be.eql(3)
		})
	})

	describe('.verifyToken', () => {
		it('should return a email', done => {
			const token   = Usuario.getToken(email)
			Usuario.verifyToken(token)
				.then(decoded => {
					expect(decoded).to.be.eql(email)
					done()
				})
				.catch(e => done(e))
		})
	})

})
