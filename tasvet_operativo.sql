use tasvet_operativo;
-- -----CREACIÓN DE TABLAS-------

CREATE TABLE personas (
  	id_persona INT PRIMARY KEY AUTO_INCREMENT,
  	cedula varchar(10) UNIQUE NOT NULL,
  	nombre VARCHAR(100),
  	apellido VARCHAR(100),
  	telefono VARCHAR(10) UNIQUE NOT NULL,
  	estado CHAR(1),
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150)
);

CREATE TABLE roles (
	id_rol INT AUTO_INCREMENT PRIMARY KEY,
  	descripcion VARCHAR(100),
  	estado CHAR(1),
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fehca DATETIME null,
  	act_uasurio varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150)
);

CREATE TABLE usuarios (
  	id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  	rol_id INT,
  	persona_id INT, 
  	email VARCHAR(100) UNIQUE NOT NULL,
  	clave VARCHAR(255) NOT NULL,
  	estado CHAR(1),
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
  	FOREIGN KEY (rol_id) REFERENCES roles(id_rol),
  	FOREIGN KEY (persona_id) REFERENCES personas(id_persona)
);

CREATE TABLE notificaciones (
  	id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
  	usuario_id INT,
  	mensaje TEXT NOT NULL,
  	correo_veterinaria VARCHAR(100),
  	correo_cliente VARCHAR(100),
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario)
);

CREATE TABLE clientes (
  	id_cliente INT PRIMARY KEY AUTO_INCREMENT,
  	persona_id INT, 
  	direccion VARCHAR(255),
  	estado CHAR(1), 
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (persona_id) REFERENCES personas(id_persona)
);

CREATE TABLE veterinarios (
  	id_veterinarios INT PRIMARY KEY AUTO_INCREMENT,
  	persona_id INT, 
  	especialidad VARCHAR(255),
  	estado CHAR(1), 
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (persona_id) REFERENCES personas(id_persona)
);

create table especies(
	id_especie INT PRIMARY KEY AUTO_INCREMENT,
	descripcion VARCHAR(100),
  	estado CHAR(1),
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
	reg_usuario varchar(150),
	act_fehca DATETIME null,
	act_usuario varchar(150),
	eli_fecha DATETIME null,
	eli_usuario varchar(150)
);

create table razas(
	id_raza INT PRIMARY KEY AUTO_INCREMENT,
	especie_id INT,
	nombre_raza VARCHAR(100),
  	estado CHAR(1),
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
	reg_usuario varchar(150),
	act_fecha DATETIME null,
	act_usuario varchar(150),
	eli_fecha DATETIME null,
	eli_usuario varchar(150),
  	FOREIGN KEY (especie_id) REFERENCES especies(id_especie)
);

CREATE TABLE mascotas (
	id_mascota INT PRIMARY KEY AUTO_INCREMENT,
	cliente_id INT,
	nombre VARCHAR(150),
	especie_id INT,
	raza_id INT,
	fecha_nacimiento DATE,
	edad_meses INT,
	sexo VARCHAR(10),
	peso_kg FLOAT,
	estado CHAR(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
	reg_usuario varchar(150),
	act_fecha DATETIME null,
	act_usuario varchar(150),
	eli_fecha DATETIME null,
	eli_usuario varchar(150),
	FOREIGN KEY (cliente_id) REFERENCES clientes(id_cliente),
	FOREIGN KEY (especie_id) REFERENCES especies(id_especie),
	FOREIGN KEY (raza_id) REFERENCES razas(id_raza)
);
-- -------------------------------
create table servicios(
	id_servicio INT PRIMARY KEY auto_increment,
	descripcion VARCHAR(150),
	categoria VARCHAR(150),
	precion FLOAT,
	estado CHAR(1)
)

create table citas(
	id_cita INT PRIMARY KEY auto_increment,
	cliente_id INT,
	mascota_id INT,
	veterinario_id INT,
	servicio_id INT,
	fecha_hora_cita DATETIME,
	estado_cita_id INT,
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
	FOREIGN KEY (cliente_id) REFERENCES clientes(id_cliente),
	FOREIGN KEY (mascota_id) REFERENCES mascotas(id_mascota),
	FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id_veterinario)
)

create table vacunas(
 	id_vacuna INT PRIMARY KEY auto_increment,
 	especie_id INT,
 	descripcion VARCHAR(150),
 	estado char(1),
 	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (especie_id) REFERENCES especies(id_especie),
)

create table carnets_vacunas(
	id_carnet_vacuna INT PRIMARY KEY auto_increment,
	veterinario_id INT,
	vacuna_id INT,
	fecha_aplicacion date,
	peso_kg FLOAT,
	edad_meses INT,
	proxima_dosis date,
	observaciones varchar(150),
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id_veterinario),
 	FOREIGN KEY (vacuna_id) REFERENCES vacunas(id_vacuna)
)

create table antiparacitarios(
 	id_antiparacitario INT PRIMARY KEY auto_increment,
 	descripcion VARCHAR(150),
 	estado char(1),
 	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
)

create table carnets_desparacitacion(
	id_carnet_desparacitacion INT PRIMARY KEY auto_increment,
	veterinario_id INT,
	antiparacitario_id INT,
	fecha_aplicacion date,
	peso_kg FLOAT,
	edad_meses INT,
	proxima_dosis date,
	observaciones varchar(150),
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (veterinario_id) REFERENCES veterinarios(id_veterinario),
)