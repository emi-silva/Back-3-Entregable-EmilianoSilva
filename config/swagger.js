const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend 3 Entregable API',
      version: '1.0.0',
      description: 'API para gestión de usuarios, mascotas y adopciones con mocking',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario',
              example: '68ed203fccfff6e5ea6cdd75'
            },
            first_name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'María'
            },
            last_name: {
              type: 'string',
              description: 'Apellido del usuario',
              example: 'González'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único del usuario',
              example: 'maria.gonzalez@email.com'
            },
            password: {
              type: 'string',
              description: 'Contraseña encriptada',
              example: '$2b$10$hashed_password_example'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'Rol del usuario',
              example: 'user'
            },
            pets: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array de IDs de mascotas',
              example: ['68ed203fccfff6e5ea6cdd85', '68ed203fccfff6e5ea6cdd92']
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-13T15:52:31.888Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-13T15:52:31.888Z'
            }
          },
          example: {
            _id: '68ed203fccfff6e5ea6cdd75',
            first_name: 'María',
            last_name: 'González',
            email: 'maria.gonzalez@email.com',
            password: '$2b$10$hashed_password_example',
            role: 'user',
            pets: ['68ed203fccfff6e5ea6cdd85', '68ed203fccfff6e5ea6cdd92'],
            createdAt: '2025-10-13T15:52:31.888Z',
            updatedAt: '2025-10-13T15:52:31.888Z'
          }
        },
        Pet: {
          type: 'object',
          required: ['name', 'species'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único de la mascota'
            },
            name: {
              type: 'string',
              description: 'Nombre de la mascota'
            },
            species: {
              type: 'string',
              enum: ['perro', 'gato', 'ave', 'pez', 'hamster', 'conejo', 'tortuga', 'iguana', 'hurón', 'chinchilla'],
              description: 'Especie de la mascota'
            },
            breed: {
              type: 'string',
              description: 'Raza de la mascota'
            },
            age: {
              type: 'number',
              minimum: 0,
              maximum: 30,
              description: 'Edad en años'
            },
            color: {
              type: 'string',
              description: 'Color principal de la mascota'
            },
            size: {
              type: 'string',
              enum: ['pequeño', 'mediano', 'grande', 'extra grande'],
              description: 'Tamaño de la mascota'
            },
            weight: {
              type: 'number',
              minimum: 0.1,
              maximum: 100,
              description: 'Peso en kilogramos'
            },
            description: {
              type: 'string',
              maxLength: 500,
              description: 'Descripción detallada de la mascota'
            },
            personality: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['cariñoso', 'juguetón', 'tranquilo', 'energético', 'protector', 'independiente', 'sociable', 'tímido', 'curioso', 'obediente']
              },
              description: 'Características de personalidad'
            },
            isVaccinated: {
              type: 'boolean',
              default: false,
              description: 'Si está vacunada'
            },
            isNeutered: {
              type: 'boolean',
              default: false,
              description: 'Si está castrada/esterilizada'
            },
            healthStatus: {
              type: 'string',
              enum: ['excelente', 'bueno', 'regular', 'necesita cuidados especiales'],
              default: 'bueno',
              description: 'Estado de salud general'
            },
            adoptionStatus: {
              type: 'string',
              enum: ['disponible', 'en proceso', 'adoptado', 'no disponible'],
              default: 'disponible',
              description: 'Estado de adopción'
            },
            imageUrl: {
              type: 'string',
              description: 'URL de la imagen de la mascota'
            },
            specialNeeds: {
              type: 'string',
              maxLength: 200,
              description: 'Necesidades especiales o cuidados requeridos'
            },
            goodWithKids: {
              type: 'boolean',
              default: true,
              description: 'Si se lleva bien con niños'
            },
            goodWithPets: {
              type: 'boolean',
              default: true,
              description: 'Si se lleva bien con otras mascotas'
            },
            location: {
              type: 'object',
              properties: {
                city: {
                  type: 'string',
                  description: 'Ciudad donde se encuentra'
                },
                province: {
                  type: 'string',
                  description: 'Provincia donde se encuentra'
                },
                country: {
                  type: 'string',
                  default: 'Argentina',
                  description: 'País donde se encuentra'
                }
              }
            },
            owner: {
              type: 'string',
              description: 'ID del propietario (si tiene)',
              example: '68ed203fccfff6e5ea6cdd75'
            },
            ageDescription: {
              type: 'string',
              description: 'Descripción de la edad (virtual field)',
              example: 'Adulto'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-13T15:52:31.813Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-13T15:52:31.813Z'
            }
          },
          example: {
            _id: '68ed203fccfff6e5ea6cdd85',
            name: 'Luna',
            species: 'perro',
            breed: 'Labrador',
            age: 3.5,
            color: 'dorado',
            size: 'grande',
            weight: 28.5,
            description: 'Luna es una perra muy cariñosa de 3.5 años, perfecta para familias. Es protectora y juguetona.',
            personality: ['cariñoso', 'protector', 'juguetón'],
            isVaccinated: true,
            isNeutered: true,
            healthStatus: 'excelente',
            adoptionStatus: 'disponible',
            imageUrl: 'https://via.placeholder.com/300x300/4299E1/FFFFFF?text=🐾',
            specialNeeds: null,
            goodWithKids: true,
            goodWithPets: true,
            location: {
              city: 'Buenos Aires',
              province: 'Buenos Aires',
              country: 'Argentina'
            },
            owner: {
              _id: '68ed203fccfff6e5ea6cdd75',
              first_name: 'María',
              last_name: 'González',
              email: 'maria.gonzalez@email.com'
            },
            ageDescription: 'Adulto',
            createdAt: '2025-10-13T15:52:31.813Z',
            updatedAt: '2025-10-13T15:52:31.813Z'
          }
        },
        Adoption: {
          type: 'object',
          required: ['user', 'pet'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único de la adopción',
              example: '68ed203fccfff6e5ea6cdd95'
            },
            user: {
              type: 'string',
              description: 'ID del usuario adoptante',
              example: '68ed203fccfff6e5ea6cdd75'
            },
            pet: {
              type: 'string',
              description: 'ID de la mascota adoptada',
              example: '68ed203fccfff6e5ea6cdd85'
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected', 'completed'],
              default: 'pending',
              description: 'Estado de la adopción',
              example: 'pending'
            },
            adoptionDate: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha cuando se completa la adopción',
              example: '2025-10-15T10:30:00.000Z'
            },
            notes: {
              type: 'string',
              description: 'Notas adicionales sobre la adopción',
              example: 'Usuario interesado en adoptar a Luna. Tiene experiencia con perros grandes.'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-13T15:52:31.813Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-13T15:52:31.813Z'
            }
          },
          example: {
            _id: '68ed203fccfff6e5ea6cdd95',
            user: {
              _id: '68ed203fccfff6e5ea6cdd75',
              first_name: 'María',
              last_name: 'González',
              email: 'maria.gonzalez@email.com'
            },
            pet: {
              _id: '68ed203fccfff6e5ea6cdd85',
              name: 'Luna',
              species: 'perro',
              breed: 'Labrador'
            },
            status: 'pending',
            adoptionDate: null,
            notes: 'Usuario interesado en adoptar a Luna. Tiene experiencia con perros grandes.',
            createdAt: '2025-10-13T15:52:31.813Z',
            updatedAt: '2025-10-13T15:52:31.813Z'
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            },
            details: {
              type: 'string',
              description: 'Detalles adicionales del error'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Rutas donde están las anotaciones de Swagger
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};