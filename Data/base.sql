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