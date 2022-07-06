# Estrategias de persistencia #

## Segundo Parcial : API con Node JS

**Alumnos**: Sol Noguera, Luciano Robles.

**Profesor**: Pablo Marcelli.

______________________

### Descripción
Para esta entrega se realizó una API con diferentes endpoints para cada modelo creado, 
a través del orm sequelize, se realizaron migraciones a la base de datos y se utilizó para realizar consultas o modificar datos.

### Funcionalidades
- **Autenticación con JWT:** Para consumir los endpoints se necesita un Header "Authorization" con valor "Bearer + token JWT".

- **Enpoints ADMIN:** Proporcionamos 2 endpoints que solo pueden ser consumidos si se proporciona el Header "AdminPassword" con la contraseña correcta ya que no queremos que cualquier persona pueda consumirlos. Estos son _Registrar Usuario_ y _Get All Usuarios_

- **Middlewares:** Utilizamos 2 middlewares, uno para verificar que el usuario haya puesto el header Authorization con un JWT válido y que este esté dentro de nuestra base de datos. El otro es para los endpoints ADMIN, verifica que exista un header AdminPassword con la contraseña correcta.

- **Registro de Usuarios:** A través del enpoint _/usuario/registrar_ podemos registrar un nuevo usuario, el mail debe ser unico, de lo contrario responde que ya está registrado en el sistema. Devuelve el token para utilizar dentro de Authorization en los otros endpoints.

- **Login de Usuarios:** A través del enpoint _/usuario/login_ podemos loguearnos con nuestro usuario y contraseña, si los datos están correctos se devolverá el token para consumir el resto de los endpoints, de lo contrario devuelve 401 Unauthorized.

- **Contraseñas Encriptadas:** Al crear un nuevo usuario con email y contraseña, la contraseña persistirá en nuestra base de datos de manera encriptada, para prevalecer la seguridad del usuario. Cuando se consuma el endpoint _Get All Usuarios_, se devolverán los datos del usuario con las contraseñas encriptadas.

- **Paginación:** Para todos los métodos GET, se proporcionan los query params opcionales "limit" y "offset". El limit define el maximo de registros a devolver, y el offset desde que registro empieza a contar.

- **Relación Muchos A Muchos:** Para vincular Alumno y Materia necesitamos generar una tercera tabla **Inscripción** y relacionarla tanto con Alumno como con Materia. En ella guardamos las claves primarias de las entidades que se relacionan, y algunos datos más de la Inscripción en sí, como la comisión y el profesor de la cátedra.

### Modelos Sequelize
- Materia
- Carrera
- Alumno
- Inscripción
- Usuario

### Relaciones Entre Modelos
- **Entre Carrera y Materia** existe una Relación **uno a muchos**: Una carrera pertenece a muchas materias.
- **Entre Alumno y Materia** existe una Relación **muchos a muchos**: Muchos Alumnos pertenecen a muchas Materias. Para implementar esto creamos una tabla intermedia llamada **Inscripción**.
- **Entre Carrera y Alumno** existe una Relación **uno a muchos**: Una carrera pertenece a muchos alumnos.

### Dependencias

- **jsonwebtoken**: Para generar y verificar tokens.
- **bcrypt**: Para encriptar y desencriptar contraseñas 
- **dotenv**: Para la creación de variables de entorno/globales con el objetivo de guardar la contraseña de administrador, creando una capa de abstracción. 

### Endpoints
Agregamos nuestra **Colección de Postman** en la raíz del proyecto con todos los endpoints de la API, divididos por cada modelo.
