create database tasvet_operativo;
use tasvet_operativo;
-- -----CREACIÓN DE TABLAS-------

CREATE TABLE personas (
  	id_persona INT PRIMARY KEY AUTO_INCREMENT,
  	cedula varchar(10) UNIQUE NOT NULL,
  	correo varchar(150) UNIQUE NULL, 
  	nombre VARCHAR(100),
  	apellido VARCHAR(100),
  	telefono_1 VARCHAR(10) UNIQUE NOT NULL,
  	telefono_2 VARCHAR(10) UNIQUE NULL,
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

-- -------------------------------
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

CREATE TABLE codigos_verificacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(150) NOT NULL,
    codigo VARCHAR(6) NOT NULL,
    fecha_generacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiracion DATETIME NOT NULL,
    usado BOOLEAN DEFAULT FALSE
);


-- ------INSERCIÓN DE DATOS--------
INSERT INTO roles (descripcion, estado) VALUES
('Administrador', 'A'),
('Veterinario', 'A'),
('Cliente', 'A');

INSERT INTO personas (cedula,correo ,nombre,apellido, telefono_1, telefono_2, estado,reg_fecha,reg_usuario) values
('0926343559','mariazhingripaz@outlook.com','Maria','Zhingri', '0985733121',NULL, 'A',NOW(),'Admin'),
('0978654568','tasvet@outlook.com', 'Dennise','Garces', '0987986751',NULL,'A',NOW(),'Admin'),
('0157863214','ejemplo@outlook.com', 'Juan','Perez', '0975463218',NULL,'A',NOW(),'Admin'),
('0245789631','','Carla','Letamendi', '0987546325',NULL, 'A',NOW(),'Admin'),
('0354862130','mzhingri@gmail.com','Maca','Suarez', '0987546321',NULL, 'A',NOW(),'Admin'),
('0456893216','','Hugo','Piguave', '0985301250',NULL, 'A',NOW(),'Admin')
('000000000','','iii','aa', '0000002356',NULL, 'A',NOW(),'Admin')


INSERT INTO usuarios (rol_id, persona_id, clave, estado, reg_fecha, reg_usuario) VALUES 
(1,1, 'admin', 'A', NOW(),'Admin'),
(2,2, 'denniseVete1', 'A', NOW(),'Admin');

INSERT INTO empleados (usuario_id,nombre, apellido,telefono, email, direccion,estado) VALUES
(1,'Maria','Zhingri', '0999999999', 'mariazhingripaz@outlook.com','La perla','A');

INSERT INTO mascotas (cliente_id,especie_id,nombre,raza_id,fecha_nacimiento,edad,sexo,peso_kg,color_pelaje,estado) VALUES 
(1,1,'Firulais',1,'2020-05-10',4,'Macho',25.5,'Marrón','A');

insert into razas(nombre_raza, estado) values
('labrador', 'A'),
('Siamés', 'A');

insert into servicios( descripcion, estado) VALUES('Atencion Veterinaria','A')
insert into servicios( descripcion, estado) VALUES('Vacunacion','A');
insert into servicios( descripcion, estado) VALUES('Desparacitacion','A');
insert into servicios( descripcion, estado) VALUES('Baño','A');
insert into servicios( descripcion, estado) VALUES('Peluqueria','A');

insert into sub_servicios(servicio_id,especie_id, descripcion,estado,reg_fecha, act_fecha) values
(1, 1, vacuna);

INSERT INTO citas (cliente_id,mascota_id,veterinario_id,servicio_id,fecha_hora_cita,estado) VALUES 
(3,1,4,'Consulta general',1,'2025-04-20 10:30:00','A');

-- -----------------------
ALTER TABLE personas MODIFY COLUMN usuario_id INT NULL;
ALTER TABLE personas MODIFY COLUMN cedula varchar(10) UNIQUE NOT NULL ;
ALTER TABLE personas DROP COLUMN direccion;
ALTER TABLE mascotas DROP COLUMN edad_meses;
ALTER TABLE personas MODIFY reg_usuario varchar(150) NULL;
ALTER TABLE usuarios MODIFY reg_usuario varchar(150) NULL;


-- ELIMINAR ---
drop database tasvet_operativo
DROP TABLE mascotas;
DROP TABLE citas;
DROP TABLE razas;
DROP TABLE empleados;
DROP TABLE roles;
DROP TABLE clientes;
DROP TABLE usuarios;
DROP TABLE notificaciones;
DROP TABLE servicios;
DROP TABLE personas;
DROP TABLE razas ;

delete from mascotas where id_mascota  = 1;

TRUNCATE TABLE usuarios;
TRUNCATE TABLE codigos_verificacion;

-- -------CONSULTAS--------
select * from roles;
select * from usuarios u; 
select *  from clientes;
select * from codigos_verificacion;
select * from mascotas;
select * from razas;
select * from servicios;
select * from personas;
SHOW TABLES;
SELECT * FROM usuarios WHERE email = 'mariazhingripaz@outlook.com'

SELECT u.*
FROM usuarios u 
LEFT JOIN personas p on u.persona_id = p.id_persona 
WHERE p.cedula = '0978654568';

select p.*
from personas p
inner join usuarios u on p.id_persona = u.persona_id
where p.cedula = '0978654568';

SELECT COUNT(*) 
FROM usuarios;
zzz
 SELECT u.*, r.descripcion as rol_descripcion 
                FROM usuarios u 
                LEFT JOIN roles r ON u.rol_id = r.id_rol 
                WHERE u.id_usuario = 2
                
select p.nombre, p.apellido, r.descripcion as rol
from personas p
inner join usuarios u on p.id_persona = u.persona_id
inner join roles r on u.rol_id = r.id_rol
where u.id_usuario = 8

  SELECT m.* 
            FROM mascotas m
            INNER JOIN clientes c ON m.cliente_id = c.id_cliente
            WHERE m.nombre = 'max'
            AND m.especie_id = 1
            AND m.estado = 'A'
            
SELECT u.rol_id, r.descripcion as rol_descripcion 
            FROM usuarios u 
            LEFT JOIN roles r ON u.rol_id = r.id_rol 
            where u.id_usuario = 2
            
select s.id_servicio, s.descripcion, s.categoria, s.estado
            from servicios s
            inner join usuarios u on s.reg_usuario = u.id_usuario
SELECT p.*, u.*
FROM personas p 
inner join usuarios u on p.id_persona = u.persona_id 
WHERE  p.correo = 'mariazhingripaz@outlook.com'

SELECT * FROM codigos_verificacion
WHERE correo = 'mzhingri372@gmail.com'
AND codigo = '413144'
AND expiracion > NOW();

SELECT p.*, u.*, r.descripcion as rol_descripcion
            FROM personas p
            LEFT JOIN usuarios u ON p.id_persona = u.persona_id
            LEFT JOIN roles r ON u.rol_id = r.id_rol
            where p.cedula = '0157863214'

SELECT p.*, u.id_usuario
FROM personas p
LEFT JOIN usuarios u ON u.persona_id = p.id_persona
WHERE p.cedula = '0157863214'

