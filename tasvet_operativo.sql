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

CREATE TABLE empleados (
  	id_empleado INT PRIMARY KEY AUTO_INCREMENT,
  	persona_id INT, 
  	cargo VARCHAR(255),
  	descripcion VARCHAR(255) null,
  	estado CHAR(1), 
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (persona_id) REFERENCES personas(id_persona)
);

create table razas(
	id_raza INT PRIMARY KEY AUTO_INCREMENT,
	nombre_raza VARCHAR(100),
  	estado CHAR(1),
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
	reg_usuario varchar(150),
	act_fecha DATETIME null,
	act_usuario varchar(150),
	eli_fecha DATETIME null,
	eli_usuario varchar(150)
);

CREATE TABLE mascotas (
	id_mascota INT PRIMARY KEY AUTO_INCREMENT,
	cliente_id INT,
	nombre VARCHAR(150),
	especie varchar(150),
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
	FOREIGN KEY (raza_id) REFERENCES razas(id_raza)
);
-- -------------------------------
create table servicios(
	id_servicio INT PRIMARY KEY auto_increment,
	descripcion VARCHAR(150),
	categoria VARCHAR(150),
	estado CHAR(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150)
)

create table citas(
	id_cita INT PRIMARY KEY auto_increment,
	cliente_id INT,
	mascota_id INT,
	empleado_id INT,
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
	FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado)
)

create table vacunas(
 	id_vacuna INT PRIMARY KEY auto_increment,
 	nombre_vacuna VARCHAR(150),
 	descripcion VARCHAR(150) null,
 	lote int,
 	fecha_vencimiento date,
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
	empleado_id INT,
	vacuna_id INT,
	fecha_aplicacion date,
	peso_kg FLOAT,
	edad_meses INT,
	proxima_dosis date,
	observaciones varchar(250),
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado),
 	FOREIGN KEY (vacuna_id) REFERENCES vacunas(id_vacuna)
)

create table antiparasitarios(
 	id_antiparasitario INT PRIMARY KEY auto_increment,
 	nombre_antiparasitario VARCHAR(150),
 	descripcion VARCHAR(150),
 	lote int,
 	fecha_vencimiento date,
 	estado char(1),
 	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
)

create table carnets_desparasitacion(
	id_carnet_desparacitacion INT PRIMARY KEY auto_increment,
	empleado_id INT,
	antiparasitario_id INT,
	fecha_aplicacion date,
	peso_kg FLOAT,
	edad_meses INT,
	proxima_dosis date,
	observaciones varchar(250),
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado),
 	FOREIGN KEY (antiparasitario_id) REFERENCES antiparasitarios(id_antiparasitario)
)

create table carnets_spa(
	id_carnet_spa INT PRIMARY KEY auto_increment,
	empleado_id INT,
	peso_kg FLOAT,
	corte_pelo varchar(150),
	estilo varchar(150),
	baño varchar(150),
	oidos varchar(150),
	uñas varchar(150),
	hora_inngreso datetime,
	hora_entrega datetime,
	observaciones varchar(250),
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado),
 	FOREIGN KEY (antiparasitario_id) REFERENCES antiparasitarios(id_antiparasitario)
)

create table atencion_veterinaria(
	id_atencion INT PRIMARY KEY auto_increment,
	empleado_id INT,
	temperatura FLOAT,
	peso FLOAT,
	edad_meses INT
	sintomas varchar(250),
	diagnostico varchar(250),
	tratamiento varchar(250),
	resultados_examenes varchar(250),
	observaciones varchar(250),
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado),
 	FOREIGN KEY (antiparasitario_id) REFERENCES antiparasitarios(id_antiparasitario)
)
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

CREATE TABLE empleados (
  	id_empleado INT PRIMARY KEY AUTO_INCREMENT,
  	persona_id INT, 
  	cargo VARCHAR(255),
  	descripcion VARCHAR(255) null,
  	estado CHAR(1), 
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (persona_id) REFERENCES personas(id_persona)
);

create table razas(
	id_raza INT PRIMARY KEY AUTO_INCREMENT,
	nombre_raza VARCHAR(100),
  	estado CHAR(1),
  	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
	reg_usuario varchar(150),
	act_fecha DATETIME null,
	act_usuario varchar(150),
	eli_fecha DATETIME null,
	eli_usuario varchar(150)
);

CREATE TABLE mascotas (
	id_mascota INT PRIMARY KEY AUTO_INCREMENT,
	cliente_id INT,
	nombre VARCHAR(150),
	especie varchar(150),
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
	FOREIGN KEY (raza_id) REFERENCES razas(id_raza)
);
-- -------------------------------
create table servicios(
	id_servicio INT PRIMARY KEY auto_increment,
	descripcion VARCHAR(150),
	categoria VARCHAR(150),
	estado CHAR(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150)
)

create table citas(
	id_cita INT PRIMARY KEY auto_increment,
	cliente_id INT,
	mascota_id INT,
	empleado_id INT,
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
	FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado)
)

create table vacunas(
 	id_vacuna INT PRIMARY KEY auto_increment,
 	nombre_vacuna VARCHAR(150),
 	descripcion VARCHAR(150) null,
 	lote int,
 	fecha_vencimiento date,
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
	empleado_id INT,
	vacuna_id INT,
	fecha_aplicacion date,
	peso_kg FLOAT,
	edad_meses INT,
	proxima_dosis date,
	observaciones varchar(250),
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado),
 	FOREIGN KEY (vacuna_id) REFERENCES vacunas(id_vacuna)
)

create table antiparasitarios(
 	id_antiparasitario INT PRIMARY KEY auto_increment,
 	nombre_antiparasitario VARCHAR(150),
 	descripcion VARCHAR(150),
 	lote int,
 	fecha_vencimiento date,
 	estado char(1),
 	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
)

create table carnets_desparasitacion(
	id_carnet_desparacitacion INT PRIMARY KEY auto_increment,
	empleado_id INT,
	antiparasitario_id INT,
	fecha_aplicacion date,
	peso_kg FLOAT,
	edad_meses INT,
	proxima_dosis date,
	observaciones varchar(250),
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado),
 	FOREIGN KEY (antiparasitario_id) REFERENCES antiparasitarios(id_antiparasitario)
)

create table carnets_spa(
	id_carnet_spa INT PRIMARY KEY auto_increment,
	empleado_id INT,
	peso_kg FLOAT,
	corte_pelo varchar(150),
	estilo varchar(150),
	baño varchar(150),
	oidos varchar(150),
	uñas varchar(150),
	hora_inngreso datetime,
	hora_entrega datetime,
	observaciones varchar(250),
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado),
 	FOREIGN KEY (antiparasitario_id) REFERENCES antiparasitarios(id_antiparasitario)
)

create table atencion_veterinaria(
	id_atencion INT PRIMARY KEY auto_increment,
	empleado_id INT,
	temperatura FLOAT,
	peso FLOAT,
	edad_meses INT
	sintomas varchar(250),
	diagnostico varchar(250),
	tratamiento varchar(250),
	resultados_examenes varchar(250),
	observaciones varchar(250),
	estado char(1),
	reg_fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  	reg_usuario varchar(150),
  	act_fecha DATETIME null,
  	act_usuario varchar(150),
  	eli_fecha DATETIME null,
 	eli_usuario varchar(150),
 	FOREIGN KEY (empleado_id) REFERENCES empleados(id_empleado),
 	FOREIGN KEY (antiparasitario_id) REFERENCES antiparasitarios(id_antiparasitario)
)
