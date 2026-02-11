--
-- PostgreSQL database dump - CLEANED FOR DEPLOYMENT
--

-- Create tables

CREATE TABLE IF NOT EXISTS participante (
    par_id SERIAL PRIMARY KEY,
    par_nombre TEXT NOT NULL,
    par_cedula TEXT NOT NULL,
    par_correo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sala (
    sal_id SERIAL PRIMARY KEY,
    sal_nombre TEXT NOT NULL,
    sal_descripcion TEXT NOT NULL,
    sal_estado BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS evento (
    eve_id SERIAL PRIMARY KEY,
    sal_id INTEGER NOT NULL,
    eve_nombre TEXT NOT NULL,
    eve_costo NUMERIC(8,2) NOT NULL,
    CONSTRAINT evento_sal_id_fkey FOREIGN KEY (sal_id) REFERENCES sala(sal_id)
);

CREATE TABLE IF NOT EXISTS evento_participante (
    eve_id INTEGER NOT NULL,
    par_id INTEGER NOT NULL,
    evepar_cantidad NUMERIC(8,2) NOT NULL,
    CONSTRAINT evento_participante_pkey PRIMARY KEY (eve_id, par_id),
    CONSTRAINT evento_participante_eve_id_fkey FOREIGN KEY (eve_id) REFERENCES evento(eve_id),
    CONSTRAINT evento_participante_par_id_fkey FOREIGN KEY (par_id) REFERENCES participante(par_id)
);

-- Insert data

-- Participantes
INSERT INTO participante (par_id, par_nombre, par_cedula, par_correo) VALUES
(1, 'Daniel Guerra', '1004100901', 'mguerra@utn.edu.ec'),
(2, 'Ricardo Avila', '1004100902', 'ravila@utn.edu.ec'),
(3, 'Dennis Chicaiza', '1004100903', 'dchicaiza@utn.edu.ec'),
(4, 'Ervin Cabascango', '1004100904', 'dcabascango@utn.edu.ec'),
(5, 'Ronal Moreira', '1004100905', 'rmoreira@utn.edu.ec'),
(6, 'Gabriel Garzón', '1004100906', 'ggarzon@utn.edu.ec'),
(7, 'Daniel Mejia', '1004100907', 'dmejia@utn.edu.ec'),
(8, 'Fabio Checa', '1004100908', 'fcheca@utn.edu.ec'),
(9, 'Edward Elric', '1004100909', 'eelric@utn.edu.ec'),
(10, 'Dark Alchemist', '1004100900', 'dalchemist@utn.edu.ec')
ON CONFLICT (par_id) DO NOTHING;

-- Salas
INSERT INTO sala (sal_id, sal_nombre, sal_descripcion, sal_estado) VALUES
(1, 'Gala Club', 'Una opción diferente para realizar sus eventos sociales, en un ambiente de distinción, con excelente gastronomía y el servicio cordial', true),
(2, 'Hotel Ajaví', 'Tiene un area de 560m2 y capacidad para 600 personas en montaje tipo teatro, 450 personas con sillas para fiesta. El salón esta lujosamente alfombrado, tiene aire acondicionado, iluminación sectorizada, sistema de sonido de potencia y de palabra. Su división plegable lo convierte en 2 salones de 210m2 y 350m2 con ingresos independientes.', true),
(3, 'Alborada', 'Planificación de Bodas, Atención de Recepciones, Eventos al aire libre, Fiestas Infantiles, Seminarios, Conferencias, servicio de alimentos a domicilio.', true),
(4, 'Hosteria Rancho de Carolina', 'Con capacidad para 250 personas, apto para toda clase de compromisos. Disfrute aquí de la más exquisita cocina nacional e internacional.', true),
(5, 'Hotel Imperio del Sol', 'Discoteka privada. Karaoke. Parqueadero privado con guardia de seguridad 24 horas. Paraiso de Imbabura a solo 5 minutos de Ibarra. Un sitio acogedor rodeado de los más hermosos y variados paisajes, situado a orillas de la histórica y cálida laguna de Yahuarcocha.', true)
ON CONFLICT (sal_id) DO NOTHING;

-- Eventos
INSERT INTO evento (eve_id, sal_id, eve_nombre, eve_costo) VALUES
(1, 1, 'Grado Colegio Sanchez y Cifuentes', 200.50),
(2, 2, 'Boda Juan Rigoberto', 405.00),
(3, 3, 'Grado UTN Software', 106.66)
ON CONFLICT (eve_id) DO NOTHING;

-- Evento Participantes
INSERT INTO evento_participante (eve_id, par_id, evepar_cantidad) VALUES
(1, 1, 2.00),
(1, 2, 2.00),
(2, 3, 2.00),
(2, 4, 2.00),
(3, 6, 2.00),
(3, 10, 2.00)
ON CONFLICT (eve_id, par_id) DO NOTHING;

-- Update sequences to current max values
SELECT setval('participante_par_id_seq', (SELECT MAX(par_id) FROM participante));
SELECT setval('sala_sal_id_seq', (SELECT MAX(sal_id) FROM sala));
SELECT setval('evento_eve_id_seq', (SELECT MAX(eve_id) FROM evento));
