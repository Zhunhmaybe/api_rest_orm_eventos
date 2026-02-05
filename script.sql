/*==============================================================*/
/* Table: participante                                          */
/*==============================================================*/
CREATE TABLE participante (
   par_id               SERIAL       not null,
   par_nombre           TEXT         not null,
   par_cedula           TEXT         not null,
   par_correo           TEXT         not null,
   PRIMARY KEY (par_id)
);
/*==============================================================*/
/* Table: sala                                                  */
/*==============================================================*/
CREATE TABLE sala (
   sal_id               SERIAL               not null,
   sal_nombre           TEXT         not null,
   sal_descripcion      TEXT                 not null,
   sal_estado           BOOLEAN              not null,
   PRIMARY KEY (sal_id)
);
/*==============================================================*/
/* Table: evento                                                */
/*==============================================================*/
CREATE TABLE evento (
   eve_id               SERIAL               not null,
   sal_id               INTEGER              not null,
   eve_nombre           TEXT		     not null,
   eve_costo            DECIMAL(8,2)         not null,
   PRIMARY KEY (eve_id),
   FOREIGN KEY (sal_id) references sala (sal_id)
);

/*==============================================================*/
/* Table: evento_participante                                   */
/*==============================================================*/
CREATE TABLE evento_participante (
   eve_id               INTEGER              not null,
   par_id               INTEGER              not null,
   evepar_cantidad      DECIMAL(8,2)         not null,
   PRIMARY KEY (eve_id, par_id),
   FOREIGN KEY (eve_id) references evento (eve_id),
   FOREIGN KEY (par_id) references participante (par_id)
);

-- Insertar Datos Evento
-- Sala
INSERT INTO sala (sal_nombre, sal_descripcion, sal_estado) values ('Gala Club', 'Una opción diferente para realizar sus eventos sociales, en un ambiente de distinción, con excelente gastronomía y el servicio cordial', true);
INSERT INTO sala (sal_nombre, sal_descripcion, sal_estado) values ('Hotel Ajaví', 'Tiene un area de 560m2 y capacidad para 600 personas en montaje tipo teatro, 450 personas con sillas para fiesta. El salón esta lujosamente alfombrado, tiene aire acondicionado, iluminación sectorizada, sistema de sonido de potencia y de palabra. Su división plegable lo convierte en 2 salones de 210m2 y 350m2 con ingresos independientes.', true);
INSERT INTO sala (sal_nombre, sal_descripcion, sal_estado) values ('Alborada', 'Planificación de Bodas, Atención de Recepciones, Eventos al aire libre, Fiestas Infantiles, Seminarios, Conferencias, servicio de alimentos a domicilio.',true);
INSERT INTO sala (sal_nombre, sal_descripcion, sal_estado) values ('Hosteria Rancho de Carolina', 'Con capacidad para 250 personas, apto para toda clase de compromisos. Disfrute aquí de la más exquisita cocina nacional e internacional.', true);
INSERT INTO sala (sal_nombre, sal_descripcion, sal_estado) values ('Hotel Imperio del Sol', 'Discoteka privada. Karaoke. Parqueadero privado con guardia de seguridad 24 horas. Paraiso de Imbabura a solo 5 minutos de Ibarra. Un sitio acogedor rodeado de los más hermosos y variados paisajes, situado a orillas de la histórica y cálida laguna de Yahuarcocha.', true);
-- Participante
INSERT INTO participante (par_nombre, par_cedula, par_correo) values ('Daniel Guerra', '1004100901','mguerra@utn.edu.ec');
INSERT INTO participante (par_nombre, par_cedula, par_correo) values ('Ricardo Avila', '1004100902','ravila@utn.edu.ec');
INSERT INTO participante (par_nombre, par_cedula, par_correo) values ('Dennis Chicaiza', '1004100903','dchicaiza@utn.edu.ec');
INSERT INTO participante (par_nombre, par_cedula, par_correo) values ('Ervin Cabascango', '1004100904','dcabascango@utn.edu.ec');
INSERT INTO participante (par_nombre, par_cedula, par_correo) values ('Ronal Moreira', '1004100905','rmoreira@utn.edu.ec');
INSERT INTO participante (par_nombre, par_cedula, par_correo) values ('Gabriel Garzón', '1004100906','ggarzon@utn.edu.ec');
INSERT INTO participante (par_nombre, par_cedula, par_correo) values ('Daniel Mejia', '1004100907','dmejia@utn.edu.ec');
INSERT INTO participante (par_nombre, par_cedula, par_correo) values ('Fabio Checa', '1004100908','fcheca@utn.edu.ec');
INSERT INTO participante (par_nombre, par_cedula, par_correo) values ('Edward Elric', '1004100909','eelric@utn.edu.ec');
INSERT INTO participante (par_nombre, par_cedula, par_correo) values ('Dark Alchemist', '1004100900','dalchemist@utn.edu.ec');
--Evento
INSERT INTO evento (sal_id, eve_nombre, eve_costo) values (1, 'Grado Colegio Sanchez y Cifuentes', 200.50);
INSERT INTO evento (sal_id, eve_nombre, eve_costo) values (2, 'Boda Juan Rigoberto', 405.00);
INSERT INTO evento (sal_id, eve_nombre, eve_costo) values (3, 'Grado UTN Software', 106.66);
-- Evento Participante
INSERT INTO evento_participante (eve_id, par_id, evepar_cantidad) values (1, 1, 2);
INSERT INTO evento_participante (eve_id, par_id, evepar_cantidad) values (1, 2, 2);
INSERT INTO evento_participante (eve_id, par_id, evepar_cantidad) values (2, 3, 2);
INSERT INTO evento_participante (eve_id, par_id, evepar_cantidad) values (2, 4, 2);
INSERT INTO evento_participante (eve_id, par_id, evepar_cantidad) values (3, 6, 2);
INSERT INTO evento_participante (eve_id, par_id, evepar_cantidad) values (3, 10, 2);
