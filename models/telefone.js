export default (sequelize, DataType) => {
	const Telefone = sequelize.define('Telefone', {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		ddd: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		},
		numero: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		},
		data_criacao: {
			type: DataType.DATE,
			allowNull: true
		},
		data_atualizacao: {
			type: DataType.DATE,
			allowNull: true
		}
	},
	{
		timestamps: false,
		hooks: {
			beforeCreate: phone => {
				phone.set('data_criacao', new Date())
				phone.set('data_atualizacao', new Date())
			},
			beforeUpdate: phone => {
				phone.set('data_atualizacao', new Date())
			}
		},
		classMethods: {
			associate: models =>
				Telefone.belongsTo(models.Usuario)
		}
	})

	return Telefone
}
