/*==============================================================*/
/* Table: usuario                                               */
/*==============================================================*/
CREATE TABLE usuario (
   usu_id               SERIAL               not null,
   usu_nombre           TEXT                 not null,
   usu_password         TEXT                 not null,
   PRIMARY KEY (usu_id),
   UNIQUE (usu_nombre)
);

/*==============================================================*/
/* Default Admin User                                           */
/*==============================================================*/
INSERT INTO usuario (usu_nombre, usu_password) VALUES ('admin', 'admin');
