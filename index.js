import app from './app'

const PORT = app.get('port')

app.datasource.database.sync().done(() => {
	console.log('Synchronized models!')
	app.listen(PORT, () =>
		console.log(`App running on port ${PORT}`))
})
