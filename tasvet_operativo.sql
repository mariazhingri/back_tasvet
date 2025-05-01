use tasvet_operativo;
-- -----CREACIÓN DE TABLAS-------
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
  	nombre VARCHAR(100) UNIQUE NOT NULL,
  	email VARCHAR(100) UNIQUE NOT NULL,
  	clave VARCHAR(255) NOT NULL,
  	clave_segura VARCHAR(255),
  	telefono VARCHAR(10),
  	estado CHAR(1),
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
  FOREIGN KEY (rol_id) REFERENCES roles(id_rol)
);

CREATE TABLE contactos (
  	id_contacto INT PRIMARY KEY AUTO_INCREMENT,
  	nombre VARCHAR(100),
  	apellido VARCHAR(100),
  	telefono VARCHAR(10),
  	email VARCHAR(100),
  	direccion VARCHAR(255),
  	estado CHAR(1),
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150)
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

create table vinculaciones_mascotas(
	id_vinculacion_mascota INT PRIMARY KEY AUTO_INCREMENT,
	mascota_id INT,
	codigo_vinculacion VARCHAR(150),
	cliente_id INT,
	estado varchar(20),
	vinc_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
	reg_usuario varchar(150),
	act_fecha DATETIME null,
	act_usuario varchar(150),
	eli_fecha DATETIME null,
	eli_usuario varchar(150),
	FOREIGN KEY (mascota_id) REFERENCES mascotas(id_mascota),
	FOREIGN KEY (cliente_id) REFERENCES usuarios(id_usuario)
);

CREATE TABLE mascotas (
	id_mascota INT PRIMARY KEY AUTO_INCREMENT,
	contacto_id INT,
	nombre VARCHAR(150),
	especie_id INT,
	raza_id INT,
	fecha_nacimiento DATE,
	edad_meses INT,
	sexo VARCHAR(10),
	peso_kg FLOAT,
	color_pelaje VARCHAR(150),
	estado CHAR(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
	reg_usuario varchar(150),
	act_fecha DATETIME null,
	act_usuario varchar(150),
	eli_fecha DATETIME null,
	eli_usuario varchar(150),
	FOREIGN KEY (contacto_id) REFERENCES contactos(id_contacto),
	FOREIGN KEY (especie_id) REFERENCES especies(id_especie),
	FOREIGN KEY (raza_id) REFERENCES razas(id_raza)
);
-- -------------------------------
create table estado_cita(
	id_estado_cita INT PRIMARY KEY auto_increment,
	detalle VARCHAR(50),
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
	FOREIGN KEY (cliente_id) REFERENCES usuarios(id_usuario),
	FOREIGN KEY (mascota_id) REFERENCES mascotas(id_mascota),
	FOREIGN KEY (veterinario_id) REFERENCES usuarios(id_usuario)
)

create table servicios(
 	id_servicio INT PRIMARY KEY auto_increment,
 	categoria_id INT,
 	descripcion VARCHAR(150),
 	precio FLOAT,
 	estado char(1),
 	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
)

create table categorias(
	id_categoria INT PRIMARY KEY auto_increment,
	descripcion varchar(150),
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
)
